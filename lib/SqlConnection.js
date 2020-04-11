const mysql = require("mysql");

class SqlConnection {
  constructor(config) {
    this.config = config;
    this.connection = mysql.createConnection({
      ...this.config,
      multipleStatements: true
    });
  }

  connect(cb) {
    this.connection.connect(err => {
      if (err) {
        throw err;
      }

      cb();
    });
  }

  disconnect() {
    this.connection.end();
  }

  getAllEmployeesDetails(cb) {
    this.runQuery(
      `SELECT e.id, e.first_name, e.last_name, title, department, salary, 
      concat(m.first_name, ' ', m.last_name) AS manager FROM employees e
      INNER JOIN roles ON e.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ORDER BY e.id`,
      null,
      cb
    );
  }

  getRolesAndEmployees(cb) {
    this.runQuery(
      `SELECT title, id FROM roles;
      SELECT concat(first_name, ' ', last_name) AS name, id FROM employees`,
      null,
      cb
    );
  }

  addEmployee(employee, cb) {
    this.runQuery(`INSERT INTO employees SET ?`, employee, cb);
  }

  getRoles(cb) {
    this.runQuery(
      `SELECT roles.id, title, salary, department FROM roles 
      INNER JOIN departments ON roles.department_id = departments.id`,
      null,
      cb
    );
  }

  addRole(role, cb) {
    this.runQuery(`INSERT INTO roles SET ?`, role, cb);
  }

  getDepartments(cb) {
    this.runQuery(`SELECT id, department FROM departments`, null, cb);
  }

  addDepartment(department, cb) {
    this.runQuery(`INSERT INTO departments SET ?`, department, cb);
  }

  runQuery(sql, values, cb) {
    this.connection.query(sql, values, (err, res) => {
      if (err) {
        throw err;
      }

      cb(res);
    });
  }
}

module.exports = SqlConnection;
