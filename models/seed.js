///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require("./connection");
const Animal = require("./animal")

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////

// Make sure code is not run till connected
mongoose.connection.on("open", () => {

  ///////////////////////////////////////////////
  // Write your Seed Code Below
  //////////////////////////////////////////////

  // Run any database queries in this function
   // array of starter animals
   const startAnimals = [
    { species: "Passenger Pigeon", extinct: true, location: "North America", lifeExpectancy: 15 },
    { species: "Red Panda", extinct: false, location: "Asia", lifeExpectancy: 9 },
    { species: "Orangutan", extinct: false, location: "Asia", lifeExpectancy: 35 },
    { species: "Dodo", extinct: true, location: "Africa", lifeExpectancy: 20 },
    { species: "Tasmanian Tiger", extinct: true, location: "Australia", lifeExpectancy: 5 },
    ]

  // Delete all fruits
  Animal.deleteMany({}, (err, data) => {
    // Seed Starter Fruits
    Animal.create(startAnimals, (err, data) => {
      // log the create fruits to confirm
      console.log("--------ANIMALS CREATED----------");
      console.log(data);
      console.log("--------ANIMALS CREATED----------");

      // close the DB connection
      mongoose.connection.close();
    });
  });

  ///////////////////////////////////////////////
  // Write your Seed Code Above
  //////////////////////////////////////////////

});