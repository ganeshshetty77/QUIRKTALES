export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        const channelId = process.env.YOUTUBE_CHANNEL_ID;

        if (!apiKey || !channelId) {
            return res.status(500).json({ 
                error: 'YouTube API credentials not configured',
                message: 'Please set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID environment variables'
            });
        }

        res.status(200).json({
            apiKey,
            channelId
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}