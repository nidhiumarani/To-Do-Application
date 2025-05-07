let tasks = [];
let completedTask = [];

let toDoList = document.getElementById("task-list")
let taskDone = document.getElementById("completed-task");
let taskName = document.getElementById("new-task")
let addTask = document.querySelector("button");

async function getData() {
    try {
        const response = await fetch('http://localhost:3000/todos/tasks');
        console.log(response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("Connection not found")
        throw error;
    }
}

// creating the task 
async function createTodo(task) {
    let url = 'http://localhost:3000/todos/createTask';

    let data = {
        "name": task,
        "complete": false
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
}

// Mark task as complete
async function markComplete(id) {
    let url = "http://localhost:3000/todos/markComplete";

    let data = {
        "id": id
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;

}


// IIFE funtion :- (Immediately Invoked Function Expression) to create a private scope for variables and functions, preventing them from polluting the global scope  
(async function () {
    let data = await getData();

    let completedTaskRender = "";
    let taskRender = "";

    for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.completed === true) {
            completedTaskRender += `<li><p style="text-decoration: line-through; color: grey;">${item.name}</p></li>`;
        } else {
            taskRender += `<li id="task-${item._id}">
            <label for="${item._id}">${item.name}</label>
            <input type="checkbox" id="${item._id}" value="${item.name}"></li>`
        }

    }
    taskDone.insertAdjacentHTML("beforeend", completedTaskRender);
    toDoList.insertAdjacentHTML("beforeend", taskRender);

    // Selecting all the checkboxes on the webpage
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // go through each and check the checkbox is marked or not 
    checkboxes.forEach(checkbox => {
        checkbox.onclick = async function () {
            if (checkbox.checked === true) {
                let taskId = checkbox.id;
                let taskElement = document.getElementById("task-" + taskId);

                let result = await markComplete(taskId);

                if (taskElement) {
                    console.log("check",result)
                    let taskLabel = taskElement.querySelector("label").innerText;
                    let completedItem = `<li><p style="text-decoration: line-through; color: grey;">${taskLabel}</p></li>`;
                    taskDone.insertAdjacentHTML("beforeend", completedItem);
                    taskElement.remove();
                    document.location.reload();
                } else {
                    alert("Failed to mark task as completed.");
                }
            }
        };
    });

})();

// adding tasks to console
addTask.onclick = async function () {
    if (taskName.value === "") {
        alert("Please enter a task...")
    } else {
        let newTask = await createTodo(taskName.value);
        
        if (newTask && newTask.success === true) {
            document.location.reload();
        } else {
            alert("Something went wrong, please try again!!!")
        }
    }
};