const { app, BrowserWindow, Menu } = require('electron');
 
let win;
 
let createWindow = () => {
    win = new BrowserWindow({width:800, height: 900});
    win.loadURL(`file://${__dirname}/../../src/ui/pages/index.html`);

    win.on('closed', () => {
        win = null;
    });

    //win.webContents.openDevTools();

    //create menus
    const template:any = [
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                // {type: 'separator'},
                // {role: 'cut'},
                // {role: 'copy'},
                // {role: 'paste'},
                // {role: 'pasteandmatchstyle'},
                // {role: 'delete'},
                // {role: 'selectall'}
            ]
        },
        {
            label: 'View',
            submenu: [
                // {role: 'reload'},
                // {role: 'forcereload'},
                {role: 'toggledevtools'},
                // {type: 'separator'},
                // {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
                // {
                //     label: 'Archive',
                //     click () { alert('archive!') }
                // }
            ]
        },
        {
            role: 'window',
            submenu: [
                {role: 'minimize'},
                {role: 'close'}
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click () { require('electron').shell.openExternal('https://electronjs.org') }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});
 
app.on('activate', () => {
    if(win === null) createWindow();
});