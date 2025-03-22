const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      console.log('Missing environment variables:', { 
        hasApiKey: !!API_KEY, 
        hasChannelId: !!CHANNEL_ID 
      });
      return res.status(500).json({ 
        success: false, 
        message: 'API key or Channel ID is missing in environment variables' 
      });
    }

    console.log('Fetching channel data...');
    // First, get the uploads playlist ID from the channel
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    
    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      console.log('Channel API error:', errorText);
      return res.status(channelResponse.status).json({ 
        success: false, 
        message: `YouTube API error: ${errorText}` 
      });
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      console.log('No channel found:', channelData);
      return res.status(404).json({ 
        success: false, 
        message: 'Channel not found or no content available' 
      });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    console.log('Uploads playlist ID:', uploadsPlaylistId);

    // Now get the videos from the uploads playlist
    console.log('Fetching playlist items...');
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${API_KEY}`
    );
    
    if (!playlistResponse.ok) {
      const errorText = await playlistResponse.text();
      console.log('Playlist API error:', errorText);
      return res.status(playlistResponse.status).json({ 
        success: false, 
        message: `YouTube API error: ${errorText}` 
      });
    }
    
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      console.log('No videos found:', playlistData);
      return res.status(404).json({ 
        success: false, 
        message: 'No videos found in channel' 
      });
    }

    // Extract the video IDs
    const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId);
    console.log(`Found ${videoIds.length} videos`);
    
    return res.status(200).json({ success: true, videoIds });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Error fetching videos from YouTube API: ${error.message}` 
    });
  }
};