let currentListId = null;
// Define base API URL
const API_BASE = 'http://localhost:3000';

// Fetch and show all lists
async function fetchLists() {
  const res = await fetch(`${API_BASE}/lists`);
  const lists = await res.json();
  const container = document.getElementById('listsContainer');
  container.innerHTML = '';

  lists.forEach(list => {
    const li = document.createElement('li');
    const listSpan = document.createElement('span');
listSpan.textContent = list.name;
listSpan.style.cursor = 'pointer';
listSpan.onclick = () => selectList(list.id, list.name);

const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.classList.add('delete-button');


deleteButton.style.marginLeft = '10px';
deleteButton.onclick = async (e) => {
  e.stopPropagation();
  await fetch(`${API_BASE}/lists/${list.id}`, { method: 'DELETE' });
  fetchLists();
  document.getElementById('tasksSection').style.display = 'none';
};

li.appendChild(listSpan);
li.appendChild(deleteButton);

    container.appendChild(li);
  });
}

// Create a new list
async function createList() {
  const input = document.getElementById('newListInput');
  const listName = input.value.trim();
  if (!listName) return;

  await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: listName })
  });

  input.value = '';
  fetchLists();
}

// Select a list and fetch its tasks
async function selectList(id, name) {
  currentListId = id;
  document.getElementById('tasksSection').style.display = 'block';
  document.getElementById('currentListTitle').textContent = `Tasks for: ${name}`;
  fetchTasks(id);
}

// Fetch tasks for a list
async function fetchTasks(listId) {
  const res = await fetch(`${API_BASE}/tasks/${listId}`);
  const tasks = await res.json();
  const container = document.getElementById('tasksContainer');
  container.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
textSpan.textContent = task.description + (task.completed ? '' : '');
textSpan.style.cursor = 'pointer';
textSpan.style.textDecoration = task.completed ? 'line-through' : 'none';
textSpan.onclick = async () => {
  await fetch(`${API_BASE}/tasks/${task.id}/toggle`, { method: 'PUT' });
  fetchTasks(currentListId);
};

const deleteButton = document.createElement('button');
deleteButton.textContent = '';
deleteButton.style.marginLeft = '10px';
deleteButton.onclick = async () => {
  await fetch(`${API_BASE}/tasks/${task.id}`, { method: 'DELETE' });
  fetchTasks(currentListId);
};

li.appendChild(textSpan);
li.appendChild(deleteButton);

    container.appendChild(li);
  });
}

// Add a task to the current list
async function addTask() {
  const input = document.getElementById('newTaskInput');
  const description = input.value.trim();
  if (!description || currentListId === null) return;

  await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ list_id: currentListId, description })
  });

  input.value = '';
  fetchTasks(currentListId);
}

// Initial load
fetchLists();


