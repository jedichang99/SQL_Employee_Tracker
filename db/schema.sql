DROP DATABASE IF EXISTS employeess_db;
CREATE DATABASE employees_db;

USE employees_db;

-- Create departments table
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(30)
);

-- Create roles table
CREATE TABLE roles (
  id INT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create employees table
CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);
