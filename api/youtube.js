export default async function handler(req, res) {
  try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`);
      const data = await response.json();
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
  }
}
