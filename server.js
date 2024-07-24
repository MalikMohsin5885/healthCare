const dboperations = require("./dboperations");
var Db = require("./dboperations");

var express = require("express");
const axios = require('axios');
require('dotenv').config();
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var app = express(); // Create an instance of Express
var bodyParser = require("body-parser");
var cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
var router = express.Router(); // Create an instance of Express router//Using express.Router. This enables to break routing logic into modules.

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router); // Attach the router to your app
app.use(express.static('public')); // Serve static files like CSS and Bootstrap

// // Now you can define your routes and route handlers on the 'router' object
// app.use((req, res, next) => {
//     // authentication authorization
//     console.log("middleware");
//     next();
// });


// --------------passport----------------------
// passport.use(new LocalStrategy(function verify(email, password, done) {
//     dboperations.getUserTest(email,password).then(users =>{
//         if(users){
//             return done(null, users);
//         }
//         return done(null, false, { message: 'Invalid username or password.' });
//     });
// }));

const users = [];
let RID;

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log("i am in localstrategy")
        // Find the user by username
        // const user = users.find(u => u.username === username && u.password === password);

        // // Check if the user exists and the password is correct
        // if (user) {
        //     return done(null, [0]);
        // }

        // return done(null, false, { message: 'Invalid username or password.' });

        dboperations.getUserTest(username, password).then(user => {
            if (user.isPasswordMatch) {
                console.log("in dp op local")
                console.log(user)
                return done(null, user);
            }
            return done(null, false, { message: 'Invalid email or password.' });
        });

    }

));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    dboperations.ByID(id, "get").then(user => {
        done(null, user[0]);
    })

});

function checkUserRole(roleId) {
    return function (req, res, next) {

        if (req.isAuthenticated() && req.user[0].roleId == roleId) {
            return next();
        } else {
            res.redirect('/login');
        }
    };
}

// ----------------------------passport-------------------------


let User, role;



router.route("/add").get((req, res) => {
    dboperations.addUser().then(check => {
        if (check) {
            console.log("User added successfully.");
            res.send("User added successfully.");
        } else if (check == 2627) {

        } else {
            console.log("Error adding user.");
            res.status(500).send("Error adding user.");
        }
    });
});


// checks after authentication 
// sepatrate routes 
// local variable

// -------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {
    res.render('api');
});




// -----------------------------------------------------------------------------

// router.get('/admin', checkUserRole , (req, res) => {
//     if (req.isAuthenticated(1)) {
//         dboperations.getTotalUsers().then(result => {
//             console.log(result[0]);
//             res.render('Admin', { Users: result[0], role: 'dashboard' });
//         })
//     } else {
//         res.redirect('/login');
//     }
// });


app.get('/admin', checkUserRole(1), (req, res) => {
    dboperations.getTotalUsers().then(result => {
        console.log(result[0]);
        res.render('Admin', { Users: result[0], activeStatus: 'dashboard', Userdata: req.user[0] });
    })
});
router.get('/addadmin', (req, res) => {
    dboperations.addAdmin().then(() => {
        res.send("admin added")
    })
});

router.get('/User-Roles', checkUserRole(1), (req, res) => {
    dboperations.getRoles().then(result => {
        console.log(result[0])
        res.render("User-Roles", { Roles: result[0], activeStatus: 'user-roles' });
    })
});

router.get('/Add-Role', checkUserRole(1), (req, res) => {
    res.render("Add-Role", { role: 'user-roles' });
    //if update then get id show data acc to that user 
});

router.post('/Role/submission', checkUserRole(1), (req, res) => {
    dboperations.manageRoles(req.body, "add").then(result => {
        return res.redirect("/User-Roles")
    })
});

router.get("/doctor-management", checkUserRole(1), (req, res) => {
    role = "doctor"
    console.log(req.query.Search)
    dboperations.ByRoletest(req.query.Search, 2).then(result => {
        console.log("i am in doctor managemnet")
        console.log(result)
        res.render("User-management", { Users: result, activeStatus: "doctor" });
    })
})

router.get("/patient-management", checkUserRole(1), (req, res) => {
    role = "patient"
    console.log("search-----------------")
    console.log(req.query.Search)
    dboperations.ByRoletest(req.query.Search, 3).then(result => {
        console.log("i am in patient managemnet")
        // console.log(result)
        res.render("User-management", { Users: result, activeStatus: "patient" });
    })
})

// ---------------------------------------------------------------------------


// router.get("/patient-management" , (req,res)=> {
//     role = "patient"
//     const inputData = req.query.data;
//     dboperations.search(inputData,2).then(result=>{
//         console.log("i am in patient managemnet")
//         // console.log(result.data)
//         res.render("User-management" , {Users : [0] , role : "patient"});
//     })
// })


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

// --------------------------passport authenticate--------------
// if (req.isAuthenticated()) {

