const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const app = express();
const port = 3000;

// Create connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "jedidiah",
  database: "employees_db",
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
});

// Set up routes
app.get("/", (req, res) => {
  res.send("Welcome to the Employee Management System!");
});

app.get("/departments", (req, res) => {
  connection.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add more routes for other functionalities

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Command-line Interface Code

// Example usage of inquirer
function viewAllDepartments() {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllRoles() {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllEmployees() {
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name of the department:",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        { name: answer.name },
        (err, res) => {
          if (err) throw err;
          console.log("Department added successfully!");
          startApp();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter the title of the role:",
      },
      {
        name: "salary",
        type: "number",
        message: "Enter the salary for the role:",
      },
      {
        name: "department_id",
        type: "number",
        message: "Enter the department ID for the role:",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Role added successfully!");
          startApp();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter the first name of the employee:",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter the last name of the employee:",
      },
      {
        name: "role_id",
        type: "number",
        message: "Enter the role ID for the employee:",
      },
      {
        name: "manager_id",
        type: "number",
        message: "Enter the manager ID for the employee (if applicable):",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id || null,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Employee added successfully!");
          startApp();
        }
      );
    });
}

function updateEmployeeRole() {
  // Get the list of employees to choose from
  connection.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    // Prompt to select an employee to update
    inquirer
      .prompt([
        {
          name: "employee_id",
          type: "list",
          message: "Select an employee to update:",
          choices: employeeChoices,
        },
        {
          name: "new_role_id",
          type: "number",
          message: "Enter the new role ID for the employee:",
        },
      ])
      .then((answer) => {
        connection.query(
          "UPDATE employees SET role_id = ? WHERE id = ?",
          [answer.new_role_id, answer.employee_id],
          (err, res) => {
            if (err) throw err;
            console.log("Employee role updated successfully!");
            startApp();
          }
        );
      });
  });
}

function startApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          process.exit();
      }
    });
}

// Start the command-line interface
startApp();
