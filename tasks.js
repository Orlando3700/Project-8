document.addEventListener("DOMContentLoaded", function() {
	// Retrieve the list title from local storage
    var listTitle = localStorage.getItem('listTitle');

	// The innerText property sets or returns the text content of an element.
	// Display the list title on the page
    var header = document.querySelector('h1');
    if (listTitle) {
        header.innerText = `Add Tasks to: ${listTitle}`;
    } else {
        header.innerText = "No List Title Found";
    }

    var taskInput = document.getElementById("myInput");
    var addButton = document.getElementById("add-button");
    var submitButton = document.getElementById("submit-button");

	// Array to hold tasks for this list
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to render the list of tasks
	// The renderTasks() function is used to display all tasks stored 
	// in localStorage in an unordered list
    function renderTasks() {
        var taskList = document.getElementById('task-list');
		// Clear previous task list
        taskList.innerHTML = '';
        tasks.forEach(function(task, index) {
            var taskItem = document.createElement('li');
            taskItem.textContent = task;
            taskList.appendChild(taskItem);
        });
    }
	
	// Event listener for adding tasks
    addButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        const task = taskInput.value.trim();

        if (task !== "") {
            // Add the new task to the tasks array
            tasks.push(task);
            
            // Save tasks back to local storage
			// The tasks are saved in the localStorage using
			// JSON.stringify() to store them as a JSON string,
			// which makes it easy to retrieve them later
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Clear input field
            taskInput.value = "";

            // Re-render the tasks
            renderTasks();
        } else {
            alert("Please enter a task.");
        }
    });

    // Event listener for the "Submit" button (finished adding tasks, go to next page)
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();

        // You can either directly redirect to the next page (e.g., "save.html")
        // or save any final state/data before redirecting.
        if (tasks.length > 0) {
            window.location.href = "save.html"; // Redirect to the next page
        } else {
            alert("Please add at least one task before submitting.");
        }
    });

    // Render tasks when the page loads
    renderTasks();
});

