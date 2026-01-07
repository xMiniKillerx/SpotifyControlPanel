require('dotenv').config();
import SpotifyWebApi from 'spotify-web-api-node';
const Api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUrl: process.env.SPOTIFY_URL
});

function play() {
    Api.play().then(() => {
        console.log('Playback started');
    }).catch(err => {
        console.error('Error starting playback:', err);
    });
}

function pause() {
    Api.pause().then(() => {
        console.log('Playback paused');
    }).catch(err => {
        console.error('Error pausing playback:', err);
    });
}

function next() {
    Api.skipToNext().then(() => {
        console.log('Skipped to next track');
    }).catch(err => {
        console.error('Error skipping to next track:', err);
    });
}

function previous() {
    Api.skipToPrevious().then(() => {
        console.log('Skipped to previous track');
    }).catch(err => {
        console.error('Error skipping to previous track:', err);
    });
}

function VolumeUp() {
    Api.getMyCurrentPlaybackState().then(data => {
        let currentVolume = data.body.device.volume_percent;
        let newVolume = Math.min(currentVolume + 10, 100);
        return Api.setVolume(newVolume);
    }).then(() => {
        console.log('Volume increased');
    }).catch(err => {
        console.error('Error increasing volume:', err);
    });
}

function VolumeDown() {
    Api.getMyCurrentPlaybackState().then(data => {
        let currentVolume = data.body.device.volume_percent;
        let newVolume = Math.max(currentVolume - 10, 0);
        return Api.setVolume(newVolume);
    }).then(() => {
        console.log('Volume decreased');
    }).catch(err => {
        console.error('Error decreasing volume:', err);
    });
}