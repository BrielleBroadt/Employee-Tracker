require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");

// connection to data base
const db= mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Pallan2016!",
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
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
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
                  default:
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
  let getMan = `SELECT manager_id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL;`;

  let getRole = `SELECT id, title FROM role;`;

  db.query(getMan, (err, managers) => {
    if (err) {
      console.log(err);
    }

    // Now, you can fetch roles and use them as choices
    db.query(getRole, (err, roles) => {
      if (err) {
        console.log(err);
      }

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
            type: "list", 
            name: "role_id",
            message: "What's the employee's role?",
            choices: roles.map((role) => role.title), 
          },
          {
            type: "input",
            name: "manager_id",
            message: "If yes press 1, if no press 0?",
            // choices: ["1", "0"],
            
          },
        ])
        .then((response) => {
          sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
          db.query(
            sql,
            [
              response.first_name,
              response.last_name,
              roles.find((role) => role.title === response.role_id).id, 
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
    });
  });
};
//   finction to add a role
  const addRole = () => {
    // db query to get all employees to pass to the inquirer prompt
    db.query(`SELECT * FROM department`, (err, rows) => {
      if (err) {
        console.log(err);
      }
      const departmentChoices = rows.map(({ id, name }) => ({
        name: `${name}`,
        value: id,
      }));
      inquirer
      
      .prompt([

        {
          type: "input",
          name: "role",
          message: "What role are you adding",
        },
        {
          type: "input",
          name: "salary",
          message: "What salary for this role",

        },
        {
          type: "list",
          name: "employee",
          message: "Which role would you like to add?",
          choices: departmentChoices,
        },
      ])
          .then((response) => {
            // sql = `UPDATE role SET role_id = ? WHERE id = ?`;
            sql = 'INSERT into role (title, salary, department_id) values (?,?,?)'
            db.query(sql, [response.role, response.salary, response.employee] , (err, rows) => {
              if (err) {
                console.log(err);
              }
              console.table(rows);
              mainMenu();
            });
          });
      });
    };
    // pass the employeeChoices array to the inquirer prompt to allow user to select an employee to update
    const updateRole = () => {
      // Query the database to get a list of employees
      const getEmployeeList = `
        SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
        FROM employee
      `;
    
      const getRoleList = `
        SELECT id, title
        FROM role;
      `;
    
      db.query(getEmployeeList, (err, employees) => {
        if (err) throw err;
    
        db.query(getRoleList, (err, roles) => {
          if (err) throw err;
    
          const employeeChoices = employees.map((employee) => ({
            name: employee.employee_name,
            value: employee.id,
          }));
    
          const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
          }));
    
          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employeeChoices,
              },
              {
                type: "list",
                name: "role",
                message: "What role will they be assigned?",
                choices: roleChoices,
              },
            ])
            .then((res) => {
              const query = `
                UPDATE employee SET role_id = ? WHERE id = ?
              `;
              db.query(query, [res.role, res.employee], (err, result) => {
                if (err) throw err;
                // Retrieve the selected employee's name
                const selectedEmployee = employees.find(
                  (employee) => employee.id === res.employee
                );
                // Retrieve the selected role's title
                const selectedRole = roles.find((role) => role.id === res.role);
                console.log(
                  `Updated employee ${selectedEmployee.employee_name} to role ${selectedRole.title}`
                );
                viewEmployees();
              });
            });
        });
      });
    };
  
const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "adddepartment",
      message: "What department would you like to add?",


    }
  ])
  .then((inquirerResponse) =>{
    const departmentName = inquirerResponse.adddepartment;
    db.query(`INSERT INTO department (name) VALUES ("${departmentName}") `, function(err, res) {
      err? console.log(err): viewDepartments(), mainMenu()
    })
  }
  )
}
