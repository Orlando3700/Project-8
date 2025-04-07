document.addEventListener("DOMContentLoaded", function() {
	
	var taskListContainer = document.getElementById("taskListContainer"); // Container for the tasks
    var taskInput = document.getElementById("taskInput"); // Input field for adding a new task
    var addTaskButton = document.getElementById("addTaskButton"); // Button to add a new task

    // Get the list title from localStorage
    var currentListTitle = localStorage.getItem('currentListTitle');
	// If there is no list title in localStorage, go back to the
	// saved lists page
    if (!currentListTitle) {
        alert("No list selected.");
        window.location.href = 'save.html';
        return;
    }
	
	//Display list title
    document.getElementById("listTitle").textContent = `Tasks for: ${currentListTitle}`;

    // Display the list title on the page
    var listTitleElement = document.createElement('h2');
    listTitleElement.textContent = currentListTitle;
    document.body.prepend(listTitleElement);

    // Load tasks for this list from localStorage
    let tasks = JSON.parse(localStorage.getItem(currentListTitle)) || [];

    // Function to render the tasks
    function renderTasks() {
        //var taskListContainer = document.getElementById('myLists');
		//Clear previous tasks
        taskListContainer.innerHTML = ''; 

        // Display each task as an <li> element
		// Create a task item container
        tasks.forEach(function(task, index) {
            var taskItem = document.createElement('li');
			taskItem.classList.add('task-item');
            //listItem.textContent = task;
            //taskListContainer.appendChild(listItem);

			// Create the checkbox
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function() {
                // Toggle the completed status of the task
                task.completed = checkbox.checked;
                saveTasks(); // Save the updated task list
            });
			
			// Create the task label (text)
            var taskLabel = document.createElement('span');
            taskLabel.textContent = task.name;
            if (task.completed) {
                taskLabel.style.textDecoration = 'line-through'; // Strike-through for completed tasks
            }

			// Create the delete button
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function() {
                // Remove the task from the tasks array
                tasks.splice(index, 1);
                // Save the updated task list
				saveTasks();
                // Re-render the tasks
				renderTasks();
            });

			// Append all elements to the task item
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskLabel);
            taskItem.appendChild(deleteButton);

            // Append the task item to the task list container
            taskListContainer.appendChild(taskItem);
        });
    }

	// Function to save the updated tasks to localStorage
    function saveTasks() {
        localStorage.setItem(currentListTitle, JSON.stringify(tasks));
    }

    // Function to add a new task
    //var addTaskButton = document.querySelector('.addBtn');
    //var taskInput = document.getElementById('myInput');

	//Function to add a new task
    addTaskButton.addEventListener('click', function() {
        var newTask = taskInput.value.trim();
        if (newTask !== "") {
			// Add the new task to the tasks array
            tasks.push({ name: newTask, completed: false });
            // tasks.push(newTask);
			// Save tasks back to localStorage
            // localStorage.setItem(listTitle, JSON.stringify(tasks));
		    saveTasks(); // Save the updated task list
            renderTasks(); // Re-render the tasks
            taskInput.value = ''; // Clear the input field
        } else {
            alert("Please enter a task.");
        }
    });

    // Initially render tasks for the selected list
    renderTasks();
});

