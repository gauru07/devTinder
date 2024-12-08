
const express = require('express');

const app = express();

app.use("/Hello" , (req, res) => {
    res.send("hello hello hello");
});

app.use("/sys" , (req, res) => {
    res.send("sys sys  hello hello");
});
app.use("/" , (req, res) => {
    res.send("hello from the server");
});

app.listen(3000 , () => {
    console.log("server is succefully listening on port 3000");
});
