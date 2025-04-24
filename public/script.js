// Initializes a variable to keep track of the currently selected
// list’s ID. It's null at the start, meaning no list is selected yet.
let currentListId = null;
// Define base API URL
const API_BASE = 'http://localhost:3000';

// Fetch and show all lists
// Makes an asynchronous HTTP GET request to /lists to get all the
// task lists.
async function fetchLists() {
  const res = await fetch(`${API_BASE}/lists`);
  // Parses the JSON response from the server into a JavaScript array called lists
  const lists = await res.json();
  // Selects the HTML element with ID listsContainer and clears its contents.
  const container = document.getElementById('listsContainer');
  container.innerHTML = '';

  // For each list, creates a new <li> (list item) and a <span> to display the list name.
  lists.forEach(list => {
    const li = document.createElement('li');
    const listSpan = document.createElement('span');
	// Sets the list name, makes the span look clickable, and assigns
	// a click event to select the list.
	listSpan.textContent = list.name;
	listSpan.style.cursor = 'pointer';
	listSpan.onclick = () => selectList(list.id, list.name);

	// Creates a delete button, gives it a label and CSS class, and
	// adds a left margin for spacing.
	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.classList.add('delete-button');
	deleteButton.style.marginLeft = '10px';
	
	// Assigns a click event to the delete button. e.stopPropagation()
	// prevents the click from triggering the list selection event.
	deleteButton.onclick = async (e) => {
  		e.stopPropagation();
		// Sends a DELETE request to remove the list. Then refreshes
		// the list view and hides the tasks section.
  		await fetch(`${API_BASE}/lists/${list.id}`, { method: 'DELETE' });
  		fetchLists();
  		document.getElementById('tasksSection').style.display = 'none';
	};

	// Appends the span and button to the list item, then adds
	// the item to the container.
	li.appendChild(listSpan);
	li.appendChild(deleteButton);
    container.appendChild(li);
  	});
}

// Create a new list
// Gets the value of the input field, trims whitespace, and returns if it's empty.
async function createList() {
  const input = document.getElementById('newListInput');
  const listName = input.value.trim();
  if (!listName) return;

  // Sends a POST request to create a new list with the given name.
  await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: listName })
  });
  // Clears the input field and refreshes the list view.
  input.value = '';
  fetchLists();
}

// Select a list and fetch its tasks
// Sets the current list ID, shows the task section, updates the
// title with the list name, and fetches tasks for that list.
async function selectList(id, name) {
  currentListId = id;
  document.getElementById('tasksSection').style.display = 'block';
  document.getElementById('currentListTitle').textContent = `Tasks for: ${name}`;
  fetchTasks(id);
}

// Fetch tasks for a list
// Fetches tasks for a given list and clears the container before
// displaying new tasks.
async function fetchTasks(listId) {
  const res = await fetch(`${API_BASE}/tasks/${listId}`);
  const tasks = await res.json();
  const container = document.getElementById('tasksContainer');
  container.innerHTML = '';

  // For each task, creates a list item and span showing the task description.
  tasks.forEach(task => {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
	textSpan.textContent = task.description + (task.completed ? '' : '');

	// Makes the text look clickable and applies strikethrough if the task is completed.
	textSpan.style.cursor = 'pointer';
	textSpan.style.textDecoration = task.completed ? 'line-through' : 'none';
	
	// Assigns a click event that toggles the task's completion state and refreshes the task list.
	textSpan.onclick = async () => {
  		await fetch(`${API_BASE}/tasks/${task.id}/toggle`, { method: 'PUT' });
  		fetchTasks(currentListId);
	};

	// Creates a delete button for the task (though it has no
	// label—could be an icon or added later).
	const deleteButton = document.createElement('button');
	deleteButton.textContent = '';
	deleteButton.style.marginLeft = '10px';
	
	// Assigns a click event to delete the task and refresh the task list.
	deleteButton.onclick = async () => {
  		await fetch(`${API_BASE}/tasks/${task.id}`, { method: 'DELETE' });
  		fetchTasks(currentListId);
	};

	// Adds the span and button to the list item, and then appends
	// it to the tasks container.
	li.appendChild(textSpan);
	li.appendChild(deleteButton);
    container.appendChild(li);
  });
}

// Add a task to the current list
// Gets the task description, trims whitespace, and checks if a list
// is selected and description is valid.
async function addTask() {
  const input = document.getElementById('newTaskInput');
  const description = input.value.trim();
  if (!description || currentListId === null) return;

  // Sends a POST request to create a task under the selected list.
  await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ list_id: currentListId, description })
  });

  // Clears the input and refreshes the task list.
  input.value = '';
  fetchTasks(currentListId);
}

// Initial load
// When the script loads, this fetches and displays all existing lists.
fetchLists();


