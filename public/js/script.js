// -------------------------------with post-----------------------------------------

// function SearchAjax(){
//     console.log("i m in SearchAjax")

//     var SearchInput = document.getElementById("SearchInput").value;
//     console.log(SearchInput)

//     fetch('/api/Ajax' , {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ data: SearchInput }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         // Handle the response here
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         // Handle errors here
//     });
    
// }

// ------------------------------with get--------------------------------------------
// function SearchAjax() {
//     console.log("i m in SearchAjax")

//     var SearchInput = document.getElementById("SearchInput").value;
//     console.log(SearchInput)

//     fetch(`/api/Ajax?data=${encodeURIComponent(SearchInput)}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         // Handle the response here
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         // Handle errors here
//     });
// }


// function SearchAjax(role) {
//     console.log("i m in SearchAjax")

//     var SearchInput = document.getElementById("SearchInput").value;
//     console.log(SearchInput)

//     fetch(`/api/${role}-management?data=${encodeURIComponent(SearchInput)}`, {
//         method: 'GET',
//     })
//     .then(data => {
//         console.log('Success:', data);
//         // Handle the response here
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         // Handle errors here
//     });
// }



// router.get("/Ajax" , (req, res) => {
//     const inputData = req.query.data;
//     // Handle the received data here
//     console.log('Received data:', inputData);

//     // console.log(role == "doctor" ? 2 : 3)
//     dboperations.serach(inputData, req.query.user == "doctor" ? 2 : 3).then(Searchresult => {
//         console.log(Searchresult[0][0])
//         res.json({ success: true, message: 'Data received successfully', Searchresult: Searchresult[0] });
//     })
// })

// -------------------------------on specific timeout---------------------------------
// let typingTimer; // Timer identifier
// const doneTypingInterval = 1000; // Time in milliseconds (1 second)

// // Function to update URL and store search value in localStorage
// function updateUrl(event) {
//     // Get the input value
//     const inputValue = event.target.value;

//     // Log the input value to the console
//     console.log('Input value:', inputValue);

//     // Update the URL without refreshing the page
//     history.pushState({}, "", `?Search=${inputValue}`);

//     // Store the input value in localStorage
//     localStorage.setItem('searchValue', inputValue);

//     // Clear the previous typing timer
//     clearTimeout(typingTimer);

//     // Set a new typing timer
//     typingTimer = setTimeout(() => {
//         console.log('User stopped typing.');
//         // Reload the page with the new URL after a delay
//         location.reload();
//     }, doneTypingInterval);
// }




// function updateUrl(event) {
//     // Get the input value
//     const inputValue = event.target.value;

//     // Log the input value to the console
//     console.log('Input value:', inputValue);

//     // Update the URL without refreshing the page
//     history.pushState({}, "", `?Search=${inputValue}`);
// }

// function handleEnter(event) {
//     // Check if the Enter key is pressed (key code 13)
//     if (event.keyCode === 13) {
//         // Log the input value to the console
//         const inputValue = document.getElementById('SearchInput').value;
//         console.log('Input value on Enter:', inputValue);

//         // Force a page reload with the new URL
//         location.reload();
//     }
// }


let typingTimer; // Timer identifier
const doneTypingInterval = 1000; // Time in milliseconds (1 second)

// Function to update URL and store search value in localStorage
function updateUrl(event) {
    // Get the input value
    const inputValue = event.target.value;

    // Log the input value to the console
    console.log('Input value:', inputValue);

    // Update the URL without refreshing the page
    history.pushState({}, "", `?Search=${inputValue}`);

    // Store the input value in localStorage
    localStorage.setItem('searchValue', inputValue);

    // Clear the previous typing timer
    clearTimeout(typingTimer);

    // Set a new typing timer
    typingTimer = setTimeout(() => {
        console.log('User stopped typing.');
        // Reload the page with the new URL after a delay
        location.reload();
    }, doneTypingInterval);
}

// Function to handle Enter key
function handleEnter(event) {
    // Check if the Enter key is pressed (key code 13)
    if (event.keyCode === 13) {
        // Log the input value to the console
        const inputValue = document.getElementById('SearchInput').value;
        console.log('Input value on Enter:', inputValue);

        // Cancel the previous typing timer
        clearTimeout(typingTimer);

        // Store the input value in localStorage
        localStorage.setItem('searchValue', inputValue);

        // Force a page reload with the new URL
        location.reload();
    }
}

// Function to set the search box value on page load
function setPageLoadValue() {
    const searchValue = localStorage.getItem('searchValue');
    if (searchValue) {
        document.getElementById('SearchInput').value = searchValue;
    }
}

// Call setPageLoadValue on page load to set the search box value
setPageLoadValue();


