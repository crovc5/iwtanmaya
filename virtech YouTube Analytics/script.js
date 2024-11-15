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
            const channelId = videoData.snippet.channelId;
            const views = videoData.statistics.viewCount;
            const tags = videoData.snippet.tags ? videoData.snippet.tags.join(', ') : 'No tags available';

            // Update most of the DOM elements
            document.getElementById('video-title').textContent = `Title: ${title}`;
            document.getElementById('video-description').textContent = `Description: ${description}`;
            document.getElementById('video-views').textContent = `Views: ${views}`;
            document.getElementById('video-upload-date').textContent = `Upload Date: ${new Date(uploadDate).toLocaleString()}`;
            document.getElementById('channel-name').textContent = `Channel Name: ${channelName}`;
            document.getElementById('video-tags').textContent = `Tags: ${tags}`;

            // Fetch subscriber count with a separate API call
            const channelUrl = `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${apiKey}&part=statistics`;
            return fetch(channelUrl);
        })
        .then(response => response.json())
        .then(data => {
            const subscriberCount = data.items[0].statistics.subscriberCount;
            document.getElementById('subscriber-count').textContent = 
                `Subscriber Count: ${parseInt(subscriberCount).toLocaleString()}`;
        })
        .catch(error => {
            console.error('Error fetching details:', error);
            alert('Failed to fetch video details!');
        });
}

function copyTags() {
    const tagsElement = document.getElementById('video-tags');
    const tagsText = tagsElement.textContent.replace('Tags: ', '');
    
    navigator.clipboard.writeText(tagsText).then(() => {
        const copyButton = document.querySelector('.copy-button');
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy Tags';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy tags:', err);
        alert('Failed to copy tags to clipboard');
    });
}
