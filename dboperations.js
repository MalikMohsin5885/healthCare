var config = require("./dbconfig");
const sql = require("mssql");
const axios = require('axios');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const bcrypt = require("bcrypt");
const moment = require('moment');


async function ByRole(role) {
    try {
        let pool = await sql.connect(config);
        let persons = await pool.request()
            .input('roleId', sql.Int, role)
            .query("Select * from Users where roleId = @roleId");
        return persons.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function ByRoletest(searchValue, role) {
    try {
        // let pool = await sql.connect(config);
        // let persons;
        // if(searchValue){
        //     console.log("print searchValue")
        //     console.log(searchValue) 

        //     persons = await pool.request()
        //     .input('roleId', sql.Int, role)
        //     .input('searchValue' , sql.VarChar , searchValue)
        //     .query("SELECT * FROM Users WHERE roleId = @roleId AND (fName LIKE '%' + @searchValue + '%' OR lName LIKE '%' + @searchValue + '%')");

        //     // console.log(persons1.recordsets[0])
        // }
        // else{
        //     console.log("no value")

        //     persons = await pool.request()
        //     .input('roleId', sql.Int, role)
        //     .query("Select * from Users where roleId = @roleId");

        // }

        let pool = await sql.connect(config);
        let persons;

        let query = "SELECT * FROM Users WHERE roleId = @roleId";

        if (searchValue) {
            query = `EXEC GetUserByRoleAndName @roleId = @roleId, @searchValue = @searchValue`;

            // query += " AND (fName = @searchValue OR lName = @searchValue)";
            // query += " AND (fName LIKE '%' + @searchValue + '%' OR lName LIKE '%' + @searchValue + '%')";
        }

        persons = await pool.request()
            .input('roleId', sql.Int, role)
            .input('searchValue', sql.VarChar, searchValue)
            .query(query);

        console.log("i want to test momentjs")
        var records = persons.recordsets[0]
        records.forEach(element => {
            element.dob = moment(element.dob).format('YYYY-MM-DD');
        });

        return records;
    } catch (error) {
        console.log(error);
    }
}


async function getTotalUsers() {
    try {
        let pool = await sql.connect(config);
        let count = await pool.request().query("Select roleId,count(distinct UserId) from Users group by roleId");

        return count.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function ByID(id, operation) {
    try {

        console.log(id)
        let pool = await sql.connect(config);
        if (operation == "delete") {
            let persons = await pool.request()
                .input('UserId', sql.Int, id)
                .query("EXEC DeleteUser @UserId = @UserId");
        }
        else if (operation == "get") {
            let persons = await pool.request()
                .input('UserId', sql.Int, id)
                .query("Select UserId,fName,lName,dob,gender,email,country,city,postcode,roleId from Users where UserId = @UserId");

            return persons.recordsets;
        }
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

async function search(keyValue, roleId) {
    try {
        let pool = await sql.connect(config);
        // const searchResult = await sql.query`EXEC SearchDatabase @KeyValue = ${keyValue}, @roleId = ${roleId}`;

        let request = pool.request()
            .input('searchValue', sql.NVarChar, searchValue)
            .query("SELECT * FROM Users WHERE roleId = @roleId AND (fName LIKE '%' + @keyValue + '%' OR lName LIKE '%' + @keyValue + '%')");

        console.log("search--------------------------------------------------------")
        console.log(searchResult.recordsets[0])
        console.log("search--------------------------------------------------------")

        const responseData = {
            success: true,
            data: searchResult.recordsets[0],
            message: "Search successful",
        };

        console.log("before returning responsedata")
        console.log(responseData)
        return responseData;
    } catch (error) {
        console.error(error);

        const errorResponse = {
            success: false,
            message: "Error during search",
            error: error.message, // You can customize this error message based on your needs
        };

        return errorResponse;
    }
}


// ----------------------------------------roles table-----------------------------------------------------------------------
async function getRoles() {
    try {
        let pool = await sql.connect(config);
        let myRoles = await pool.request()
            .query("Select * from Roles where roleId <> 1");

        return myRoles.recordsets;
    } catch (error) {
        console.log(error);
    }
}
async function manageRoles(bodyParams, operation) {
    try {
        let pool = await sql.connect(config);

        if (operation == "add") {
            let request = pool.request()
                .input('name', sql.VarChar, bodyParams.role)
                .query("INSERT INTO Roles (name) VALUES (@name)")
        }
        else if (operation == "update") {

        }
        else if (operation == "delete") {

        }



        // let pool = await sql.connect(config);
        // let myRoles = await pool.request()
        // .query("Select * from Roles");

        // return myRoles.recordsets;
    } catch (error) {
        console.log(error);
    }
}
async function addAdmin() {
    try {
        let hashedPassword = await bcrypt.hash("Admin", 10);
        let pool = await sql.connect(config);
        let request = pool.request()
            .query(`INSERT INTO Users (fName, lName, dob, gender, email, password, country, city, postcode, roleId) VALUES ('admin', 'admin', '1990-05-15', 'M', 'admin@gmail.com', '${hashedPassword}', 'Pakistan', 'Lahore', '54000', 1)`);
    } catch (error) {
        console.log(error);
    }
}





// -----------------------------------------------Update----------------------------------------------------------
async function UpdateUser(bodyParams, id) {
    try {
        console.log("db op update")
        console.log(bodyParams)
        let pool = await sql.connect(config);


        const dob = new Date(bodyParams.DOB);
        if (isNaN(dob)) {
            // Invalid date format
            console.log("Invalid date format for DOB");
            return false;
        }
        console.log(bodyParams.gender === 'male' ? 'M' : 'F')

        let hashedPassword;

        if (bodyParams.password !== '') {
            hashedPassword = await bcrypt.hash(bodyParams.password, 10); // 10 is the number of salt rounds
        } else {
            hashedPassword = undefined; // or any other value you want to use for an unchanged password
        }

        console.log("updateuserrole    " + id);

        const queryBuilder = await pool.request()
            .input('fName', sql.VarChar, bodyParams.firstName)
            .input('lName', sql.VarChar, bodyParams.lastName)
            .input('dob', sql.Date, dob)
            .input('gender', sql.VarChar, bodyParams.gender == 'male' ? 'M' : 'F')
            .input('email', sql.VarChar, bodyParams.email)
            .input('country', sql.VarChar, bodyParams.country)
            .input('city', sql.VarChar, bodyParams.city)
            .input('postcode', sql.Int, bodyParams.postcode)
            .input('UserId', sql.Int, id);

        if (hashedPassword !== undefined) {
            queryBuilder.input('password', sql.VarChar, hashedPassword);
        }

        await queryBuilder.query("UPDATE users SET fName = @fName, lName = @lName, dob = @dob, gender = @gender, email = @email" +
            (hashedPassword !== undefined ? ", password = @password" : "") +
            ", country = @country, city = @city, postcode = @postcode WHERE UserId = @UserId");

        return true;
    } catch (error) {
        console.log(error);
        // return error;
    }
}


//---------------------------------------signup operation------------------------------------------------
async function addUser(bodyParams, role) {
    try {
        console.log(bodyParams)
        let pool = await sql.connect(config);
        // await pool.request().query("insert into users (id,fName,lName,dob,gender,email,password,country,city,postcode,role_id) values ( 2, 'E', 'M','2023-2-4','M' , 'malikmohsin8239@gmail.com','Mona', 'P' , 'L','99','2')");
        // return persons.recordsets;


        // --------------------------email and role validation------------------------------
        var checkEmail = await pool.request()
            .input('email', sql.VarChar, bodyParams.email)
            .query("Select email from Users where email = @email");

        if (checkEmail.recordset.length > 0)
            return false
        else if (role == undefined)
            return false
        // ------------------------------------------------------------------------

        //this will not works bcz SQL is unable to recognize bodyParams as a valid identifier. SQL query is not correctly binding these parameters.
        // await pool.request().query("insert into users (id,fName,lName,dob,gender,email,password,country,city,postcode,role_id) values ( 5 , bodyParams.fName, bodyParams.lName, bodyParams.dob, bodyParams.gender, bodyParams.email, bodyParams.password, bodyParams.country, bodyParams.city, bodyParams.postcode, 2)");

        const dob = new Date(bodyParams.DOB);
        if (isNaN(dob)) {
            // Invalid date format
            console.log("Invalid date format for DOB");
            return false;
        }
        console.log(bodyParams.gender === 'male' ? 'M' : 'F')

        role = (role == 'doctor' ? 2 : role == 'patient' ? 3 : null);
        const hashedPassword = await bcrypt.hash(bodyParams.password, 10); // 10 is the number of salt rounds

        console.log("adduserrole    " + role)
        await pool.request()
            .input('fName', sql.VarChar, bodyParams.firstName)
            .input('lName', sql.VarChar, bodyParams.lastName)
            .input('dob', sql.Date, dob)
            .input('gender', sql.VarChar, bodyParams.gender == 'male' ? 'M' : 'F')
            .input('email', sql.VarChar, bodyParams.email)
            .input('password', sql.VarChar, hashedPassword)
            .input('country', sql.VarChar, bodyParams.country)
            .input('city', sql.VarChar, bodyParams.city)
            .input('postcode', sql.Int, bodyParams.postcode)
            .input('roleId', sql.Int, role)
            .query("INSERT INTO users (fName, lName, dob, gender, email, password, country, city, postcode, roleId) VALUES (@fName, @lName, @dob, @gender, @email, @password, @country, @city, @postcode, @roleId)");

        return true;
    } catch (error) {
        console.log(error);
        // return error;
    }
}
// -----------------------------------------------------------------------------------------------------

// --------------------------------------------login operation------------------------------------------

async function getUser(bodyParams) {
    try {
        let pool = await sql.connect(config);
        console.log("getuser " + bodyParams.email)
        var credentials = await pool.request()
            .input('email', sql.VarChar, bodyParams.email)
            .query("Select UserId,password from Users where email = @email");
        if (credentials.recordset.length > 0) {
            const hashedPassword = credentials.recordset[0].password;

            // Compare the hashed password with the provided password
            const isPasswordMatch = await bcrypt.compare(bodyParams.password, hashedPassword);

            return {
                isPasswordMatch: isPasswordMatch,
                id: credentials.recordset[0].UserId
            };
        } else
            return false;

    } catch (error) {
        console.log(error);
    }
}




async function getUserTest(email, password) {
    try {
        let pool = await sql.connect(config);
        console.log("getusertest " + email)
        var credentials = await pool.request()
            .input('email', sql.VarChar, email)
            .query("Select UserId,password,roleId from Users where email = @email");
        if (credentials.recordset.length > 0) {
            const hashedPassword = credentials.recordset[0].password;
            // Compare the hashed password with the provided password
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
            console.log(credentials.recordset[0])
            return {
                isPasswordMatch: isPasswordMatch,
                id: credentials.recordset[0].UserId,
                roleId: credentials.recordset[0].roleId
            };
        } else
            return { isPasswordMatch: undefined }
    } catch (error) {
        console.log(error);
    }
}

// -----------------------------------------------------------------------------------------------------

async function getAppointments(id, appointmentOf) {
    try {
        let pool = await sql.connect(config);
        var appointments = await pool
            .request()
            .input("UserId", sql.Int, id)
            .query(
                `select * from ${appointmentOf}AppointmentDetails where ${appointmentOf}ID = @UserId`
            );
        console.log("i am in getappointments")
        
        appointments.recordset.forEach(appointment => {
            console.log("Appointment Time:", appointment);
            appointment.Date = moment.utc(appointment.Date, 'MM/DD/YYYY').format('YYYY-MM-DD');
            appointment.Time = moment.utc(appointment.Time, 'h:mm A').format('h:mm A');
``
            console.log("Appointment Time:", appointment);
        });
        // console.log(appointments.recordset)

        // appointments.recordset.sort(function (a, b) {
        //     const dateComparison = new Date(b.Date) - new Date(a.Date);
        //     return dateComparison !== 0
        //         ? dateComparison
        //         : new Date(b.Time) - new Date(a.Time);
        // });

        return appointments.recordset;
    } catch (error) {
        console.log(error);
    }
}


function doctorWithMinPatients(doctorData) {
    if (!doctorData || doctorData.length === 0) {
        return null;
    }

    let minDoctor = doctorData[0];

    for (let i = 1; i < doctorData.length; i++) {
        if (doctorData[i].noOfPatients < minDoctor.noOfPatients) {
            minDoctor = doctorData[i];
        }
    }

    return minDoctor.DoctorID;
}

async function setAppointment(formData) {
    try {
        console.log("formData in controller");
        console.log(formData);
        const { appointmentTime, appointmentDate, reason, StripeToken, Userid } = formData;
        formattedDate = moment.utc(appointmentDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
        // Wrap the entire function in a Promise
        return new Promise(async (resolve, reject) => {
            try {

                // -----------------------------Stripe api call----------------------------------------

                //https://www.youtube.com/watch?v=g8GiODFEmaY
                //https://dashboard.stripe.com/test/payments?status[0]=successful
                //https://www.ultimateakash.com/blog-details/IixTLGAKYAo=/How-to-Integrate-Stripe-Payment-Gateway-In-Node.js-2022
                console.log("Before payment");
                const paymentResult = await stripe.charges.create({
                    amount: 58,
                    source: StripeToken,
                    currency: 'usd',
                    description: `Payment made by id = ${Userid}`
                });

                console.log("Payment submitted", paymentResult);
                // -----------------------------zooom api call----------------------------------------

                // https://www.youtube.com/watch?v=0lhgP6Qe6zg
                // https://github.com/adanzweig/nodejs-zoom/blob/master/server.js
                //https://marketplace.zoom.us/

                console.log("before meeting creation");

                const zoomApiResponse = await axios.post(
                    `https://api.zoom.us/v2/users/me/meetings`,
                    {
                        topic: 'Appointment Meeting',
                        type: 2, // Scheduled meeting
                        start_time: `${appointmentTime} Asia/Karachi`, // Append the timezone to the start_time
                        duration: 30, // Replace with the desired duration
                        timezone: 'Asia/Karachi',
                        settings: {
                            join_before_host: true,
                            // Add other settings as needed
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${process.env.TOKEN}`, // Function to obtain a valid Zoom token
                        },
                    }
                );

                // Extract the meeting ID and other details from the Zoom API response
                console.log("zoomApiResponse.data")
                console.log(zoomApiResponse.data)
                const { join_url, start_url, password, status, duration } = zoomApiResponse.data;



                console.log("meeting created successfully");
                // ---------------------------------------------------------------------

                const pool = await sql.connect(config);

                const selectDoctor = await pool.request().query(`
                Select Users.UserId as DoctorID, count(PatientID) as noOfPatients from Users left join Appointments
                on Users.UserId = Appointments.DoctorID where Users.roleId = 2 group by Users.UserId;`)

                console.log(selectDoctor.recordset);

                let DoctorID = doctorWithMinPatients(selectDoctor.recordset)

                console.log("doctorWithMinPatients", DoctorID)

                const appointmentInsertion = await pool.request()
                    .input('appointmentTime', sql.VarChar, appointmentTime)
                    .input('appointmentDate', sql.Date, formattedDate)
                    .input('reason', sql.VarChar, reason)
                    .input('PatientID', sql.Int, Userid)
                    .input('DoctorID', sql.Int, DoctorID)
                    .query(`INSERT INTO Appointments (
                        PatientID,
                        DoctorID,
                        Date,
                        Time, 
                        AppointmentStatus, 
                        ReasonForAppointment
                        ) OUTPUT INSERTED.AppointmentID VALUES (
                        @PatientID, 
                        @DoctorID, 
                        @appointmentDate, 
                        @appointmentTime, 
                        'Scheduled', 
                        @reason)`
                    );

                // Check if rowsAffected is greater than 0, meaning an appointment was inserted
                if (appointmentInsertion.rowsAffected[0] > 0) {
                    const insertedAppointmentID = appointmentInsertion.recordset[0].AppointmentID;
                    console.log("Appointment inserted into DB with ID:", insertedAppointmentID);

                    const paymentDetails = await pool.request()
                        .input('AppointmentID', sql.Int, insertedAppointmentID)
                        .input('Amount', sql.Decimal, 58)
                        .input('PaymentDate', sql.Date, moment().format('YYYY-MM-DD'))
                        .input('PaymentMethod', sql.VarChar, "Visa")
                        .query(`
                    INSERT INTO Payments (
                      AppointmentID,
                      Amount,
                      PaymentDate,
                      PaymentMethod
                    ) VALUES (
                      @AppointmentID,
                      @Amount,
                      @PaymentDate,
                      @PaymentMethod
                    );
                    `);

                    const meetingInsertion = await pool.request()
                        .input('AppointmentID', sql.Int, insertedAppointmentID)
                        .input('JoinURL', sql.VarChar, join_url)
                        .input('StartURL', sql.NVarChar, start_url)
                        .input('Password', sql.VarChar, password)
                        .input('Status', sql.VarChar, status)
                        .input('DurationMinutes', sql.Int, duration)
                        .query(`
                    INSERT INTO Meetings (
                      AppointmentID,
                      JoinURL,
                      StartURL,
                      Password,
                      Status,
                      DurationMinutes
                    ) VALUES (
                      @AppointmentID,
                      @JoinURL,
                      @StartURL,
                      @Password,
                      @Status,
                      @DurationMinutes
                    );
                  `);
                
                } else {
                    console.log("error  inserted into DB");
                }
                console.log("Appointment inserted into DB");
                resolve({ success: true, message: 'Appointment taken successfully' });
            } catch (error) {
                console.log("Error in setAppointment function");
                console.log(error);
                reject({ success: false, message: 'Error in making appointment' });
            }
        });
    } catch (error) {
        console.log("Catch block");
        console.log(error);
        return { success: false, message: 'Error in setAppointment function' };
    }
}

// async function getToken(code){
//     try{
//         console.log("i am in get token before post req")
//         console.log(code)
//         const response = await axios.post(
//             'https://zoom.us/oauth/token',
//             null,
//             {
//               params: {
//                 grant_type: 'authorization_code',
//                 code: code,
//                 redirect_uri: 'http://localhost:8090/Appointment',
//               },
//               headers: {
//                 'Authorization': `Basic ${Buffer.from(`${process.env.zoomApiKey}:${process.env.zoomApiSecret}`).toString('base64')}`,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//               },
//             }
//           );
//           console.log("i am in get token after post req")
//           process.env.TOKEN = response.data.access_token
//         console.log("process.env.TOKEN"); 
//         console.log(process.env.TOKEN); 
//         return process.env.TOKEN
//     }catch(error){
//         console.error('Error',error);
//         res.send('Error');
//     }
// }

var zoomApiKey = 'tYc877Q0QmOVf39hKWvMJA';
var zoomApiSecret = '7H0ybgMIcLhzejU1Zb3tWsoYaarqnIKo';

async function getToken(code) {
    try {
        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: "http://localhost:8090/Appointment"
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(`${zoomApiKey}:${zoomApiSecret}`).toString('base64')}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error', error);
        res.send('Error');
    }
}



// async function setAppointment(formData) {

//     var check = 1
//     try {
//         console.log("formData")
//         console.log(++check)
//         const { appointmentTime, appointmentDate, reason, StripeToken, Userid } = formData;
//         stripe.charges.create({
//             amount: 58 * 100,
//             source: StripeToken,
//             currency: 'usd',
//             description: `Payment made by id = ${Userid}`
//         }).then(async function () {
//             try {
//                 let pool = await sql.connect(config);
//                 var appointmentData = await pool.request()
//                     .input('appointmentTime', sql.VarChar, appointmentTime)
//                     .input('appointmentDate', sql.Date, appointmentDate)
//                     .input('reason', sql.VarChar, reason)
//                     .input('UserId', sql.Int, Userid)
//                     .query("INSERT INTO Appointments (PatientID, DoctorID, Date, Time, AppointmentStatus, ReasonForAppointment) VALUES (@UserId, 10, @appointmentDate, @appointmentTime, 'Scheduled' , @reason)");
//                     console.log("payment submitted")
//                     console.log(++check)
//                 return { success: true, message: 'appointment taken successfully' }
//             } catch (error) {
//                 console.log("error in inserting appointments to db")
//                 console.log(error)
//             }
//         }).catch((e) => {
//             console.log("payment failed")
//             console.log(e)
//             return { success: false, message: 'error in making payment' }
//         })

//     } catch (error) {
//         console.log("catch")
//         console.log(error);
//     }
// }







// -----------------------------------------------------------------------------------------------------
module.exports = {
    ByRole: ByRole,
    getTotalUsers: getTotalUsers,
    ByID: ByID,
    addUser: addUser,
    getUser: getUser,
    UpdateUser: UpdateUser,
    getRoles: getRoles,
    search: search,
    manageRoles: manageRoles,
    addAdmin: addAdmin,
    getAppointments: getAppointments,
    setAppointment: setAppointment,
    getToken: getToken,
    //remove this function
    ByRoletest: ByRoletest,
    getUserTest: getUserTest
}
























// async function createZoomMeeting(appointmentTime) {
//     try {
//         const response = await axios.post(
//             'https://api.zoom.us/v2/users/me/meetings',
//             {
//                 topic: 'Appointment Meeting',
//                 type: 2,
//                 start_time: `${appointmentTime} Asia/Karachi`,
//                 duration: 30,
//                 timezone: 'Asia/Karachi',
//                 settings: {
//                     join_before_host: true,
//                     // Add other settings as needed
//                 },
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${process.env.TOKEN}`,
//                 },
//             }
//         );

//         return response.data;
//     } catch (error) {
//         console.error('Error in creating Zoom meeting:', error);
//         throw error;
//     }
// }

// async function insertAppointment(pool, formattedDate, appointmentTime, reason, Userid) {
//     try {
//         const result = await pool.request()
//             .input('appointmentTime', sql.VarChar, appointmentTime)
//             .input('appointmentDate', sql.Date, formattedDate)
//             .input('reason', sql.VarChar, reason)
//             .input('UserId', sql.Int, Userid)
//             .query(`
//                 INSERT INTO Appointments (
//                     PatientID,
//                     DoctorID,
//                     Date,
//                     Time,
//                     AppointmentStatus,
//                     ReasonForAppointment
//                 ) OUTPUT INSERTED.AppointmentID VALUES (
//                     @UserId,
//                     10,
//                     @appointmentDate,
//                     @appointmentTime,
//                     'Scheduled',
//                     @reason
//                 )
//             `);

//         return result.recordset[0].AppointmentID;
//     } catch (error) {
//         console.error('Error in inserting appointment:', error);
//         throw error;
//     }
// }

// async function insertMeeting(pool, insertedAppointmentID, join_url, start_url, password, status, duration) {
//     try {
//         const result = await pool.request()
//             .input('AppointmentID', sql.Int, insertedAppointmentID)
//             .input('JoinURL', sql.VarChar, join_url)
//             .input('StartURL', sql.NVarChar, start_url)
//             .input('Password', sql.VarChar, password)
//             .input('Status', sql.VarChar, status)
//             .input('DurationMinutes', sql.Int, duration)
//             .query(`
//                 INSERT INTO Meetings (
//                     AppointmentID,
//                     JoinURL,
//                     StartURL,
//                     Password,
//                     Status,
//                     DurationMinutes
//                 ) VALUES (
//                     @AppointmentID,
//                     @JoinURL,
//                     @StartURL,
//                     @Password,
//                     @Status,
//                     @DurationMinutes
//                 )
//             `);

//         return result;
//     } catch (error) {
//         console.error('Error in inserting meeting:', error);
//         throw error;
//     }
// }

// async function setAppointment(formData) {
//     try {
//         const { appointmentTime, appointmentDate, reason, StripeToken, Userid } = formData;
//         const formattedDate = moment(appointmentDate, 'MM/DD/YYYY').format('YYYY-MM-DD');

//         const pool = await sql.connect(config);

//         console.log('Before payment');
//         // Uncomment the following lines when you have the Stripe setup
//         // const paymentResult = await stripe.charges.create({
//         //     amount: 58 * 100,
//         //     source: StripeToken,
//         //     currency: 'usd',
//         //     description: `Payment made by id = ${Userid}`,
//         // });

//         console.log('Before meeting creation');
//         const zoomApiResponse = await createZoomMeeting(appointmentTime);
//         console.log('Zoom API Response:', zoomApiResponse);

//         const insertedAppointmentID = await insertAppointment(pool, formattedDate, appointmentTime, reason, Userid);

//         if (insertedAppointmentID) {
//             await insertMeeting(pool, insertedAppointmentID, zoomApiResponse.join_url, zoomApiResponse.start_url, zoomApiResponse.password, zoomApiResponse.status, zoomApiResponse.duration);
//         } else {
//             console.log('No appointment inserted into DB');
//         }

//         console.log('Appointment inserted into DB');
//         return { success: true, message: 'Appointment taken successfully' };
//     } catch (error) {
//         console.log('Error in setAppointment function');
//         console.log(error);
//         return { success: false, message: 'Error in making appointment' };
//     }
// }
