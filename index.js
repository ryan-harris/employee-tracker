const inquirer = require("inquirer");
const cTable = require("console.table");
const DatabaseConnection = require("./lib/DatabaseConnection");

const actions = [
  { name: "View All Employees", value: viewEmployees },
  {
    name: "View All Employees By Department",
    value: viewEmployeesByDepartment
  },
  { name: "View All Employees By Manager", value: viewEmployeesByManager },
  { name: "View Roles", value: viewRoles },
  { name: "View Departments", value: viewDepartments },
  { name: "Add Employee", value: addEmployee },
  { name: "Add Role", value: addRole },
  { name: "Add Department", value: addDepartment },
  { name: "Exit", value: exit }
];

const dbc = new DatabaseConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db"
});

dbc.connect(() => start());

function start() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: actions
      }
    ])
    .then(answer => {
      answer.action();
    });
}

function exit() {
  dbc.disconnect();
}

function viewEmployees() {
  dbc.getAllEmployees(employees => {
    printTable(employees);
    start();
  });
}

function viewEmployeesByManager() {
  dbc.getManagers(managers => {
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
        dbc.getAllEmployeesByManager(manager, employees => {
          printTable(employees);
          start();
        });
      });
  });
}

function viewEmployeesByDepartment() {
  dbc.getDepartments(departments => {
    inquirer
      .prompt([
        {
          name: "department_id",
          type: "list",
          message: "Which department do you want to view the employees of?",
          choices: departments.map(dep => ({
            name: dep.department,
            value: dep.id
          }))
        }
      ])
      .then(department => {
        dbc.getAllEmployeesByDepartment(department, employees => {
          if (employees.length > 0) {
            printTable(employees);
          } else {
            console.log("There are no employees in that department");
          }
          start();
        });
      });
  });
}

function addEmployee() {
  dbc.getRolesAndEmployees(results => {
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
        dbc.addEmployee(employee, res => {
          console.log("Added employee to the database");
          start();
        });
      });
  });
}

function viewRoles() {
  dbc.getRoles(roles => {
    printTable(roles);
    start();
  });
}

function addRole() {
  dbc.getDepartments(departments => {
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
        dbc.addRole(role, res => {
          console.log("Added role to the database");
          start();
        });
      });
  });
}

function viewDepartments() {
  dbc.getDepartments(departments => {
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
      dbc.addDepartment(department, res => {
        console.log("Added department to the database");
        start();
      });
    });
}

function printTable(table) {
  console.log();
  console.table(table);
}
