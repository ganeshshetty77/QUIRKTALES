const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
git init

// API endpoint to get videos
app.get('/api/videos', async (req, res) => {
  try {
    const channelResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    
    const playlistResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    res.json(playlistResponse.data.items.map(item => item.snippet.resourceId.videoId));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));