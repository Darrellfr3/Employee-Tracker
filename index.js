const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '!Dfrt6698',
    database: 'employee_register_db'
});

connection.connect(err => {
    if (err) throw err;
    prompt();
});

function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                "View All Employees",
                "Add An Employee",
                "Update Employee Role",
                "Remove An Employee",
                "View All Roles",
                "Add A Role",
                "View All Departments",
                "Add A Department",
                "Exit"
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "Add An Employee":
                    addEmployee();
                    break;

                case "Update Employee Role":
                    remove('role');
                    break;

                case "Remove An Employee":
                    remove('delete');
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "Add A Role":
                    addRole();
                    break;

                case "View All Departments":
                    viewAllDepartments();
                    break;

                case "Add A Department":
                    addDepartment();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
    FROM employee
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        prompt();
    });
}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}

function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no I don't (view all employees on the main option)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'role' && answer.action === "yes") updateRole();
        else viewAllEmployees();



    });
};

async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated..')
            prompt();
        });
    });
}

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employe ID?:  "
        }
    ]);
}

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee has been removed on the system!');
    prompt();

};

function viewAllRoles() {
    const query = `SELECT * FROM role`;
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        prompt();
    });

}

async function addRole() {
    const addtitle = await inquirer.prompt(askTitle());
    connection.query('SELECT department.id, department.name FROM department ORDER BY department.id;', async (err, res) => {
        if (err) throw err;
        const { department } = await inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                choices: () => res.map(res => res.name),
                message: 'What is the roles department?: '
            }
        ]);
        let departmentId;
        for (const row of res) {
            if (row.name === department) {
                departmentId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM role', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.title}`);
            choices.push('none');
            console.log('Role has been added. Please view all roles to verify...');
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: addtitle.Title,
                    department_id: departmentId,
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}

function askTitle() {
    return ([
        {
            name: "Title",
            type: "input",
            message: "Enter the title of the role:  "
        }
    ]);
}

function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        prompt();
    });
}

async function addDepartment() {
    const adddepartment = await inquirer.prompt(askDepartment());
    connection.query('SELECT * FROM department', async (err, res) => {
        if (err) throw err;
        let choices = res.map(res => `${res.department}`);
        choices.push('none');
        console.log('Department has been added. Please view all departments to verify...');
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: adddepartment.department,
            },
            (err, res) => {
                if (err) throw err;
                prompt();

            }
        );
    });
};



function askDepartment() {
    return ([
        {
            name: "department",
            type: "input",
            message: "Enter the name of the department:  "
        }
    ]);
}