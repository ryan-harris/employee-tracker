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

sql.connect(() => start());

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
          "Add Employee",
          "Add Role",
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
        case "Add Employee":
          return addEmployee();
        case "Add Role":
          return addRole();
        case "Add Department":
          return addDepartment();
        default:
          sql.disconnect();
      }
    });
}

function viewEmployees() {
  sql.getAllEmployeesDetails(employees => {
    printTable(employees);
    start();
  });
}

function addEmployee() {
  sql.getRolesAndEmployees(results => {
    inquirer
      .prompt([
        {
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          name: "role_id",
          type: "list",
          message: "What is the employee's role?",
          choices: results[0].map(role => ({
            name: role.title,
            value: role.id
          }))
        },
        {
          name: "manager_id",
          type: "list",
          message: "Who is the employee's manager?",
          choices: results[1].map(emp => ({ name: emp.name, value: emp.id }))
        }
      ])
      .then(employee => {
        sql.addEmployee(employee, res => {
          console.log("Added employee to the database");
          start();
        });
      });
  });
}

function viewRoles() {
  sql.getRoles(roles => {
    printTable(roles);
    start();
  });
}

function addRole() {
  sql.getDepartments(departments => {
    inquirer
      .prompt([
        {
          name: "title",
          message: "What is the role title?"
        },
        {
          name: "salary",
          message: "What is the role's salary?"
        },
        {
          name: "department_id",
          type: "list",
          message: "Which department is the role a part of?",
          choices: departments.map(dep => ({
            name: dep.department,
            value: dep.id
          }))
        }
      ])
      .then(role => {
        sql.addRole(role, res => {
          console.log("Added role to the database");
          start();
        });
      });
  });
}

function viewDepartments() {
  sql.getDepartments(departments => {
    printTable(departments);
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
    .then(department => {
      sql.addDepartment(department, res => {
        console.log("Added department to the database");
        start();
      });
    });
}

function printTable(table) {
  console.log();
  console.table(table);
}
