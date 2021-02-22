
const taskForm = document.querySelector('#taskForm')
const taskName = document.querySelector('#taskName')
const taskLatitude = document.querySelector('#taskLatitude')
const taskLongitude = document.querySelector('#taskLongitude')

const taskList = document.querySelector('#taskList')


const { ipcRenderer } = require('electron')

let tasks = [];
let updateStatus = false;
let idTaskToUpdate = '';



function deleteTask(id) {
    const result = confirm('Etes vous sur de vouloir supprimer?')
    if (result) {
        ipcRenderer.send('delete-task', id);
    }
    return;
}

function editTask(id) {
    updateStatus = true
    idTaskToUpdate = id;
    const task = tasks.find(task => task._id === id)
    taskName.value = task.name;
    taskLatitude.value = task.latitude;
    taskLongitude.value = task.longitude;
    }



function rendertasks (tasks) {
    taskList.innerHTML = '';
    tasks.map(t => {
        taskList.innerHTML += `
            
             
            
                <li>
                    <h6>Id: ${t._id}</h6>
                    <p>Nom:  ${t.name}</p>
                    <p>Latitude: ${t.latitude}</p>
                    <p>Longitude: ${t.longitude}</p>
                    <button onclick="deleteTask('${t._id}')" type="submit" class="btn btn-primary">
                        Supprimer
                    </button>

                    <button onclick="editTask('${t._id}')" type="submit" class="btn btn-primary">
                        Modifier
                    </button>
                </li>
            
        `;
    })
}



taskForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const task = {
        name: taskName.value,
        latitude: taskLatitude.value,
        longitude: taskLongitude.value

    }

if(!updateStatus) {
    ipcRenderer.send('new-task', task );
} else {
    ipcRenderer.send('update-task', {...task, idTaskToUpdate} )
}

    taskForm.reset();
});


ipcRenderer.on('new-task-created', (e, args) => {
    const newTask = JSON.parse(args);
    tasks.push(newTask);
    rendertasks(tasks)
    alert('Nouveau site créé avec succes');
})


ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;
    rendertasks(tasks);
});


ipcRenderer.on('delete-task-success', (e,args) => {
   const DeletedTask =  JSON.parse(args);
   
   ipcRenderer.send('get-tasks');


   const newTasks = tasks.filter(t => {
       return t._id !== deleteTask._id;
   });
   tasks = newTasks;
   rendertasks(tasks);
});


ipcRenderer.on('update-task-success', (e, args) => {
    const updatedTask = JSON.parse(args);
    tasks = tasks.map(t => {
        if (t._id === updatedTask._id) {
            t.name = updatedTask.name;
            t.latitude = updatedTask.latitude;
            t.longitude = updatedTask.longitude;
            

        }
        return t;
    })
    rendertasks(tasks);
})