// } else {
//     res.redirect('login');
// }

// router.get('/Add-User', (req, res) => {
//     if (req.isAuthenticated()) {
//         dboperations.ByID(req.query.id, "get").then(result => {
//             res.render("Add-User", { doctors: result[0], role: role });
//         })
//     } else {
//         res.redirect('login');
//     }

// });
router.get('/Add-User', (req, res) => {
    if (req.isAuthenticated()) {
        dboperations.ByID(req.query.id, "get").then(result => {
            res.render("Add-User", { Userdata: result[0] });
        })
    } else {
        res.redirect('login');
    }
});



router.route("/Add-User/submission").post((req, res) => {
    console.log(role)//ik dafa role decide ho jae ga to wohi use hota raha ga 
    dboperations.addUser(req.body, role).then(check => {
        if (check) {
            console.log("User added successfully.");
            return res.redirect(role == "doctor" ? "/doctor-management" : "/patient-management");
        } else {
            role == undefined ?
                res.status(404).send("no role assigned") :
                res.status(404).send("email already exist")
        }
    });
})

router.route("/Update-User/submission").post((req, res) => {
    if (req.isAuthenticated()) {
        dboperations.UpdateUser(req.body, req.query.id).then(check => {
            if (check) {
                console.log("User added successfully.");
                console.log(req.user[0].roleId)
                if (req.user[0].roleId == 1)
                    return res.redirect(role == "doctor" ? "/doctor-management" : "/patient-management");
                else
                    return res.redirect("/dashboard")
            } else {
                role == undefined ?
                    res.status(404).send("no role assigned") :
                    res.status(404).send("email already exist")
            }
        });
    } else {
        res.redirect('login');
    }
})

router.route("/Delete-User").post((req, res) => {
    if (req.isAuthenticated()) {
        dboperations.ByID(req.body.UserId, "delete").then(check => {
            if (check) {
                console.log("User deleted successfully.");
                return res.redirect(role == "doctor" ? "/doctor-management" : "/patient-management");
            }
            else
                console.log("User not deleted");
        })
    } else {
        res.redirect('login');
    }

});

// ----------------------------------------------------------------------------------------------

router.get('/signup', (req, res) => {
    res.render('signup');
});


router.get('/login', (req, res) => {
    res.render('login');
});


router.route("/signup/submission").post((req, res) => {
    dboperations.addUser(req.body, 'patient').then(check => {
        if (check) {
            console.log("User added successfully.");
            return res.redirect('/login');
        } else {
            role == undefined ?
                res.status(404).send("no role assigned") :
                res.status(404).send("email already exist")
        }
    });
})


// app.post('/login/password', passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/failed'
// }));


app.post('/login/password', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed, redirect to /failed or handle accordingly
            req.flash('error', 'Invalid username or password');
            return res.redirect('/failed');
        }

        // Determine the user role (assuming there is a role property in the user object)
        let redirectPath = '/dashboard'; // Default redirect path for regular users
        console.log("test login")
        console.log(user)
        if (user.roleId === 1) {
            redirectPath = '/admin'; // Redirect path for admin users
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Login successful!');
            return res.redirect(redirectPath);
        });
    })(req, res, next);
});

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/failed', function (req, res, next) {
    const successMessage = req.flash('error');
    console.log("yyyyyooooooooooooooooooyyyyy")
    console.log(successMessage)
    res.send("failed")
});

// ---------------------------------------------------------------------

router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        // Retrieve success flash message
        const successMessage = req.flash('success');
        console.log("yyyyyyyyyyyyyyyyyy")
        console.log(successMessage)

        // Render the UserDashboard view with flash messages
        res.render('UserDashboard', { Userdata: req.user[0], successMessage });
    } else {
        res.redirect('login');
    }
});

// router.get('/dashboard', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render('UserDashboard', { Userdata: req.user[0]});
//     } else {
//         res.redirect('login');
//     }
// });

router.get('/edit-profile', (req, res) => {
    if (req.isAuthenticated()) {
        console.log("i am in edit profile get route")
        console.log(req.user[0])
        res.render("edit-profile", { Userdata: req.user });
    } else {
        res.redirect('login');
    }
});

router.get('/Consultation', (req, res) => {
    if (req.isAuthenticated()) {
        const successMessage = req.flash('success');
        console.log("cccccccccccccccccccyyyyyyyyy")
        console.log(successMessage)

        dboperations.getAppointments(req.user[0].UserId, "Patient").then(result => {
            // console.log("appointments data in route")
            // console.log(result)
            res.render("consultation.ejs", { Userdata: req.user[0], appointments: result, successMessage });
        });
    } else {
        res.redirect('login');
    }
});

