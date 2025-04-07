document.addEventListener("DOMContentLoaded", function() {
    var listContainer = document.getElementById("myLists");
    var searchInput = document.getElementById("myInput");
	var searchButton = document.getElementById("searchButton");

    // Load saved list titles from localStorage
    let savedLists = JSON.parse(localStorage.getItem('savedLists')) || [];

	console.log(savedLists); // Logs the saved lists immediately after loading from localStorage

    // Function to render the list of saved lists
	// The renderSavedLists() function loops over the saved lists and
	// creates an <li> element for each list. Each list item is
	// clickable, and when clicked, it saves the selected list's
	// title in localStorage and redirects to taskList.html.
    function renderSavedLists(filteredLists = savedLists) {
        listContainer.innerHTML = ''; // Clear the previous list

        filteredLists.forEach(function(list) {
			//Make sure the list is a string
			if (typeof list === "string") {
            var listItem = document.createElement('li');
            listItem.textContent = list;

            // Add event listener to each list item for navigation
            listItem.addEventListener('click', function() {
                // Store the selected list title in localStorage
                localStorage.setItem('currentListTitle', list);
                // Redirect to taskList.html with the selected list title
                window.location.href = 'taskList.html';
            });

            listContainer.appendChild(listItem);
			}
        });
    }

	// Function to highlight the matching list based on search input
    function highlightMatches(searchTerm) {
        var listItems = document.querySelectorAll("#myLists li");
        
        listItems.forEach(function(item) {
            var textContent = item.textContent.toLowerCase();
            if (textContent.includes(searchTerm.toLowerCase())) {
                item.style.backgroundColor = "yellow"; // Highlight matching item
            } else {
                item.style.backgroundColor = ""; // Reset background for no matching items
            }
        });
    }

	// Function to handle the search functionality
	// The user can search for a list by typing in the search box
	// (#myInput). The input event listener filters the savedLists
	// array by checking if the list title contains the search term
	// (case-insensitive).
	// The filtered lists are passed to the renderSavedLists()
	// function, which updates the list displayed on the page.
    searchButton.addEventListener("input", function() {
        var searchTerm = searchInput.value.trim();
		if (searchTerm) {
        var filteredLists = savedLists.filter(function(list) {
			return list.toLowerCase().includes(searchTerm.toLowerCase());
        });
		//Render filtered lists
        renderSavedLists(filteredLists);
		//Highlight matching lists
		highlightMatches(searchTerm);
	}else{
		// If search input is empty, render all lists without highlighting
            renderSavedLists();
        }
    });
    // Initially render the saved lists
    renderSavedLists();
});

	

