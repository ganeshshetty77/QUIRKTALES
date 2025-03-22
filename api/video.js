const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      return res.status(500).json({ 
        success: false, 
        message: 'API key or Channel ID is missing in environment variables' 
      });
    }

    // First, get the uploads playlist ID from the channel
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Channel not found or no content available' 
      });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Now get the videos from the uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${API_KEY}`
    );
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No videos found in channel' 
      });
    }

    // Extract the video IDs
    const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId);
    
    res.json({ success: true, videoIds });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching videos from YouTube API' 
    });
  }
};