router.get("/ZoomToken", (req, res) => {
    res.redirect("https://zoom.us/oauth/authorize?client_id=tYc877Q0QmOVf39hKWvMJA&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8090%2FAppointment");
})

router.get('/Appointment', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.query.code);
        dboperations.getToken(req.query.code).then(result => {
            process.env.TOKEN = result
            res.render("appointment.ejs", { Userdata: req.user[0] });
        });

    } else {
        res.redirect('login');
    }
});

router.post("/SubmitAjax", async (req, res) => {
    if (req.isAuthenticated()) {
        const formData = req.body.data;
        formData.Userid = req.user[0].UserId;
        console.log('Received data from form:', formData);

        try {
            const result = await dboperations.setAppointment(formData);
            if (result.success) {
                req.flash('success', 'Transaction successfull!');
                res.json({ success: true, message: 'Transaction successfull!' });
            } else {
                req.flash('failed', 'Transaction failed');
                res.json({ success: false, message: 'Transaction failed' });
            }

        } catch (error) {
            console.log("Error in router.post");
            console.log(error);
            res.json({ success: false, message: 'Error in making appointment' });
        }
    } else {
        res.redirect('login');
    }
});

// router.post("/SubmitAjax", (req, res) => {
//     if (req.isAuthenticated()) {
//         const formData = req.body.data;
//         formData.Userid = req.user[0].UserId;
//         console.log('Received data from form:', formData);
//         dboperations.setAppointment(formData).then(result => {
//             console.log("result")
//             console.log(result)
//             if(result.success){
//                 req.flash('success', 'Transaction successfull!');
//                 res.json({ success: true, message: req.flash('success') });
//             }else{
//                 req.flash('failed', 'Transaction failed');
//                 res.json({ success: false, message: req.flash('error') });
//             }
//             res.json({message: "undefined"});

//         })
//     } else {
//         res.redirect('login');
//     }
// })

// router.post("/SubmitAjax", (req, res) => {
//     const formData = req.body.data;
//     // Handle the received data here
//     console.log('Received data:', formData);
//     const {appointmentTime , appointmentDate , reason, StripeToken} = formData; 
//     stripe.charges.create({
//         amount: 58 * 100,
//         source: StripeToken,
//         currency: 'usd',
//         description: 'If needed then refund'
//     }).then(()=>{
//         //if payment successfull then stores data in db 
//         res.json({ success: true, message: 'appointment taken successfully' })
//     }).catch((e)=>{
//         console.log(e)
//         res.json({ success: true, message: 'error in making payment' })
//     })

//            //by doing this we send data back to ajax call
// })


router.get('/PendingConsultation', (req, res) => {
    if (req.isAuthenticated()) {
        dboperations.getAppointments(req.user[0].UserId, "Doctor").then(result => {
            res.render("prescription.ejs", { Userdata: req.user[0], appointments: result });
        });
    } else {
        res.redirect('login');
    }
});


var port = process.env.PORT || 8090
app.listen(port);
console.log("Order API is running at " + port);


// ---------------------------------------------------------------------------------------------------------------
/*

1.  in admin portion there are specific buttons so we dont need to redirect to other pages by other routes
but in case of update role we redirect to user management route with role query so here we see that while
redirecting we can send different data to the front like in update user submission we can send other data
while redireing or in user management we can send diff considering the fact that both redirect to same 
page with diff data

2.  url = http://localhost:8090/login/submission

router.route("/login/submission").post((req,res)=>{
    dboperations.getUser(req.body).then(result =>{
        if(result.isPasswordMatch)
            {
                res.render('User' , {Name : result.Name});
            }
        else
        res.status(404).send("email or password incorrect");
    })
})
When you use res.redirect('/User'), the browser is instructed to make a new GET request 
to the specified URL (/User). This results in a new URL in the browser's address bar.

However, when you use res.render('User', {Name: result.Name}), you are rendering the 'User' view 
directly in response to the POST request to '/login/submission'. This doesn't trigger a redirect, 
and the URL in the browser remains the same as the original request URL ('/login/submission'). 

3.  router.route("/login/submission").post((req,res)=>{
    dboperations.getUser(req.body).then(result =>{
        
        if(result.isPasswordMatch)
            {
                res.redirect('/User')
            }
        else
            res.status(404).send("email or password incorrect");
    })
})

router.get('/User', (req, res) => {
    res.render('User' , {Name : "deafult"});    
});

It follows the principle of separating concerns and using HTTP redirection to guide the client
to the appropriate resource after a successful operation (in this case, after a successful login). 
This is often referred to as the Post-Redirect-Get (PRG) pattern.

Here's a brief overview of the flow:

a.The user submits the login form to '/login/submission'.
b.If the login is successful, you use res.redirect('/User') to instruct the browser to make
 a new GET request to '/User'.
c.The browser then makes a GET request to '/User', and you render the 'User' view with the 
 appropriate data.

*/