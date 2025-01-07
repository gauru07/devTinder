const mongoose = require("mongoose");

const connnectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://gaurav07:V62wwa0TymQGMzjq@project1.jr3ma.mongodb.net/devTinder"
    );
};

module.exports = connnectDB;


