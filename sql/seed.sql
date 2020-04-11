USE employees_db;

-- DEPARTMENT SEEDING
INSERT INTO department (name)
VALUES ("Sales"),
("Finance"),
("Engineering"),
("Legal");

-- ROLE SEEDING
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Accountant", 120000, 2),
("Lead Engineer", 150000, 3),
("Software Engineer", 125000, 3),
("Product Manager", 140000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 195000, 4);

-- EMPLOYEE SEEDING
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Barnes", 4, null),
("Mary", "Torres", 1, null),
("Zach", "Johnson", 2, 2),
("Gregory", "Miller", 5, 1),
("Lori", "Morris", 6, 1),
("Maria", "Peterson", 3, null),
("Brandon", "Lewis", 5, 1),
("Susan", "Edwards", 2, 2),
("Scott", "Walker", 7, null),
("Billy", "Lopez", 8, 9);