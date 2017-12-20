// Load the NPM Package inquirer
var inquirer = require('inquirer');
var connection = require('./bamazon')
var prompt = require('prompt');
var fs = require('fs');
var mysql = require('mysql');
var payAmt = [];
var listItems = [];
var sum;
var resAmt = [];


var connection = mysql.createConnection({
	host:"localhost",
	port:"3306",
	user:"root",
	passowrd:"",
	database:"bamazonDB"
});

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

//========================================================
// constructor function Customer selection id, quantity

function Customer(id, qty) {
	this.id = [];
	this.qty = [];
	var _this = this;
	
	//START INTERACTION WITH USER
	_this.prompt = function (){

		inquirer.prompt(question).then(function(user){
			// console.log(user.id);
			productID = user.id;//order ID
			prodTotal = user.quantity;// total items bought
			readItem();
			
			//READ ITEM
			function readItem() {
				var itemBought = [];
				var totalPrice = [];
				var itemPrice =  [];
				resAmt = [];
				
			    // console.log("Selecting product...\n");
			    connection.query("SELECT * FROM products WHERE item_id="+ productID, function(err, res) {
			    // console.log("THIS IS RESPONSE ", res);

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
		                  listItems.push(res[i].product_name);
		                  itemPrice.push(res[i].price);
		                  userFee = prodTotal * itemPrice;
		                  payAmt.push(userFee);

		                  // fs.writeFile("blanks.txt", stackOv, (err) => {
		                  // 	if (err) throw err;
		                  // 	console.log("LOGGING THIS INFO TO BLANK TEXT: \n\n\n", resAmt);
		                  // });

		                  sum = payAmt.reduce((a, b) => a + b, 0);
		                  intProdTotal = parseInt(prodTotal); //console.log("intProdTotal", intProdTotal);
		                  intResAmt = parseInt(resAmt); //console.log("intResAmt", intResAmt);
		                  // console.log(sum);

						    if(intProdTotal <= intResAmt){

		                       // UPDATE_ITEM INSIDE READ_ITEM FUNCTION
		                       connection.query("UPDATE products SET ? WHERE ?", 
		                       [{
		                         stock_quantity: resAmt - prodTotal
		                       }, 
		                       {
		                       item_id: productID
		                       }], function(err, res) {
		                            if (err) throw err;
		                              //appendFile to save user selection
		                               fs.writeFile("blanks.txt", "\n\n\n=========" + prodTotal +  " ORDERS OF: \n" + listItems + " TOTAL PRICE: $ " + itemPrice + "\nTotal Purchase Price: $ " + userFee + "\n\n\n", function (error) {
		                                  
		                                  console.log("saved!");
		                               });
		                              
		                            });
		                       repeatProcess();
		                    }else 
		                        if(intProdTotal > intResAmt){ //order exceeds item inventory

		                    	  exceedOrder();
		                    	  _this.prompt();
		                        }
	    			  }
				    } 
			   });
			}//end function readItem
		});
	}//end prompt function
}

function repeatProcess() {
   //REPEAT PROCESS OR EXIT
   inquirer.prompt(morePurchase).then(function(user){
	   if(user.id == "Maybe later..."){
	   	   fs.readFile("blanks.txt", 'utf8' ,function(error, data) {
	   	  	 if (error) throw error;
	   	  	 console.log(data);
	   	  	 console.log("YOUR FINAL BILL: "+ sum);
	   	  	 console.log("\n\n\n=================T'was Great to help with your shopping needs!=================");
	       });
	    }else if(user.id == "See more cool stuff!..."){
	     	re_readItem();
	     	 // _this.prompt();
	  	}
	});
}

function exceedOrder(){

      console.log("YOU REQUESTED " + prodTotal + " ITEMS");
      console.log("WE HAVE " + resAmt[0] + " ITEMS LEFT");
      console.log("Oops!, we will get more of that item soon");
     
}

function re_readItem(){	
	connection.query("SELECT * FROM products", function(err, res){
	if (err) throw err;
	    // console.log(res);
       console.log("WELCOME, THANKS FOR CHOOSING BAMAZON!");
  	   for (var i = 0; i < res.length; i++) {

          console.log("======~~~~~~~~~~ ITEM ID:"+ res[i].item_id +" ~~~~~~~~~~=======\n");
  	      console.log("PRODUCT NAME: " +res[i].product_name);
  	      console.log("DEPARTMENT:   " +res[i].department_name);
  	      console.log("PRICE:        " +res[i].price);
          console.log("IN STOCK:     " +res[i].stock_quantity+" left!" +"\n\n\n");
  	   }
  	   var shopper = new Customer();
  	   shopper.prompt(); 
	})
}
module.exports = Customer;