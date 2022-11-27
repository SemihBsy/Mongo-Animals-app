////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Animal = require("../models/animal")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

app.get("/seed", (req, res) => {

    // array of starter animals
    const startAnimals = [
        { species: "Passenger Pigeon", extinct: true, location: "North America", lifeExpectancy: 15 },
        { species: "Red Panda", extinct: false, location: "Asia", lifeExpectancy: 9 },
        { species: "Orangutan", extinct: false, location: "Asia", lifeExpectancy: 35 },
        { species: "Dodo", extinct: true, location: "Africa", lifeExpectancy: 20 },
        { species: "Tasmanian Tiger", extinct: true, location: "Australia", lifeExpectancy: 5 },
        ]

    // Delete all animals
    Animal.deleteMany({}, (err, data) => {
      // Seed Starter Fruits
      Animal.create(startAnimals,(err, data) => {
          // send created animals as response to confirm creation
          res.json(data);
        }
      );
    });
});

// index route
router.get("/", (req, res) => {
    Animal.find({}, (err, animals) => {
      res.render("animals/index.ejs", { animals });
    });
  });

// new route
router.get("/new", (req, res) => {
    res.render("animals/new.ejs")
});

// destroy route
router.delete("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // delete the animal
    Animal.findByIdAndRemove(id, (err, animal) => {
        // redirect user back to index page
        res.redirect("/animals")
    })
});

//update route
router.put("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false
    // update the animal
    Animal.findByIdAndUpdate(id, req.body, {new: true}, (err, animal) => {
        // redirect user back to main page when animal 
        res.redirect("/animals")
    })
})

// create route
router.post("/", (req, res) => {
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false
    // create the new animal
    Animal.create(req.body, (err, animal) => {
        // redirect the user back to the main animals page after animal created
        res.redirect("/animals")
    });
});

// edit route
router.get("/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id
    // get the animal from the database
    Animal.findById(id, (err, animal) => {
        // render template and send it animal
        res.render("animals/edit.ejs", {animal})
    });
});

// show route
router.get("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id

    // find the particular animal from the database
    Animal.findById(id, (err, animal) => {
        // render the template with the data from the database
        res.render("animals/show.ejs", {animal})
    })
});

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router;