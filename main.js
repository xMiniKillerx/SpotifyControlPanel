import { app, BrowserWindow, ipcMain, shell } from 'electron';
const path = require('path');
require('dotenv').config();
const express = require('express');

function Aplicacion() {
    const Ventana = new BrowserWindow({
        width: 400,
        height: 520,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    Ventana.loadFile('index.html');
}

app.whenReady().then(Aplicacion);