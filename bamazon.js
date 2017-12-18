//BAMAZON APP (C,R,U,D)
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:"localhost",
	port:"3306",
	user:"root",
	passowrd:"",
	database:"bamazonDB"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connection as id " + connection.threadId);

	connection.query("SELECT * FROM products", function(err, res){
	if (err) throw err;
	// console.log(res);
  	for (var i = 0; i < res.length; i++) {
      console.log("======ITEM: "+ res[i].item_id +"=======");
  		console.log("PRODUCT NAME: " +res[i].product_name);
  		console.log("DEPT: " +res[i].department_name);
  		console.log("PRICE: " +res[i].price);
      console.log("IN STOCK: " +res[i].stock_quantity);
  	}
	})
	createItem();
	// updateItem();
	// deleteItem();
	// readItem();
	// connection.end();

})

function createItem() {
  console.log("Inserting a new item...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      item_id: 10,
      product_name: "Devialet Gold Phantom",
      department_name: "Electronics",
      price: 2990,
      stock_quantity: 1
    },
    function(err, res) {
      if (err) throw err;
      console.log("item inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      // updateItem();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function updateItem() {
  console.log("Updating ...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        genre: "metal"
      },
      {
        title: "Rocky Road"
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res + " items updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      // deleteProduct();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function deleteItem() {
  console.log("Deleting item...\n");
  connection.query(
    "DELETE FROM products WHERE ?",
    {
      item_id: 14
      // product_name: "Weave Blanket - MDA",
      // department_name: "Handmade",
      // price: 59.99,
      // stock_quantity: 4
    },
    function(err, res) {
      if (err) throw err;
      console.log(res + " item/s deleted!\n");
      // Call readProducts AFTER the DELETE completes
      // readItem();
    }
  );
}

function readItem() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // console.log(res);
    connection.end();
  });
}


//keep in mind:
//create connection
//use coonection
//close connection