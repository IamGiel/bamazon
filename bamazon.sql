DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazonDB;
use bamazon_DB;
CREATE TABLE products (
 item_id INT(11) NOT NULL AUTO_INCREMENT, 
 product_name VARCHAR(20) CHARACTER SET utf8,
 department_name VARCHAR(20) CHARACTER SET utf8,
 price INT(11) DEFAULT NOT NULL,
 stock_quantity int(11) DEFAULT NOT NULL,
 PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Mini Mac", "Computers", 689, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("ECHO plus", "Amazon Devices", 79.99, 10);

