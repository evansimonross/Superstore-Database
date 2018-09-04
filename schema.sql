DROP DATABASE IF EXISTS superstore;
CREATE DATABASE superstore;
USE superstore;
CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);