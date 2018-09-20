# Electron-Window-Position
>
> Easy and intuitive window positioning for electron browser windows.
>

When opening an Electron BrowserWindow one have to define an position or use the default, which centers the
window over all screens.  
On some systems the default centering won't open the window on your current screen, e.g. the window could open on a monitor 
which is switched off.

This package detects on which screen the users mouse is and centers the window on that screen. Or opens it in the top
left corner of that screen.

## Installation
```
npm install electron-window-position --save
```

## Usage
```node
const electron = require('electron');
const WindowPosition = require( 'electron-window-position' );

// Open window on electron.app.ready
new WindowPosition( function ( pos ){
  mainWindow = new electron.BrowserWindow({
      x: pos.x, 
      y: pos.y,
      width: 300,
      height: 300,
      show: true,
      resizable: false
  });
});
```

```node
const electron = require('electron');
const WindowPosition = require( 'electron-window-position' );

// Get position for centered window
var position = new WindowPosition();
try{
  var pos = position.getActiveScreenCenter(300,300);
  
  mainWindow = new electron.BrowserWindow({
      x: pos.x, 
      y: pos.y,
      width: 300,
      height: 300,
      show: true,
      resizable: false
  });
} catch (e) {
	// electron.app not ready
}

```

See also JSDoc at [GitHub Pages](https://kimb-technologies.github.io/electron-window-position/WindowPosition.html)

