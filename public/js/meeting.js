var timeElement = document.querySelectorAll('#appointmentTime');
var dateElement = document.querySelectorAll('#appointmentDate');
var appointmentTime = timeElement.innerText;
var appointmentDate = dateElement.innerText;

// Convert time and date to moment objects
var momentTime = moment(appointmentTime, 'h:mm A').format('h:mm A');
var momentDate = moment(appointmentDate, 'YYYY-MM-DD').format('MM/DD/YYYY');


console.log("Appointment Time (Moment):", momentTime);
console.log("Appointment Date (Moment):", momentDate);
