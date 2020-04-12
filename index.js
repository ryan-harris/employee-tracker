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
  { name: "Add Employee", value: addEmployee },
  { name: "Update Employee Role", value: updateEmployeeRole },
  { name: "Update Employee Manager", value: updateEmployeeManager },
  { name: "Remove Employee", value: removeEmployee },
  { name: "View Roles", value: viewRoles },
  { name: "Add Role", value: addRole },
  { name: "Remove Role", value: removeRole },
  { name: "View Departments", value: viewDepartments },
  { name: "Add Department", value: addDepartment },
  { name: "Remove Department", value: removeDepartment },
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
            console.log("There are no employees in that department.");
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
          console.log("Added employee to the database.");
          start();
        });
      });
  });
}

function updateEmployeeRole() {
  dbc.getRolesAndEmployees(results => {
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Which employee's role do you want to update?",
          choices: results[1].map(emp => ({ name: emp.name, value: emp.id }))
        },
        {
          name: "role_id",
          type: "list",
          message: "Which role do you want to give the selected employee?",
          choices: results[0].map(role => ({
            name: role.title,
            value: role.id
          }))
        }
      ])
      .then(answers => {
        dbc.updateEmployee(
          { id: answers.id },
          { role_id: answers.role_id },
          res => {
            console.log("Updated employee's role.");
            start();
          }
        );
      });
  });
}

function updateEmployeeManager() {
  dbc.getEmployees(employees => {
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Which employee's manager do you want to update?",
          choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
        },
        {
          name: "manager_id",
          type: "list",
          message:
            "Which employee do you want to set as manager for the selected employee?",
          choices: ans =>
            employees
              .filter(emp => emp.id !== ans.id)
              .map(emp => ({ name: emp.name, value: emp.id }))
        }
      ])
      .then(answers => {
        dbc.updateEmployee(
          { id: answers.id },
          { manager_id: answers.manager_id },
          res => {
            console.log("Updated employee's manager.");
            start();
          }
        );
      });
  });
}

function removeEmployee() {
  dbc.getEmployees(employees => {
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Which employee do you want to remove?",
          choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
        }
      ])
      .then(employee => {
        dbc.removeEmployee(employee, res => {
          console.log("Removed employee.");
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
          console.log("Added role to the database.");
          start();
        });
      });
  });
}

function removeRole() {
  dbc.getRolesNamesIds(roles => {
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Which role do you want to remove?",
          choices: roles.map(role => ({ name: role.title, value: role.id }))
        }
      ])
      .then(role => {
        dbc.removeRole(role, res => {
          console.log("Role removed.");
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
        console.log("Added department to the database.");
        start();
      });
    });
}

function removeDepartment() {
  dbc.getDepartments(departments => {
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Which department do you want to remove?",
          choices: departments.map(dep => ({
            name: dep.department,
            value: dep.id
          }))
        }
      ])
      .then(department => {
        dbc.removeDepartment(department, res => {
          console.log("Department removed.");
          start();
        });
      });
  });
}

function printTable(table) {
  console.log();
  console.table(table);
}
