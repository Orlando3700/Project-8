//The HTML DOM (Document Object Model) is a programming interface 
//that represents the structure of a web page in a way that 
//programming languages like JavaScript can understand and manipulate.

//The DOMContentLoaded event fires when the HTML document is fully 
//loaded and parsed, meaning the DOM is ready, but before external 
//resources like images and stylesheets are fully loaded. It allows
// scripts to execute as soon as the DOM is available.

document.addEventListener("DOMContentLoaded", function() {
    
    const createButton = document.getElementById("create-list-button");
    const listInput = document.getElementById("myList");

    // Event listener for the "Create" button
    createButton.addEventListener("click", function(event) {
	
	// Prevent the default form submission behavior
	//The preventDefault() method cancels the event if it is 
	//cancelable, meaning that the default action that belongs 
	//to the event will not occur.
	//For example, this can be useful when:
	//Clicking on a "Submit" button, prevent it from submitting a form
	//Clicking on a link, prevent the link from following the URL
	event.preventDefault();
	
	// Check if the input field is not empty
        if (listInput.value.trim() !== "") {
            // You can store the list title in local storage or 
			//process it as needed
            localStorage.setItem('listTitle', listInput.value.trim());

//Another way of writing code
// Trim the input value to remove leading/trailing whitespace
        //const listTitle = listInput.value.trim();

        // Check if the input field is not empty
        //if (listTitle !== "") {
            // Store the list title in local storage
            //localStorage.setItem('listTitle', listTitle);

            // Redirect to tasks.html
            window.location.href = "tasks.html";
        } else {
            // Alert the user if the input is empty
            alert("Please enter a title for your list.");

			// visually indicate the error
            listInput.style.borderColor = 'red';

			// Redirect to create.html
            window.location.href = "create.html";
        }
    });
});

