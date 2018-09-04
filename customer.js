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
    products();
    inquirePurchase();
}

function inquirePurchase() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Which item would you like to buy?',
            name: 'item'
        }
    ]).then(function (res) {
        var itemId = parseInt(res.item);
        if(itemIds.includes(itemId)){
            connection.query("SELECT product_name FROM products WHERE ? ", {item_id: itemId} , function (err, res) {
                if (err) throw err;
                console.log(res[0].product_name);
            });
        }
    });
}

function quit(){
    connection.end();
    process.exit();
}

function products() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        printItems(res);
    });
}

function printItems(res) {
    for (var i = 0; i < res.length; i++) {
        var item = [];
        var item_id = res[i].item_id;
        itemIds.push(item_id);
        var idl = item_id.length;
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
        if (price) {
            price += "";
            var prl = price.length;
            for (var j = 10; j > prl; j--) {
                price += " ";
            }
            item.push(price);
        }

        var stock = "" + res[i].stock;
        if (stock) {
            var stl = stock.length;
            for (var j = 6; j > stl; j--) {
                stock += " ";
            }
            item.push(stock);
        }
        console.log(item.join(" | "));
    }
}