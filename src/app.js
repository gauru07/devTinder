const express = require('express');
const connnectDB = require("./config/database");
const { getMaxListeners } = require('./models/user');
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup" , async (req , res) =>{
        const user = new User(req.body);
        
    try{
    await user.save(); // function returning a promiese.
    res.send("user added Succesfully");
    }catch(err){
        res.status(400).send("Error saving the user" + err.message);
    }
    //creating new instance of user model.
    

});

connnectDB()
.then( () => {
    console.log("dataBase connection established");
    app.listen(3000 , () => {
        console.log("server is succefully listening on port 3000");
    });
    
})
.catch((err) => {
        console.error("DataBase cannot be connected");
});

