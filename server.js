/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables, will allow us to use a `.env` file to define environmental variables we can access via the `process.env` object
const express = require("express") // web framework for create server and writing routes
const morgan = require("morgan") // logs details about requests to our server, mainly to help us debug
const methodOverride = require("method-override") //allows us to swap the method of a request based on a URL query
const mongoose = require("mongoose") // ODM for connecting to and sending queries to a mongo database


/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))


////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const {Schema, model} = mongoose

// make fruits schema
const animalsSchema = new Schema({
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpectancy: Number
})

// make fruit model
const Animal = model("Animal", animalsSchema)

/////////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
})

app.get("/animals/seed", (req, res) => {

    // array of starter animals
    const startAnimals = [
        { species: "Passenger pigeon", extinct: true, location: "North America", lifeExpectancy: 15-17 },
        { species: "Red panda", extinct: false, location: "Asia", lifeExpectancy: 9-13 },
        { species: "Orangutan", extinct: false, location: "Asia", lifeExpectancy: 35-40 },
        { species: "Dodo", extinct: true, location: "Africa", lifeExpectancy: 10-30 },
        { species: "Tasmanian Tiger", extinct: true, location: "Australia", lifeExpectancy: 5-7 },
        ]

    // Delete all animals
    Animal.remove({}, (err, data) => {
      // Seed Starter Fruits
      Animal.create(startAnimals,(err, data) => {
          // send created animals as response to confirm creation
          res.json(data);
        }
      );
    });
});

// index route
app.get("/animals", async (req, res) => {
    const animals = await Animals.find({});
    res.render("animals/index.ejs", { animals });
});

// new route
app.get("/animals/new", (req, res) => {
    res.render("animals/new.ejs")
});

// destroy route
app.delete("/animals/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // delete the animal
    Animal.findByIdAndRemove(id, (err, animal) => {
        // redirect user back to index page
        res.redirect("/animals")
    })
});

//update route
app.put("/animals/:id", (req, res) => {
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
app.post("/animals", (req, res) => {
    // check if the extinct property should be true or false
    req.body.extinct = req.body.extinct === "on" ? true : false
    // create the new animal
    Animal.create(req.body, (err, animal) => {
        // redirect the user back to the main animals page after animal created
        res.redirect("/animals")
    })
})

// edit route
app.get("/animals/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id
    // get the animal from the database
    Animal.findById(id, (err, animal) => {
        // render template and send it animal
        res.render("animals/edit.ejs", {animal})
    })
})

// show route
app.get("/animals/:id", (req, res) => {
    // get the id from params
    const id = req.params.id

    // find the particular animal from the database
    Animal.findById(id, (err, animal) => {
        // render the template with the data from the database
        res.render("animals/show.ejs", {animal})
    })
});

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))