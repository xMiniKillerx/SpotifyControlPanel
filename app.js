require('dotenv').config();
import ipcRenderer from 'electron';

async function callEndpoint(endpoint) {
    try {
        const res = await fetch('http://localhost:3000/${endpoint}');
        if (res.headers.get('content-type')?.includes('application/json')) {
            return await res.json();
        }
        return await res.text();
    } catch (error) {
        console.error('Error calling endpoint ${endpoint}:', error);
        return null;
    }
}
document.getElementById("playBtn").addEventListener("click", () => callEndpoint('play'));
document.getElementById("pauseBtn").addEventListener("click", () => callEndpoint('pause'));
document.getElementById("nextBtn").addEventListener("click", () => callEndpoint('next'));
document.getElementById("prevBtn").addEventListener("click", () => callEndpoint('previous'));

document.getElementById("volDownBtn").addEventListener("click", () => {
    const newVol = Math.max(Number(document.getElementById("volumeBar").value) - 10, 0);
    callEndpoint('volume/${newVol}');
    document.getElementById("volumeBar").value = newVol;
    document.getElementById("volLabel").textContent = `Volumen: ${newVol}%`;
});
document.getElementById("volUpBtn").addEventListener("click", () => {
    const newVol = Math.min(Number(document.getElementById("volumeBar").value) + 10, 100);
    callEndpoint('volume/${newVol}');
    document.getElementById("volumeBar").value = newVol;
    document.getElementById("volLabel").textContent = `Volumen: ${newVol}%`;
});
document.getElementById("volumeBar").addEventListener("input", (e) => {
    const newVol = e.target.value;
    callEndpoint('volume/${newVol}');
    document.getElementById("volLabel").textContent = `Volumen: ${newVol}%`;
});
function msToTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
async function refreshStatus() {
    const data = await callEndpoint('status');
    if (!data) return;

    document.getElementById("songTitle").textContent = data.title || 'No song playing';
    document.getElementById("songArtist").textContent = data.artist || '';
    document.getElementById("cover").textContent = data.album || '';

    const progress = data.durationMs ? Math.floor(((data.progressMs || 0) / data.durationMs) * 100) : 0;
    document.getElementById("progressBar").value = progress;
    document.getElementById("timeLabel").textContent = `${msToTime(data.progressMs || 0)} / ${msToTime(data.durationMs || 0)}`;

    document.getElementById("volumeBar").value = data.volume || 50;
    document.getElementById("volLabel").textContent = `Volume: ${data.volume || 50}%`; 
}
setInterval(refreshStatus, 2000);
refreshStatus();


