// Load the NPM Package inquirer
var inquirer = require("inquirer");
var prompt = require('prompt');
var fs = require('fs');
var mysql = require('mysql');
var resAmt = [];
var connection = mysql.createConnection({
	host:"localhost",
	port:"3306",
	user:"root",
	passowrd:"",
	database:"bamazonDB"
});


//========================================================
// constructor function Customer selection id, quantity

function Customer(id, qty) {
	this.id = [];
	this.qty = [];
	var _this = this;
	// Created a series of questions
	var question = [{
		type: "input",
		name: "id",
		message: "Select the ITEM ID of your choice: "
		},
		{
		  type: "input",
		  name: "quantity",
		  message: "How many orders of this ITEM: "
		}
	];

	this.prompt = function (){
		inquirer.prompt(question).then(function(user){
			// console.log(user.id);
			productID = user.id;
			prodTotal = user.quantity;
			readItem();
			// updateItem();

			//READ ITEM
			function readItem() {
			       console.log("Selecting product...\n");
			       connection.query("SELECT * FROM products WHERE item_id="+ productID, function(err, res) {
			       //checks for VALID user input
			       if (productID > 10 || isNaN(productID) == true){
			    	console.log(" == == == CHECK YOUR ITEM ID == == == ")
			    	//calling constructor new function
			    	var shopper = new Customer();
			    	shopper.prompt(); 


			       }
				   if(productID <= 10){
				     // Log all results of the SELECT statement
				       for (var i = 0; i < res.length; i++) {
		                  console.log("======~~~~~~~~~~ ITEM ID:"+ res[i].item_id +" ~~~~~~~~~~=======\n");
		                  console.log("PRODUCT NAME: " +res[i].product_name);
		                  console.log("DEPARTMENT:   " +res[i].department_name);
		                  console.log("PRICE:        " +res[i].price);
		                  console.log("IN STOCK:     " +res[i].stock_quantity+"\n\n\n");

		                  resAmt.push(res[i].stock_quantity);
		                  // console.log("THIS IS RESAMT: "+resAmt);

		                  //UPDATE_ITEM INSIDE READ_ITEM FUNCTION
		                  console.log("Updating ...\n");
		                  
		                  	connection.query("UPDATE products SET ? WHERE ?", 
		                  	  [{
		                  	     stock_quantity: resAmt - prodTotal
		                  	   }, 
		                  	   {
		                  	     item_id: productID
		                  	  }], function(err, res) {
		                  	  	if (err) throw err;
		                  	  	console.log(res);
		                  	  	console.log(res.affectedRows + " items updated!\n");
		                  	});
	    			   }
					   connection.end();
				   }
			   });
			}//end function readItem
		});
	}//end prompt function
}



module.exports = Customer;
