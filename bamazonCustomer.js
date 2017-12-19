// Load the NPM Package inquirer
var inquirer = require('inquirer');
var connection = require('./bamazon')
var prompt = require('prompt');
var fs = require('fs');
var mysql = require('mysql');
var resAmt = [];
var itemBought = [];

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
	
	//START INTERACTION WITH USER
	_this.prompt = function (){
		
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
		
		var morePurchase = [
			{
			type: "list",
			name: "id",
			message: "Wanna check more cool stuff?: ",
			choices: ["See more cool stuff!...", "Maybe later..."]
			}
		];
		inquirer.prompt(question).then(function(user){
			// console.log(user.id);
			productID = user.id;
			prodTotal = user.quantity;
			readItem();
			// updateItem();
			//connection.query("SELECT * FROM products WHERE item_id="+ productID, function(err, res) {
			//console.log("THIS IS RESPONSE ", res);

			//});

			//READ ITEM
			function readItem() {
			       console.log("Selecting product...\n");
			       connection.query("SELECT * FROM products WHERE item_id="+ productID, function(err, res) {
			       console.log("THIS IS RESPONSE ", res);

			       //checks for VALID user input
			       if (productID > 10 || isNaN(productID) == true){
			    	console.log(" == == == CHECK YOUR ITEM ID == == == ");
			    	
			    	_this.prompt(); 


			       } else
				   if(productID <= 10){
				     // Log all results of the SELECT statement
				       for (var i = 0; i < res.length; i++) {
		                  resAmt.push(res[i].stock_quantity);
		                  itemBought.push(res[i].product_name);
		                  // console.log("THIS IS RESAMT: "+resAmt);
		                  
		                  	if(prodTotal > resAmt){
		                  		console.log("YOU REQUESTED " + prodTotal + " ITEMS");
		                  		console.log("WE HAVE " + resAmt + " ITEMS LEFT");
		                    	console.log("Oops!, we will get more of that item soon, for now we have " + resAmt + " items in stock.");
		                    	_this.prompt();

		                    } 

		                   //UPDATE_ITEM INSIDE READ_ITEM FUNCTION
		                  	connection.query("UPDATE products SET ? WHERE ?", 
		                  	  [{
		                  	     stock_quantity: resAmt - prodTotal
		                  	   }, 
		                  	   {
		                  	     item_id: productID
		                  	  }], function(err, res) {
		                  	  	// console.log("res");
		                  	  	console.log("Updating database stock quantity...\n");
		                  	  	if (err) throw err;
		                  	  	
		                  	  	// console.log(res);
		                  	  	console.log(prodTotal + " " + itemBought + " items in your shopping cart!\n");
		                  	  	
		                  	  	//REPEAT PROCESS OR EXIT
		                  	  	inquirer.prompt(morePurchase).then(function(user){
		                  	  	   if (err) throw err;
		                  	  	   console.log(user.id);
		                  	  	   if(user.id == "Maybe later..."){
		                  	  	   	console.log("T'was Great to serve you, see you soon!");
		                  	  	   	// connection.end();
		                  	  	   	return;
		                  	  	   	
		                  	  	    } 
		                  	  	    else if(user.id == "See more cool stuff!..."){
		                  	  	    	return _this.prompt(); 
		                  	  	    }
		                  	  	});
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
