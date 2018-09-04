USE superstore;
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Purple Flip Flops', 'Footwear', 20.25, 500);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Athletic Sneakers', 'Footwear', 74.99, 151);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Word Processing Suite', 'Software', 200.00, 1000);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Image Manipulation', 'Software', 175.50, 102);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Powdered Grape Drink', 'Foodstuff', 5.99, 5079);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Concentrated Orange Juice', 'Foodstuff', 2.75, 1216);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Pudding Cups (6-pack)', 'Foodstuff', 10.99, 2987);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Multi-purpose Ointment', 'Pharmacy', 18.44, 3022);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Single-purpose Ointment', 'Pharmacy', 8.55, 1021);
INSERT INTO products (product_name, department_name, price, stock)
    VALUES ('Zero-purpose Ointment', 'Pharmacy', 4.99, 9999);

INSERT INTO departments (department_name, overhead_costs) VALUES ('Pharmacy', 150000);
INSERT INTO departments (department_name, overhead_costs) VALUES ('Foodstuff', 250000);
INSERT INTO departments (department_name, overhead_costs) VALUES ('Office Supplies', 75000);
INSERT INTO departments (department_name, overhead_costs) VALUES ('Software', 125000);
INSERT INTO departments (department_name, overhead_costs) VALUES ('Clothing', 450000);
INSERT INTO departments (department_name, overhead_costs) VALUES ('Footwear', 55000);
INSERT INTO departments (department_name, overhead_costs) VALUES ('Electronics', 850000);

