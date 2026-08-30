const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 256,
    height: 256,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      offscreen: true,
    },
  });

  const svgContent = fs.readFileSync(path.join(__dirname, '..', 'Logo.svg'), 'utf-8');
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; width: 256px; height: 256px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          svg { width: 256px; height: 256px; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 500));

  const image = await win.webContents.capturePage();
  const pngBuffer = image.toPNG();

  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'icon.png'), pngBuffer);
  fs.writeFileSync(path.join(__dirname, '..', 'renderer', 'public', 'icon.png'), pngBuffer);
  fs.writeFileSync(path.join(__dirname, '..', 'renderer', 'public', 'Logo.png'), pngBuffer);

  console.log('Saved assets/icon.png and renderer/public/icon.png size:', pngBuffer.length);
  app.quit();
});
