const newTaskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const filter = document.getElementById('filter');
let tasks = loadTasks();

function loadTasks() {
    const result = [];
    const count = Number(localStorage.getItem('todoCount')) || 0;

    for (let i = 0; i < count; i++) {
        result.push({
            id: Number(localStorage.getItem('todoId' + i)),
            text: localStorage.getItem('todoText' + i) || '',
            date: localStorage.getItem('todoDate' + i) || '',
            completed: localStorage.getItem('todoCompleted' + i) === 'true'
        });
    }

    return result;
}

function saveTasks() {
    const previousCount = Number(localStorage.getItem('todoCount')) || 0;

    for (let i = 0; i < previousCount; i++) {
        localStorage.removeItem('todoId' + i);
        localStorage.removeItem('todoText' + i);
        localStorage.removeItem('todoDate' + i);
        localStorage.removeItem('todoCompleted' + i);
    }

    for (let i = 0; i < tasks.length; i++) {
        localStorage.setItem('todoId' + i, tasks[i].id);
        localStorage.setItem('todoText' + i, tasks[i].text);
        localStorage.setItem('todoDate' + i, tasks[i].date);
        localStorage.setItem('todoCompleted' + i, tasks[i].completed);
    }

    localStorage.setItem('todoCount', tasks.length);
}

function renderTasks() {
    taskList.innerHTML = '';
    const visibleTasks = tasks.filter(task =>
        filter.value === 'all' ||
        (filter.value === 'active' && !task.completed) ||
        (filter.value === 'completed' && task.completed)
    );

    visibleTasks.forEach(task => {
        const item = document.createElement('li');
        item.className = 'task' + (task.completed ? ' completed' : '');

        if (!task.completed) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => {
                task.completed = true;
                saveTasks();
                renderTasks();
            });
            item.appendChild(checkbox);
        }

        const content = document.createElement('div');
        content.className = 'task-content';
        const title = document.createElement('span');
        title.textContent = task.text;
        const date = document.createElement('small');
        date.className = 'task-date';
        date.textContent = task.date;
        content.append(title, date);

        content.addEventListener('dblclick', () => {
            const editInput = document.createElement('input');
            editInput.className = 'edit-input';
            editInput.value = task.text;
            content.replaceWith(editInput);
            editInput.focus();
            editInput.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    const text = editInput.value.trim();
                    if (text) {
                        task.text = text;
                        saveTasks();
                    }
                    renderTasks();
                }
            });
        });
        item.appendChild(content);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-task';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', 'Видалити завдання');
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(current => current.id !== task.id);
            saveTasks();
            renderTasks();
        });
        item.appendChild(deleteButton);
        taskList.appendChild(item);
    });
}

newTaskInput.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const text = newTaskInput.value.trim();
    if (!text) return;
    const now = new Date();
    const date = now.toLocaleString('uk-UA', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
    tasks.push({ id: Date.now() + Math.random(), text, date, completed: false });
    newTaskInput.value = '';
    saveTasks();
    renderTasks();
});

filter.addEventListener('change', renderTasks);
renderTasks();
