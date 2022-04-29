Create database  POS
go
use  POS

go
CREATE TABLE Roles(
id INT PRIMARY KEY,
role VARCHAR (50)
);
go
CREATE TABLE Users (
id INT PRIMARY KEY IDENTITY (1,1),
userName VARCHAR (50),
mail VARCHAR (50),
password VARCHAR (50),
role int  FOREIGN KEY REFERENCES Roles (id)
);
go
CREATE TABLE Items(
id INT PRIMARY KEY IDENTITY,
itemName VARCHAR(50),
qty int,
price decimal,
);
go
CREATE TABLE Invoices (
  id int primary key identity,
  items varchar NOT NULL,
  tax float NOT NULL,
  subtotal float NOT NULL,
  total float NOT NULL,
  paymentType varchar(20) NOT NULL,
  invoiceDate datetime NOT NULL,
)
go
INSERT INTO Items values ('Producto 1',25,50.25),('Producto 2',25, 40)
INSERT INTO  Roles Values (1,'Administrator'),(2,'Standard User')
go
INSERT INTO Users values ('admin','admin@admin.com','1234',1),('user','user@user.com','1234',2)
go
-----------------------------------------------------------------------------
Create procedure [dbo].[SP_ValAdmin]
@varUserName varchar(50),
@varPassword varchar(50)
AS 
Begin
	if exists(select userName from Users where userName = @varUserName and password = @varPassword and role = 1)
	return 1
	else if exists(select userName from Users where userName = @varUserName and password = @varPassword and role = 2)
	return 2
End
----------------------------------------------------------------------------
go
Create procedure [dbo].[SP_ValUser]
@varUserName varchar(50),
@varPassword varchar(50)
AS
Begin	
	if exists(select userName from Users where userName = @varUserName and password = @varPassword)
	return 1
	
	Else 
	return 0
End





