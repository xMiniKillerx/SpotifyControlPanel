import { app, BrowserWindow } from 'electron';

function Aplicacion() {
    const Ventana = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        }
    });
    Ventana.loadfile('index.html');
}

app.whenReady().then(Aplicacion);