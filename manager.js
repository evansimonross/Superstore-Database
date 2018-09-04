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

var itemIds = [];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    products("", true);
}

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Welcome to SUPERSTORE! What would you like to do?',
            choices: ['view products', 'low inventory', 'add stock', 'new product', 'quit'],
            name: 'choice'
        }
    ]).then(function (response) {
        switch (response.choice) {
            case "view products": products(""); break;
            case "low inventory": products("WHERE stock < 5"); break;
            case "add stock": inquireRestock(); break;
            case "new product": newProduct(); break;
            case "quit": quit(); break;
            default: mainMenu();
        }
    });
}

function newProduct() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Product name?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Department name?',
            name: 'dept'
        },
        {
            type: 'input',
            message: 'Current stock?',
            name: 'stock'
        },
        {
            type: 'input',
            message: 'Price per unit?',
            name: 'price'
        }
    ]).then(function (response) {
        var product = {
            product_name: response.name,
            department_name: response.dept,
            stock: parseInt(response.stock),
            price: parseFloat(response.price)
        }
        connection.query("INSERT INTO products SET ?", product, (err, res) => {
            if (err) throw err;
            console.log(product.stock + " units of " + product.product_name + " added to " + product.department_name);
            mainMenu();
        });
    })
}

function inquireRestock() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Which item would you like to restock?',
            name: 'item'
        }
    ]).then(function (response) {
        var itemId = parseInt(response.item);
        if (itemIds.includes(itemId)) {
            connection.query("SELECT * FROM products WHERE ?", { item_id: itemId }, function (err, res) {
                if (err) throw err;
                restock(res[0]);
            });
        }
    });
}

function restock(item) {
    inquirer.prompt([
        {
            type: 'input',
            message: 'How many ' + item.product_name + ' would you like to restock?',
            name: 'amount'
        }
    ]).then(function (response) {
        var amount = parseInt(response.amount);
        if (amount === 0) {
            console.log("Nothing to restock.");
            mainMenu();
        }
        else {
            connection.query("UPDATE products SET ? WHERE ?", [{ stock: item.stock + amount }, { item_id: item.item_id }], function (err, res) {
                if (err) throw err;
                mainMenu();
            });
        }
    });
}

function quit() {
    console.log("Thanks for your hard work.");
    connection.end();
    process.exit();
}

function products(options) {
    connection.query("SELECT * FROM products " + options, (err, res) => {
        if (err) throw err;
        if (arguments[1]) {
            for (var i = 0; i < res.length; i++) {
                var item_id = res[i].item_id;
                itemIds.push(item_id);
            }
        }
        else {
            printItems(res);
        }
        mainMenu();
    });
}

function printItems(res) {
    for (var i = 0; i < res.length; i++) {
        var item = [];
        var item_id = res[i].item_id;
        itemIds.push(item_id);
        var idl = ("" + item_id).length;
        for (var j = 4; j > idl; j--) {
            item_id += " ";
        }
        item.push(" " + item_id);

        var product_name = res[i].product_name;
        var pnl = product_name.length;
        for (var j = 30; j > pnl; j--) {
            product_name += " ";
        }
        item.push(product_name);

        var department_name = res[i].department_name;
        var dnl = department_name.length;
        for (var j = 15; j > dnl; j--) {
            department_name += " ";
        }
        item.push(department_name);

        var price = "$" + res[i].price.toFixed(2);
        price += "";
        var prl = price.length;
        for (var j = 10; j > prl; j--) {
            price += " ";
        }
        item.push(price);

        var stock = "" + res[i].stock;
        var stl = stock.length;
        for (var j = 6; j > stl; j--) {
            stock += " ";
        }
        item.push(stock);

        var product_sales = "$" + res[i].product_sales.toFixed(2);
        var psl = product_sales.length;
        for (var j = 15; j > psl; j--) {
            product_sales + " ";
        }
        item.push(product_sales);

        console.log(item.join(" | "));
    }
}