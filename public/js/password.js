function validatePassword() {
    // Get the user's input
    const password = document.getElementById("password").value;

    // Define your password criteria (e.g., at least 8 characters)
    const minLength = 8;

    // Regular expressions for additional criteria (e.g., at least one uppercase letter)
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    // Check if the password meets the criteria
    let isValid = true;

    if (password.length < minLength || !hasUppercase || !hasNumber) {
        isValid = false;
    }

    // Update the input field's style based on validity
    const passwordInput = document.getElementById("password");
    const passwordFeedback = document.getElementById("password-feedback");

    passwordInput.style.border = isValid ? "2px solid green" : "2px solid red";

    if (!isValid) {
        passwordFeedback.style.display = "block";
    } else {
        passwordFeedback.style.display = "none";
    }

    return isValid;
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");

    // Toggle password visibility
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}



// var doctorsDataElement = document.getElementById('doctors-data');
// var doctors = JSON.parse(doctorsDataElement.getAttribute('data-doctors'));

// // Now you can use the 'doctors' array in your external script
// console.log("password .js")
// console.log(doctors);
