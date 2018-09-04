var mysql = require("mysql");
require("dotenv").config();
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.MYSQL_DB_PW,
    database: "superstore"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    mainMenu();
}

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Welcome to SUPERSTORE! What would you like to do?',
            choices: ['view departments', 'new department', 'quit'],
            name: 'choice'
        }
    ]).then(function (response) {
        switch (response.choice) {
            case "view departments": depts(); break;
            case "new department": newDept(); break;
            case "quit": quit(); break;
            default: mainMenu();
        }
    });
}

function newDept() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Department name?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Department overhead?',
            name: 'overhead'
        }
    ]).then(function (response) {
        var product = {
            department_name: response.name,
            overhead_costs: parseFloat(response.overhead)
        }
        connection.query("INSERT INTO departments SET ?", product, function (err, res) {
            if (err) throw err;
            console.log(response.name + " added with an overhead of $" + response.overhead);
            mainMenu();
        });
    })
}

function quit() {
    console.log("Thanks for your hard work.");
    connection.end();
    process.exit();
}

function depts() {
    connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name ORDER BY departments.department_id ASC", (err, res) => {
        printDepts(res);
    });
}

function printDepts(res) {
    console.log(" DEPT |      NAME       |    OVERHEAD     |      SALES      |     PROFIT")
    console.log(" ---- | --------------- | --------------- | --------------- | ---------------")
    var dept_id = res[0].department_id;
    var dept_name = res[0].department_name;
    var overhead_costs = res[0].overhead_costs;
    var product_sales = res[0].product_sales || 0;
    for (var i = 1; i <= res.length; i++) {
        if (res[i] && res[i].department_id === dept_id) {
            product_sales += parseFloat(res[i].product_sales);
            continue;
        }
        else {
            var dept = [];

            var idl = ("" + dept_id).length;
            for (var j = 4; j > idl; j--) {
                dept_id += " ";
            }
            dept.push(" " + dept_id);

            var dnl = dept_name.length;
            for (var j = 15; j > dnl; j--) {
                dept_name += " ";
            }
            dept.push(dept_name);

            var total_profit = "$" + (parseFloat(product_sales) - parseFloat(overhead_costs)).toFixed(2);

            overhead_costs = "$" + overhead_costs.toFixed(2);
            var ocl = ("" + overhead_costs).length;
            for (var j = 15; j > ocl; j--) {
                overhead_costs += " ";
            }
            dept.push(overhead_costs);

            product_sales = "$" + product_sales.toFixed(2);
            var prl = ("" + product_sales).length;
            for (var j = 15; j > prl; j--) {
                product_sales += " ";
            }
            dept.push(product_sales);

            var tpl = ("" + total_profit).length
            for (var j = 15; j > tpl; j--) {
                total_profit += " ";
            }
            dept.push(total_profit);

            console.log(dept.join(" | "));
            if (i === res.length) { mainMenu(); }
            else {
                dept_id = res[i].department_id;
                dept_name = res[i].department_name;
                overhead_costs = res[i].overhead_costs;
                product_sales = res[i].product_sales || 0;
            }
        }
    }
}