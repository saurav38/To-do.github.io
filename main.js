const task_input = document.querySelector('input');
const add_btn = document.querySelector('.add-task-button');
const todos_list = document.querySelector('.todos-list');
const alert_message = document.querySelector('.alert-message');
const delete_all_btn = document.querySelector('.delete-all-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

window.addEventListener('DOMContentLoaded', showAllTodos);

// Get random unique id
function getRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function addToDo(task_input) {
    let task = {
        id: getRandomId(),
        task: task_input.value,
        description: "", // Description field for the task
        status: "To Do", // Initial status set to "To Do"
        completed: false
    }
    todos.push(task);
}

task_input.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && task_input.value.length > 0) {
        addToDo(task_input);
        saveToLocalStorage();
        task_input.value = '';
        showAllTodos();
    }
});

add_btn.addEventListener('click', () => {
    if (task_input.value === '') {
        showAlertMessage('Please enter a task', 'error');
    } else {
        addToDo(task_input);
        saveToLocalStorage();
        showAllTodos();
        task_input.value = '';
        showAlertMessage('Task added successfully', 'success');
    }
});

delete_all_btn.addEventListener('click', clearAllTodos);

// Show all todos
function showAllTodos() {
    todos_list.innerHTML = '';
    todos.forEach((todo) => {
        const selectOptions = `
            <option value="" ${todo.status === 'To Do' ? 'selected' : ''}>To Do</option>
            <option value="" ${todo.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="" ${todo.status === 'Completed' ? 'selected' : ''}>Completed</option>
        `;

        todos_list.innerHTML += `
            <li class="todo-item" data-id="${todo.id}">
                <h3 class="task-title">${todo.task}</h3>
                <p class="task-description">${todo.description}</p>
                <div class="task-status">
                    <span class="status-label">${todo.status}</span>
                    <select class="status-dropdown" onchange="changeStatus('${todo.id}', this.value)">
                        ${selectOptions}
                    </select>
                </div>
                <div class="todo-actions">
                    <button class="btn btn-success" onclick="editTodo('${todo.id}')">
                        <i class="bx bx-edit-alt bx-sm"></i>    
                    </button>
                    <button class="btn btn-error" onclick="deleteTodo('${todo.id}')">
                        <i class="bx bx-trash bx-sm"></i>
                    </button>
                </div>
            </li>
        `;
    });
}

// Save todos to local storage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Show alert message
function showAlertMessage(message, type) {
    let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `
    alert_message.innerHTML = alert_box;
    alert_message.classList.remove('hide');
    alert_message.classList.add('show');
    setTimeout(() => {
        alert_message.classList.remove('show');
        alert_message.classList.add('hide');
    }, 3000);
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    showAlertMessage('Todo deleted successfully', 'success');
    showAllTodos();
}

// Edit todo
function editTodo(id) {
    let todo = todos.find(todo => todo.id === id);
    task_input.value = todo.task;
    todos = todos.filter(todo => todo.id !== id);
    add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
    saveToLocalStorage();
    add_btn.addEventListener('click', () => {
        add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>"; 
        showAlertMessage('Todo updated successfully', 'success');
    });
}

// Clear all todos
function clearAllTodos() {
    if(todos.length > 0) {
        todos = [];
        saveToLocalStorage();
        showAlertMessage('All todos cleared successfully', 'success');
        showAllTodos();
    }else{
        showAlertMessage('No todos to clear', 'error');
    }
}

// Change task status
function changeStatus(id, newStatus) {
    let todo = todos.find(todo => todo.id === id);
    todo.status = newStatus;
    saveToLocalStorage();
    showAlertMessage('Status updated successfully', 'success');

    const statusLabel = document.querySelector(`.todo-item[data-id="${id}"] .status-label`);
    statusLabel.textContent = newStatus;
    statusLabel.classList.add('highlight');
}

