require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");

// connection to data base
const db= mysql.getConnection(
    {
        host: "localhost",
        user: process.env.host,
        password: process.env.password,
        database: "company_db",
    },
    console.log('Connection to comapny_db'),
);

db.connect((err) => {
if (err) throw err;
mainMenu();
});

// Main menu creation with prompts
const mainMenu = () => {
    inquirer
    .prompt([
      {
        type:"list",
        name: "options",
        message: "How would you like to proceed",
        choices:[
            "View all departments",
            "View all roles",
            "View all employyes",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employees role",
            "Exit",
        ],
      },  

    ])
    .then((response) => {
        switch (response.options){
            case "View all employees":
                viewEmployees();
                break;
                case "View all departments":
                    viewDepartments();
                    break;
                  case "View all roles":
                    viewRoles();
                    break;
                  case "Add an employee":
                    addEmployee();
                    break;
                  case "Add a department":
                    addDepartment();
                    break;
                  case "Add a role":
                    addRole();
                    break;
                  case "Update an employee role":
                    updateRole();
                    break;
                  case "Remove an employee":
                    removeEmployee();
                    break;
                  case "Remove a department":
                    removeDepartment();
                    break;
                  case "Remove a role":
                    removeRole();
                    break;
                  case "Exit":
                    db.end();
                    break;

        }
    });
};
// select/view employee
const viewEmployees = () => {
    sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.table(rows);
      mainMenu();
    });
  };
// select/view department 
  const viewDepartments = () => {
    sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.table(rows);
      mainMenu();
    });
  };
// select/view roles
  const viewRoles = () => {
    sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.table(rows);
      mainMenu();
    });
  };
// function to add employee
  const addEmployee = () => {
    let getMan = 
    `SELECT manager_id, first_name, last_name FROM employee
    WHERE manager_id IS NOT NULL;`;
  
    let getRole = 
    `SELECT id, title FROM role;`;
  
    db.query(getMan, (err, managers))
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What's the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What's the employee's last name?",
        },
        {
          type: "option",
          name: "role_id",
          message: "What's the employee's role?",
          choices: [
            "Operations",
            "Clinical",
            "Business Development",
            "Tech",
            "Therapist",
            "Admissions",
            "Facilities Manager",
            "Operations Manager",
          ],
        },
        {
          type: "validate",
          name: "manager_id",
          message: "Does the employee have a manager?",
          choices: ["Yes", "No"],
        },
      ])
      .then((response) => {
        sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        db.query(
          sql,
          [
            response.first_name,
            response.last_name,
            response.role_id,
            response.manager_id,
          ],
          (err, rows) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
            mainMenu();
          }
        );
      });
  };
//   finction to add a role
  const addRole = () => {
    // db query to get all employees to pass to the inquirer prompt
    db.query(`SELECT * FROM employees`, (err, rows) => {
      if (err) {
        console.log(err);
      }
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        id: id,
      }));
    });
    // pass the employeeChoices array to the inquirer prompt to allow user to select an employee to update
    inquirer
      .prompt([
        {
          type: "choice",
          name: "employee",
          message: "Which employee's role would you like to update?",
          choices: employeeChoices,
        },
      ])
      .then((response) => {
        inquirer
          .prompt([
            {
              type: "choice",
              name: "role",
              message: "What is the employee's new role?",
              choices: [
                "Operations",
                "Clinical",
                "Business Development",
                "Tech",
                "Therapist",
                "Admissions",
                "Facilities Manager",
                "Operations Manager",
              ],
            },
          ])
          .then((response) => {
            sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
            db.query(sql, [response.role, response.employee], (err, rows) => {
              if (err) {
                console.log(err);
              }
              console.table(rows);
              mainMenu();
            });
          });
      });
  };
// function to update role
  const updateRole = () => {
    db.query(`SELECT * FROM employees`, (err, rows) => {
      if (err) {
        console.log(err);
      }
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        id: id,
      }));
    });
    inquirer
      .prompt([
        {
          type: "choice",
          name: "employee",
          message: "Which employee's role would you like to update?",
          choices: employeeChoices,
        },
      ])
      .then((response) => {
        inquirer
          .prompt([
            {
              type: "choice",
              name: "role",
              message: "What is the employee's new role?",
              choices: [
                "Operations",
                "Clinical",
                "Business Development",
                "Tech",
                "Therapist",
                "Admissions",
                "Facilities Manager",
                "Operations Manager",
              ],
            },
          ])
          .then((response) => {
            sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
            db.query(sql, [response.role, response.employee], (err, rows) => {
              if (err) {
                console.log(err);
              }
              console.table(rows);
              mainMenu();
            });
          });
      });
  };
//   Removing an employee
  const removeEmployee = () => {
    // db query to get all employees to pass to the inquirer prompt
    db.query(`SELECT * FROM employees`, (err, rows) => {
      if (err) {
        console.log(err);
      }
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        id: id,
      }));
    });
    // pass the employeeChoices array to the inquirer prompt to allow user to select an employee to update
    inquirer
      .prompt([
        {
          type: "choice",
          name: "employee",
          message: "Which employee would you like to remove?",
          choices: employeeChoices,
        },
      ])
      .then((response) => {
        sql = `DELETE FROM employees WHERE id = ?`;
        db.query(sql, [response.employee], (err, rows) => {
          if (err) {
            console.log(err);
          }
          console.table(rows);
          mainMenu();
        });
      });
  };
  
  const removeDepartment = () => {
    // db query to get all departments to pass to the inquirer prompt
    db.query(`SELECT * FROM departments`, (err, rows) => {
      if (err) {
        console.log(err);
      }
      const departmentChoices = rows.map(({ id, department_name }) => ({
        name: `${department_name}`,
        id: id,
      }));
    });
    // pass the departmentChoices array to the inquirer prompt to allow user to select a department to remove
    inquirer
      .prompt([
        {
          type: "choice",
          name: "department",
          message: "Which department would you like to remove?",
          choices: departmentChoices,
        },
      ])
      .then((response) => {
        sql = `DELETE FROM departments WHERE id = ?`;
        db.query(sql, [response.department], (err, rows) => {
          if (err) {
            console.log(err);
          }
          console.table(rows);
          mainMenu();
        });
      });
  };

  const removeRole = () => {
    // db query to get all roles to pass to the inquirer prompt
    db.query(`SELECT * FROM role`, (err, rows) => {
      if (err) {
        console.log(err);
      }
      const roleChoices = rows.map(({ id, title }) => ({
        name: `${title}`,
        id: id,
      }));
    });
    // pass the roleChoices array to the inquirer prompt to allow user to select a role to remove
    inquirer
      .prompt([
        {
          type: "choice",
          name: "role",
          message: "Which role would you like to remove?",
          choices: roleChoices,
        },
      ])
      .then((response) => {
        sql = `DELETE FROM role WHERE id = ?`;
        db.query(sql, [response.role], (err, rows) => {
          if (err) {
            console.log(err);
          }
          console.table(rows);
          mainMenu();
        });
      });
  };
  