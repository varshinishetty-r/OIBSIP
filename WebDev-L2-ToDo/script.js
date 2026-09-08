const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        addedTime: new Date().toLocaleString(),
        completedTime: ""
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


function displayTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(function(task) {
        return task.completed === false;
    });

    const completed = tasks.filter(function(task) {
        return task.completed === true;
    });


    pendingCount.textContent = pending.length + " pending";

    completedCount.textContent = completed.length + " completed";

    if (pending.length === 0) {

        pendingTasks.innerHTML =
            '<div class="empty-message">' +
            '<div class="empty-icon">🌟</div>' +
            '<p>No pending tasks!</p>' +
            '<p>You are all caught up.</p>' +
            '</div>';
    }


    if (completed.length === 0) {

        completedTasks.innerHTML =
            '<div class="empty-message">' +
            '<div class="empty-icon">🎯</div>' +
            '<p>No completed tasks yet.</p>' +
            '<p>Complete a task to see it here.</p>' +
            '</div>';
    }


    pending.forEach(function(task) {
        createTask(task, pendingTasks);
    });


    // Display completed tasks

    completed.forEach(function(task) {
        createTask(task, completedTasks);
    });
}


function createTask(task, container) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";


    if (task.completed) {
        taskItem.classList.add("completed-task");
    }


    const taskInfo = document.createElement("div");

    taskInfo.className = "task-info";


    const taskText = document.createElement("div");

    taskText.className = "task-text";

    taskText.textContent = task.text;


    const timestamp = document.createElement("div");

    timestamp.className = "timestamp";


    if (task.completed) {

        timestamp.textContent =
            "Added: " + task.addedTime +
            " | Completed: " + task.completedTime;

    } else {

        timestamp.textContent =
            "Added: " + task.addedTime;
    }


    taskInfo.appendChild(taskText);

    taskInfo.appendChild(timestamp);

    const buttons = document.createElement("div");

    buttons.className = "task-buttons";

    const completeBtn = document.createElement("button");

    completeBtn.className = "complete-btn";

    completeBtn.textContent =
        task.completed ? "Undo" : "✓ Complete";


    completeBtn.onclick = function() {

        task.completed = !task.completed;

        if (task.completed) {
            task.completedTime = new Date().toLocaleString();
        } else {
            task.completedTime = "";
        }

        saveTasks();

        displayTasks();
    };

    const editBtn = document.createElement("button");

    editBtn.className = "edit-btn";

    editBtn.textContent = "✎ Edit";


    editBtn.onclick = function() {

        const newText = prompt(
            "Edit your task:",
            task.text
        );

        if (newText === null) {
            return;
        }

        if (newText.trim() === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = newText.trim();

        saveTasks();

        displayTasks();
    };

    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";

    deleteBtn.textContent = "✕ Delete";

    deleteBtn.onclick = function() {

        const answer = confirm(
            "Are you sure you want to delete this task?"
        );

        if (answer === true) {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();

            displayTasks();
        }
    };

    buttons.appendChild(completeBtn);

    buttons.appendChild(editBtn);

    buttons.appendChild(deleteBtn);

    const taskTop = document.createElement("div");

    taskTop.className = "task-top";

    taskTop.appendChild(taskInfo);

    taskTop.appendChild(buttons);

    taskItem.appendChild(taskTop);

    container.appendChild(taskItem);
}

addTaskBtn.onclick = function() {
    addTask();
};

taskInput.onkeydown = function(event) {

    if (event.key === "Enter") {
        addTask();
    }
};

displayTasks();

