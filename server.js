const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/download', async (req, res) => {
    try {
        const videoURL = req.body.videoURL;
        const resolution = req.body.resolution;

        // Get video information using ytdl.getInfo
        const info = await ytdl.getInfo(videoURL);

        // Get available video formats
        const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');

        // Find the desired video format based on resolution
        let selectedFormat;
        if (resolution === 'highest') {
            selectedFormat = videoFormats[0];
        } else if (resolution === 'lowest') {
            selectedFormat = videoFormats[videoFormats.length - 1];
        } else {
            // Implement logic to select resolution as needed
            // You can filter videoFormats array based on resolution preference
        }

        // Set response headers for video download
        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        // Stream video data as a response
        ytdl(videoURL, { format: selectedFormat })
            .pipe(res);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error downloading the video');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
