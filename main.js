const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    win.loadURL('http://localhost:5173/');
}

app.whenReady().then(() => {
    // Use the system Python executable instead of venv
    const pythonPath = '/home/lazaro/anaconda3/bin/python3';  // Change this if your system Python is named differently (e.g., python3)
    const flaskAppPath = path.join(__dirname, 'Backend', 'app.py');

const flaskProcess = spawn(pythonPath, [path.join(__dirname, 'Backend', 'app.py')], {
    env: { ...process.env, VIRTUAL_ENV: path.resolve('venv') },
});
    createWindow();

    flaskProcess.stdout.on('data', (data) => {
        console.log(`Flask output: ${data}`);
    });

    flaskProcess.stderr.on('data', (data) => {
        console.error(`Flask error: ${data}`);
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
        flaskProcess.kill(); // Close Flask when Electron is closed
    });
});
