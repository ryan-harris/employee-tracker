const inquirer = require("inquirer");
const cTable = require("console.table");
const SqlConnection = require("./lib/SqlConnection");

const sql = new SqlConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db"
});

sql.connect(err => {
  if (err) {
    throw err;
  }

  return start();
});

function start() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View Roles",
          "View Departments",
          "Add Department",
          "Exit"
        ]
      }
    ])
    .then(answer => {
      switch (answer.action) {
        case "View All Employees":
          return viewEmployees();
        case "View Roles":
          return viewRoles();
        case "View Departments":
          return viewDepartments();
        case "Add Department":
          return addDepartment();
        default:
          sql.disconnect();
      }
    });
}

function viewEmployees() {
  sql.getAllEmployees(results => {
    console.table(results);
    start();
  });
}

function viewRoles() {
  sql.getRoles(results => {
    console.table(results);
    start();
  });
}

function viewDepartments() {
  sql.getDepartments(results => {
    console.table(results);
    start();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        message: "What is the department name?"
      }
    ])
    .then(answer => {
      sql.addDepartment(answer.department, res => {
        start();
      });
    });
}
