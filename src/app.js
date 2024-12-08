
const express = require('express');

const app = express();

app.get("/user" , (req , res) => {
    res.send({
        "firstName" : "Gaurav",
        "lastName"  : "Satpute",
        "age" : "22"
    });
});

app.post("/user" , (req , res) => {
   //data saved succesfully in data base
   res.send("Data Saved in Data BAse");
});

app.delete("/user" , (req , res) => {
    res.send("Deleted Sucessfully");
});



// app.use("/Hello" , (req, res) => {
//     res.send("hello hello hello");
// });

// app.use("/sys" , (req, res) => {
//     res.send("sys sys  hello hello");
// });

app.use("/test" , (req, res) => {
    res.send("hello from the server");
});


app.listen(3000 , () => {
    console.log("server is succefully listening on port 3000");
});
