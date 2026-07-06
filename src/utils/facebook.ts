export async function postToFacebook(title: string, excerpt: string, imageUrl: string, articleUrl: string) {
  const proxyUrl = import.meta.env.VITE_FACEBOOK_PROXY_URL || 'http://localhost:3001/api/facebook/post';

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        excerpt,
        imageUrl,
        articleUrl,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Failed to post to Facebook proxy:', data.error || response.statusText);
      return { success: false, error: data.error || 'Failed to post to Facebook proxy' };
    }

    console.log('Successfully sent article to Facebook proxy');
    return { success: true, postId: data.postId };
  } catch (error) {
    console.error('Error sending article to Facebook proxy:', error);
    return { success: false, error: 'Error sending article to Facebook proxy' };
  }
}

export async function deleteFromFacebook(postId: string) {
  const proxyUrl = `http://localhost:3001/api/facebook/post/${postId}`;

  try {
    const response = await fetch(proxyUrl, {
      method: 'DELETE',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Failed to delete from Facebook proxy:', data.error || response.statusText);
      return { success: false, error: data.error || 'Failed to delete from Facebook proxy' };
    }

    console.log('Successfully deleted from Facebook proxy');
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Facebook proxy:', error);
    return { success: false, error: 'Error deleting from Facebook proxy' };
  }
}
