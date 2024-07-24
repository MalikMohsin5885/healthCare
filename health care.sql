create database healthcare
use healthcare

create table Roles(
	roleId int primary key,
	name varchar(20),
)
select * from Users
SELECT * FROM Users WHERE roleId = 1 AND (fName LIKE '%' + 'a' + '%' OR lName LIKE '%' + 'a' + '%')
CREATE TABLE Users (
    UserId int identity(1,1) primary key,
    fName varchar(100) not null,
    lName varchar(100),
    dob date,
    gender char,
    email varchar(100) not null,
    password varchar(255) not null,
    country varchar(20),
    city varchar(100),
    postcode varchar(100),
    roleId int,
    foreign key (roleId) references Roles(roleId)
);

create table Permissions (
	permissionID int primary key,
	permission_name varchar(255) not null
)

INSERT INTO Permissions (permissionID, permission_name) VALUES
    (100, 'Read Access'),
    (101, 'Write Access'),
    (102, 'Delete Access'),
    (103, 'Execute Access'),
    (104, 'Admin Access');


	drop table Rights

create table Rights(
	roleId int,
	permissionID int,
	foreign key (roleId) references Roles(roleId),
	foreign key (permissionID) references Permissions(permissionID),
	primary key (roleId , permissionID)
)

INSERT INTO Rights (roleId, permissionID)
SELECT 1 AS roleId, PermissionID FROM (VALUES (103), (102), (100), (104)) AS PermissionIDs (PermissionID)
UNION
SELECT 2 AS roleId, PermissionID FROM (VALUES (100), (101)) AS PermissionIDs (PermissionID);


select * from Rights

create table consultations(
	consultationId int identity(100,3) primary key,
	patientId int,
    consultDdate date,
    diseaseNname varchar(150),
    symptomsDdetails varchar(8000),
    doctorId int,
    status varchar(255),
    foreign key (patientId) references Users(UserId),
    foreign key (doctorId) references Users(UserId)
)


create table Prescriptions (
    prescriptionId int primary key,
    consultationId int,
    medicationName varchar(100),
    dosage varchar(100),
    frequency varchar(100),
    duration varchar(100),
    instructions varchar(1000),
    foreign key (consultationId) references Consultations(consultationId)
);












INSERT INTO Roles (roleId, name)
VALUES 
(1, 'Doctor'),
(2, 'Patient')

select * from Roles





INSERT INTO Users (fName, lName, dob, gender, email, password, country, city, postcode, roleId)
VALUES
('Ali', 'Khan', '1990-05-15', 'M', 'ali@example.com', 'password123', 'Pakistan', 'Lahore', '54000', 1),
('Aisha', 'Ahmed', '1985-08-20', 'F', 'aisha@example.com', 'securepass', 'Pakistan', 'Karachi', '74000', 1),
('Saeed', 'Malik', '1992-11-30', 'M', 'saeed@example.com', 'pass123', 'Pakistan', 'Islamabad', '44000', 1),
('Fariha', 'Raza', '1988-03-25', 'F', 'fariha@example.com', 'safepassword', 'Pakistan', 'Rawalpindi', '25000', 1),
('Imran', 'Khan', '1986-09-10', 'M', 'imran@example.com', 'pass456', 'Pakistan', 'Lahore', '54000', 2),
('Sana', 'Ali', '1995-01-22', 'F', 'sana@example.com', 'securepass', 'Pakistan', 'Karachi', '74000', 2),
('Zainab', 'Riaz', '1990-07-18', 'F', 'zainab@example.com', 'pass789', 'Pakistan', 'Islamabad', '44000', 2),
('Bilal', 'Akhtar', '1987-04-05', 'M', 'bilal@example.com', 'safepassword', 'Pakistan', 'Rawalpindi', '25000', 2)




create procedure SearchByName 
	@Name varchar(100),
	@role_id int
as
begin
	Select * from Users where role_id = @role_id and fName like '%@Name%'
end

drop procedure SearchByName
drop procedure SearchBy
drop procedure

Select * from Users where role_id = 2 and fName like '%imran%'


create procedure SearchByCity 
	@city varchar(100),
	@role_id int
as
begin
	Select * from Users where role_id = @role_id and city like '%@city%'
end

create procedure SearchByEmail 
	@email varchar(100),
	@role_id int
as
begin
	Select * from Users where role_id = @email and fName like '%@email%'
end