const mysql = require("mysql");

class SqlConnection {
  constructor(config) {
    this.config = config;
    this.connection = mysql.createConnection(this.config);
  }

  connect(cb) {
    this.connection.connect(cb);
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
      cb
    );
  }

  getRoles(cb) {
    this.runQuery(
      `SELECT roles.id, title, salary, department FROM roles 
      INNER JOIN departments ON roles.department_id = departments.id`,
      cb
    );
  }

  getDepartments(cb) {
    this.runQuery(`SELECT id, department FROM departments`, cb);
  }

  addDepartment(department, cb) {
    this.runQueryValues(
      `INSERT INTO departments SET ?`,
      {
        department: department
      },
      cb
    );
  }

  runQuery(query, cb) {
    this.connection.query(query, (err, res) => {
      if (err) {
        throw err;
      }

      cb(res);
    });
  }

  runQueryValues(query, values, cb) {
    this.connection.query(query, values, (err, res) => {
      if (err) {
        throw err;
      }

      cb(res);
    });
  }
}

module.exports = SqlConnection;
