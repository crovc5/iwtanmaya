const apiKey = 'AIzaSyD8knjDkSqUxKzPyPOVbMgUUYCQTnftY4k'; // Replace with your YouTube Data API key

function extractVideoId(url) {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

function fetchVideoDetails() {
    let videoId = document.getElementById('videoId').value;
    
    // Check if input is a URL and extract video ID if it is
    if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
        videoId = extractVideoId(videoId);
    }
    
    if (!videoId) {
        alert('Please enter a valid video ID or URL!');
        return;
    }

    // YouTube API URL to fetch video details
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,statistics`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const videoData = data.items[0];
            if (!videoData) {
                alert('Video not found!');
                return;
            }

            // Extract video details
            const title = videoData.snippet.title;
            const description = videoData.snippet.description;
            const uploadDate = videoData.snippet.publishedAt;
            const channelName = videoData.snippet.channelTitle;
            const subscriberCount = 'Data not available through API'; // Not available through this API directly
            const views = videoData.statistics.viewCount;
            const tags = videoData.snippet.tags ? videoData.snippet.tags.join(', ') : 'No tags available';

            // Update the DOM with the video details
            document.getElementById('video-title').textContent = `Title: ${title}`;
            document.getElementById('video-description').textContent = `Description: ${description}`;
            document.getElementById('video-views').textContent = `Views: ${views}`;
            document.getElementById('video-upload-date').textContent = `Upload Date: ${new Date(uploadDate).toLocaleString()}`;
            document.getElementById('channel-name').textContent = `Channel Name: ${channelName}`;
            document.getElementById('subscriber-count').textContent = `Subscriber Count: ${subscriberCount}`;
            document.getElementById('video-tags').textContent = `Tags: ${tags}`;
        })
        .catch(error => {
            console.error('Error fetching video details:', error);
            alert('Failed to fetch video details!');
        });
}
