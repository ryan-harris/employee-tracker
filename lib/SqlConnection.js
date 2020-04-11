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
    this.connection.query(
      `SELECT e.id, e.first_name, e.last_name, title, department, salary, 
      concat(m.first_name, ' ', m.last_name) AS manager FROM employees e
      INNER JOIN roles ON e.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ORDER BY e.id`,
      (err, res) => {
        if (err) {
          throw err;
        }

        cb(res);
      }
    );
  }

  getRoles(cb) {
    this.connection.query(
      `SELECT roles.id, title, salary, department FROM roles 
      INNER JOIN departments ON roles.department_id = departments.id`,
      (err, res) => {
        if (err) {
          throw err;
        }

        cb(res);
      }
    );
  }

  getDepartments(cb) {
    this.connection.query(
      `SELECT id, department FROM departments`,
      (err, res) => {
        if (err) {
          throw err;
        }

        cb(res);
      }
    );
  }
}

module.exports = SqlConnection;
