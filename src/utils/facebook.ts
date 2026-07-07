export async function postToFacebook(title: string, excerpt: string, imageUrl: string, articleUrl: string) {
  try {
    const response = await fetch('/api/facebook/post', {
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
      console.error('Failed to post to Facebook:', data.error || response.statusText);
      return { success: false, error: data.error || 'Failed to post to Facebook' };
    }

    console.log('Successfully posted article to Facebook');
    return { success: true, postId: data.postId };
  } catch (error) {
    console.error('Error posting article to Facebook:', error);
    return { success: false, error: 'Error posting article to Facebook' };
  }
}

export async function deleteFromFacebook(postId: string) {
  try {
    const response = await fetch(`/api/facebook/${postId}`, {
      method: 'DELETE',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Failed to delete from Facebook:', data.error || response.statusText);
      return { success: false, error: data.error || 'Failed to delete from Facebook' };
    }

    console.log('Successfully deleted from Facebook');
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Facebook:', error);
    return { success: false, error: 'Error deleting from Facebook' };
  }
}

export async function getFacebookPageInsights() {
  try {
    const response = await fetch('/api/facebook/insights', {
      method: 'GET',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Failed to fetch Facebook insights:', data.error || response.statusText);
      return { success: false, error: data.error || 'Failed to fetch Facebook insights' };
    }

    console.log('Successfully fetched Facebook insights');
    return { success: true, insights: data };
  } catch (error) {
    console.error('Error fetching Facebook insights:', error);
    return { success: false, error: 'Error fetching Facebook insights' };
  }
}
