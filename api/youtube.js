export default function handler(req, res) {
    res.json({
      apiKey: process.env.YOUTUBE_API_KEY,
      channelId: process.env.YOUTUBE_CHANNEL_ID
    });
  }
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("redirect-btn");

    button.addEventListener("click", () => {
        const videoId = button.getAttribute("data-video-id"); // Get the video ID from the button's data attribute
        const youtubeAppLink = `youtube://www.youtube.com/watch?v=${videoId}`;
        const youtubeWebLink = `https://www.youtube.com/watch?v=${videoId}`;
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = youtubeAppLink;
            setTimeout(() => {
                window.location.href = youtubeWebLink; // Fallback if app isn't installed
            }, 1000);
        } else {
            window.open(youtubeWebLink, "_blank");
        }
    });
});

