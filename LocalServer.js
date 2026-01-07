(function LocalServer() {
    const express = Spicetify.Platform.Express || require("express");
    const app = express();
    const port = 3000;

    app.get("/play", async (_req, res) => {
        try {
            await Spicetify.Player.play();
            res.send("Playing");
        } catch (error) {
            res.status(500).send("Error playing track: " + error.message);
        }
    });

    app.get("/pause", async (_req, res) => {
        try {
            await Spicetify.Player.pause();
            res.send("Paused");
        } catch (error) {
            res.status(500).send("Error pausing track: " + error.message);
        }
    });

    app.get("/next", async (_req, res) => {
        try {
            await Spicetify.Player.next();
            res.send("Skipped to next track");
        }   catch (error) {
            res.status(500).send("Error skipping to next track: " + error.message);
        }
    });

    app.get("/previous", async (_req, res) => {
        try {
            await Spicetify.Player.previous();
            res.send("Went to previous track");
        } catch (error) {
            res.status(500).send("Error going to previous track: " + error.message);
        }
    });

    app.get("/status", async (_req, res) => {
        const track = Spicetify.Player.data.track;
        const status = {
            isPlaying: Spicetify.Player.isPlaying,
            progressMs: Spicetify.Player.getProgress(),
            durationMs: track?.duration_ms,
            title: track?.name,
            artist: track?.artistName,
            cover: track?.albumCover,
            volume: Spicetify.Player.getVolume(),
        };
        res.json(status);
    });

    app.get("/volume/:val", async (req, res) => {
        const val = parseInt(req.params.val, 10);
        try {
            await Spicetify.Player.setVolume(val);
            res.send(`Volume set to ${val}`);
        }
        catch (error) {
            res.status(500).send("Error setting volume: " + error.message);
        }
    });
    app.listen(port, () => {
        console.log(`LocalServer listening at http://localhost:${port}`);
    });
})();