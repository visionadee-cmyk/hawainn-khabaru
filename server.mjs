import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.post('/api/facebook/post', async (req, res) => {
  const { title, excerpt, imageUrl, articleUrl } = req.body || {};
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  console.log('Facebook Post Request:', { title, excerpt, imageUrl, articleUrl, pageId, hasToken: !!accessToken });

  if (!pageId || !accessToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page credentials are not configured on the server.',
    });
  }

  const message = [title, excerpt].filter(Boolean).join('\n\n').trim();

  try {
    let requestBody = {
      message,
      access_token: accessToken,
      published: 'true',
      privacy: '{"value":"EVERYONE"}',
    };

    let endpoint = `https://graph.facebook.com/v20.0/${pageId}/feed`;

    // If image URL is provided, post as feed post with attached image
    if (imageUrl) {
      // Use feed endpoint with attached image for better visibility
      const messageWithLink = articleUrl 
        ? `${message}\n\nRead more: ${articleUrl}`
        : message;
      requestBody = {
        message: messageWithLink,
        link: imageUrl,
        access_token: accessToken,
        published: 'true',
        privacy: '{"value":"EVERYONE"}',
      };
    } else if (articleUrl) {
      // If no image but has article URL, post as link
      requestBody.link = articleUrl;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json().catch(() => ({}));
    console.log('Facebook API Response:', { status: response.status, data });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Facebook API request failed.',
      });
    }

    return res.json({ success: true, postId: data.id });
  } catch (error) {
    console.error('Facebook API Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

app.delete('/api/facebook/post/:postId', async (req, res) => {
  const { postId } = req.params;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({
      success: false,
      error: 'Facebook page credentials are not configured on the server.',
    });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Facebook API request failed.',
      });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Facebook posting proxy listening on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please kill the process using that port.`);
  }
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
