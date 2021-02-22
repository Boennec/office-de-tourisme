const{ BrowserWindow, ipcMain } = require('electron')

const Task = require('./models/Task')



function createWindow(){
    const win = new BrowserWindow({
        webPreferences: {
            contextIsolation: true
          },
        width:800,
        height:700,
        webPreferences: {
            nodeIntegration: true
        }

    })
    win.loadFile('src/index.html')
}

ipcMain.on('new-task', async (e, args) => {
   const newTask =  new Task(args);
   const taskSaved = await newTask.save();
   console.log(taskSaved)
   e.reply('new-task-created', JSON.stringify(taskSaved));
})

ipcMain.on('get-tasks', async (e, args) => {
    const tasks = await Task.find();
    e.reply('get-tasks', JSON.stringify(tasks));
})


ipcMain.on('delete-task', async (e, args) => {
    const taskDeleted = await Task.findByIdAndDelete(args);
    e.reply('delete-task-success', JSON.stringify(taskDeleted));
})


ipcMain.on('update-task', async (e, args) => {
   const updatedTask =  await Task.findByIdAndUpdate(
        args.idTaskToUpdate, {name: args.name, 
                              latitude: args.latitude,
                              longitude: args.longitude
    }, {new: true});
    e.reply('update-task-success', JSON.stringify(updatedTask))
});

ipcMain.on('getVille', async (e,args) => {
    const listeVilles = await Task.find()
    e.reply('getVilleBack', JSON.stringify(listeVilles));
})
module.exports = { createWindow }

