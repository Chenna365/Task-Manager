const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const notification = document.getElementById('notification');

let tasks = [];

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value, dateInput.value, timeInput.value);
});

function addTask(name, date, time) {
    const task = { id: Date.now(), name, date, time };
    tasks.push(task);
    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
    renderTasks();
    scheduleNotification(task);
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    taskItem.innerHTML = `
        <input type="text" value="${task.name}" class="edit-task-name">
        <input type="date" value="${task.date}" class="edit-task-date">
        <input type="time" value="${task.time}" class="edit-task-time">
        <div>
            <button onclick="saveTask(${id})">Save</button>
            <button onclick="renderTasks()">Cancel</button>
        </div>
    `;
}

function saveTask(id) {
    const task = tasks.find(t => t.id === id);
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    const newName = taskItem.querySelector('.edit-task-name').value;
    const newDate = taskItem.querySelector('.edit-task-date').value;
    const newTime = taskItem.querySelector('.edit-task-time').value;

    task.name = newName;
    task.date = newDate;
    task.time = newTime;

    renderTasks();
    scheduleNotification(task);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function renderTasks(searchTerm = '') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()));
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.id = task.id;
        taskItem.innerHTML = `
            <span>${task.name} - ${task.date} - ${task.time}</span>
            <div>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function scheduleNotification(task) {
    const taskTime = new Date(`${task.date}T${task.time}`).getTime();
    const currentTime = Date.now();
    const timeDifference = taskTime - currentTime;

    if (timeDifference > 0) {
        setTimeout(() => {
            showNotification();
        }, timeDifference);
    }
}

function playAlarm() {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.play();
}

function showNotification() {
    playAlarm();
    notification.style.display ='block';
    setTimeout(() => {
        notification.style.display = 'block';
    }, 5000); // Hide notification after 5 seconds
}
function removeExpiredTasks(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentTime = Date.now();

    // Keep only non-expired tasks
    tasks = tasks.filter(task => task.expiryTime > currentTime);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}