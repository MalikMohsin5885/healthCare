// function SubmitAjax(formObject) {
//     console.log("i m in SubmitAjax")
//     console.log(formObject)

//     fetch('/SubmitAjax', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ data: formObject }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//             // Handle the response here
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//             // Handle errors here
//     });

// }

// document.addEventListener('DOMContentLoaded', function () {
//     var stripe = Stripe('pk_test_51OLNc6FA49tvY7bjmb3AUFx0QvB3CWcUM8zHTOIs8hEQE2TKPaz9ccTUlEDS4uozhxcx1PooKJAJuOEsL5MEKdTp000JUhpxqC');
//     var elements = stripe.elements();

//     var cardElement = elements.create('card', { hidePostalCode: true });
//     cardElement.mount('#card-element');

//     var form = document.getElementById('payment-form');
//     console.log(form)
//     if (form) {
//         form.addEventListener('submit', function (event) {
//             event.preventDefault();

//             let formData = new FormData(form);

//             let formObject = {}
//             for (let [key, value] of formData.entries()) {
//                 formObject[key] = value
//             }

//             //varify with stripe server
//             if (true) {//checks for any specific condition in which u dont wants to show card
//                 stripe.createToken(cardElement).then(function (result) {// this returns a token which contains id after verifyfying the valid card details from stripe server
//                     if (result.error) {
//                         console.error(result.error);
//                     } else {
//                         // Token is created, send it to your server for further processing
//                         console.log(result.token.id);
//                         formObject.StripeToken = result.token.id;
//                         console.log(formObject);
//                         SubmitAjax(formObject);
//                     }
//                 });
//             }

//         });
//     }
// });

function redirectToRoot() {
    // Redirect to the root route after 2 seconds
    setTimeout(function () {
        window.location.href = "/Consultation";
    }, 1);
}

function SubmitAjax(formObject) {
    console.log("I'm in SubmitAjax");
    console.log(formObject);

    fetch('/SubmitAjax', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formObject }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            redirectToRoot();
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here
        });
}

document.addEventListener('DOMContentLoaded', function () {
    var stripe = Stripe('pk_test_51OLNc6FA49tvY7bjmb3AUFx0QvB3CWcUM8zHTOIs8hEQE2TKPaz9ccTUlEDS4uozhxcx1PooKJAJuOEsL5MEKdTp000JUhpxqC');
    var elements = stripe.elements();

    var cardElement = elements.create('card', { hidePostalCode: true });
    cardElement.mount('#card-element');

    var form = document.getElementById('payment-form');
    console.log(form);
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            let formData = new FormData(form);

            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            // Verify with stripe server
            if (true) { // Replace with your condition
                stripe.createToken(cardElement).then(function (result) {
                    if (result.error) {
                        console.error(result.error);
                    } else {
                        // Token is created, send it to your server for further processing
                        console.log(result.token.id);
                        formObject.StripeToken = result.token.id;
                        console.log("i am going to print form data");
                        console.log(formObject);
                        SubmitAjax(formObject);
                    }
                });
            }
        });
    }
});


//https://docs.telerik.com/kendo-ui/intro/widget-basics/events-and-methods
$(document).ready(function () {
    // create DatePicker from input HTML element
    $("#datepicker").kendoDatePicker({
        dateInput: true,
        // disableDates: function (date) {
        //     var disabled = ["13-12-2023", "14-11-2023", "20-12-2023", "21-11-2023"];

        //     // Format the current date to match the format of disabled dates
        //     var formattedDate = kendo.toString(date, "dd-MM-yyyy");

        //     // Check if the formatted date is in the array of disabled dates
        //     return disabled.indexOf(formattedDate) > -1;
        // }
    });
});




// Target the input element by using jQuery and then call the kendoTimePicker() method.
$("#timepicker").kendoTimePicker({
    // Add some basic configuration.
    value: new Date(2023, 0, 1, 10, 30),
});
