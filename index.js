const inquirer = require("inquirer");
const cTable = require("console.table");
const Database = require("./lib/Database");

const db = new Database({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db"
});

db.connect(() => start());

function start() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Manager",
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
        case "View All Employees By Manager":
          return viewEmployeesByManager();
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
          db.disconnect();
      }
    });
}

function viewEmployees() {
  db.getAllEmployees(employees => {
    printTable(employees);
    start();
  });
}

function viewEmployeesByManager() {
  db.getManagers(managers => {
    inquirer
      .prompt([
        {
          name: "manager_id",
          type: "list",
          message: "Which manager do you want to view the employees of?",
          choices: managers.map(man => ({ name: man.name, value: man.id }))
        }
      ])
      .then(manager => {
        db.getAllEmployeesByManager(manager, employees => {
          printTable(employees);
          start();
        });
      });
  });
}

function addEmployee() {
  db.getRolesAndEmployees(results => {
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
          choices: [
            { name: "None", value: null },
            ...results[1].map(emp => ({ name: emp.name, value: emp.id }))
          ]
        }
      ])
      .then(employee => {
        db.addEmployee(employee, res => {
          console.log("Added employee to the database");
          start();
        });
      });
  });
}

function viewRoles() {
  db.getRoles(roles => {
    printTable(roles);
    start();
  });
}

function addRole() {
  db.getDepartments(departments => {
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
        db.addRole(role, res => {
          console.log("Added role to the database");
          start();
        });
      });
  });
}

function viewDepartments() {
  db.getDepartments(departments => {
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
      db.addDepartment(department, res => {
        console.log("Added department to the database");
        start();
      });
    });
}

function printTable(table) {
  console.log();
  console.table(table);
}
