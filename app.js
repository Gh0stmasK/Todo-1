document.addEventListener("DOMContentLoaded", () => {
    const saveTasksFromStorage = JSON.parse(localStorage.getItem("task"));
    if (saveTasksFromStorage) {
        saveTasksFromStorage.forEach((tasks) => task.push(tasks));
        updateTaskList();
        updateStats();
    }
});

let task = [];
let editingIndex = null;

const saveTasks = () => {
    localStorage.setItem("task", JSON.stringify(task));
};

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();
    if (!text) return;

    if (editingIndex !== null) {
        task[editingIndex].text = text;
        editingIndex = null;
        document.getElementById("newTask").textContent = "+";
    } else {
        task.push({ text: text, completed: false });
    }

    taskInput.value = "";
    updateTaskList();
    updateStats();
    saveTasks();
    // console.log(task);
};

const toggleTaskComplete = (index) => {
    task[index].completed = !task[index].completed;
    if (editingIndex === index && task[index].completed) {
        editingIndex = null;
        const taskInput = document.getElementById("taskInput");
        taskInput.value = "";
        document.getElementById("newTask").textContent = "+";
    }
    updateTaskList();
    updateStats();
    saveTasks();
    // console.log({task});
};

const deleteTask = (index) => {
    task.splice(index, 1);
    if (editingIndex !== null) {
        // Reset editing state if current edit no longer makes sense
        editingIndex = null;
        document.getElementById("newTask").textContent = "+";
    }
    updateTaskList();
    updateStats();
    saveTasks();
}

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = task[index].text;
    editingIndex = index;
    document.getElementById("newTask").textContent = "✓";
}

const updateStats = () => {
    const completeTasks = task.filter(task => task.completed).length;
    const totalTasks = task.length;
    const progress = (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById("progress");

    progressBar.style.width = `${progress}%`;
    document.getElementById("numbers").innerText = `${completeTasks} / ${totalTasks}`;

    if (task.length && completeTasks === totalTasks) {
        blastConfetti();
    }
}

const updateTaskList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    task.forEach((task, index) => {
        const listItem = document.createElement("li");
        const editButtonHtml = task.completed
            ? ""
            : `<img src="./img/edit.png" onclick="editTask(${index})"/>`;
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                  <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} />
                  <p>${task.text}</p>
                </div>
                <div>
                                    ${editButtonHtml}
                  <img src="./img/bin.png" onclick="deleteTask(${index})"/>
                </div>
            </div
            `;
        listItem.addEventListener("change", () => toggleTaskComplete(index))
        taskList.append(listItem);
    });
};
document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});

// Confetti Animation on completing all tasks
const blastConfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}