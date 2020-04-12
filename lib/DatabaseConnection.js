const mysql = require("mysql");

class DatabaseConnection {
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

  getAllEmployees(cb) {
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

  getAllEmployeesByManager(manager, cb) {
    this.runQuery(
      `SELECT e.id, first_name, last_name, title, department, salary FROM employees e
      INNER JOIN roles ON e.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      WHERE ?
      ORDER BY e.id;`,
      manager,
      cb
    );
  }

  getAllEmployeesByDepartment(department, cb) {
    this.runQuery(
      `SELECT e.id, e.first_name, e.last_name, title, salary,
      concat(m.first_name, ' ', m.last_name) AS manager FROM employees e
      INNER JOIN roles ON e.role_id = roles.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE ?
      ORDER BY e.id;`,
      department,
      cb
    );
  }

  getEmployees(cb) {
    this.runQuery(
      `SELECT concat(first_name, ' ', last_name) AS name, id FROM employees`,
      null,
      cb
    );
  }

  getManagers(cb) {
    this.runQuery(
      `SELECT DISTINCT concat(m.first_name, ' ', m.last_name) AS name, m.id FROM employees m
      INNER JOIN employees e ON e.manager_id = m.id
      ORDER BY m.id`,
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

  updateEmployee(employee, value, cb) {
    this.runQuery(`UPDATE employees SET ? WHERE ?`, [value, employee], cb);
  }

  removeEmployee(employee, cb) {
    this.runQuery(`DELETE FROM employees WHERE?`, employee, cb);
  }

  getRoles(cb) {
    this.runQuery(
      `SELECT roles.id, title, salary, department FROM roles 
      INNER JOIN departments ON roles.department_id = departments.id
      ORDER BY roles.id`,
      null,
      cb
    );
  }

  getRolesNamesIds(cb) {
    this.runQuery(`SELECT id, title FROM roles`, null, cb);
  }

  addRole(role, cb) {
    this.runQuery(`INSERT INTO roles SET ?`, role, cb);
  }

  updateRole(role, value, cb) {
    this.runQuery(`UPDATE roles SET ? WHERE ?`, [value, role], cb);
  }

  removeRole(role, cb) {
    this.runQuery(`DELETE FROM roles WHERE ?`, role, cb);
  }

  getDepartments(cb) {
    this.runQuery(`SELECT id, department FROM departments`, null, cb);
  }

  addDepartment(department, cb) {
    this.runQuery(`INSERT INTO departments SET ?`, department, cb);
  }

  removeDepartment(department, cb) {
    this.runQuery(`DELETE FROM departments WHERE ?`, department, cb);
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

module.exports = DatabaseConnection;
