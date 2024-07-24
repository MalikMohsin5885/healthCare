// var config = {
//     user: 'sa',
//     password: 'Mohsin',
//     server: 'MOHSIN\\SQLEXPRESS',
//     database: 'Users',
//     options: {
//         encrypt: false // Disable SSL validation
//     }
// };

const config = {
    user: 'sa',
    password: 'Mohsin@123',
    server: 'MOHSIN\\SQLEXPRESS',
    database: 'healthcare',
    options: {
        trustedConnection: true,
        enableArithAbort: true, // Corrected the property name
        instanceName: 'SQLEXPRESS', // Corrected the property name
        encrypt: false // Disable SSL validation
    },
    port: 1433,
};

module.exports = config; // Corrected the export statement
// driver: ODBC Driver 17 for sql server