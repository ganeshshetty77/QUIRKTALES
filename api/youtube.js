export default function handler(req, res) {
  const apiKey = YOUTUBE_API_KEY;
  const channelId = YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
      return res.status(500).json({ error: 'YouTube API credentials not configured' });
  }

  res.status(200).json({
      apiKey,
      channelId
  });
} 