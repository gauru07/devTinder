const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName age gender Skills about"

//get all the pending connection requestsfor loggend in user
userRouter.get("/user/request/received", userAuth , async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested", 
        }).populate({
            path: "fromUserId", // Correct field name
    select: "firstName lastName age gender Skills about", // Include these fields
            });
        //.populate("fromUserId" , [ "firstName", "lastName", "gender", "about", "age"]);

        const data = connectionRequests.map((row) => row.fromUserId);


        res.json({
            message: "data fetch succesfully",
            data,
        })






    } catch (err){
        res.status(400).send("ERROR " + err.message);
    }

});

// we will gets our match who acceped our req

userRouter.get("/user/connections", userAuth, async(req , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ],
    }).populate({
        path: "fromUserId", // Correct field name
        select: "firstName lastName age gender Skills about", // Include these fields
        })
        .populate({
            path: "toUserId", // Correct field name
            select: "firstName lastName age gender Skills about", // Include these fields
            });

        const data = connectionRequests.map((row) =>{
            if(row.fromUserId._id.toString() ===  loggedInUser._id.toString()){
                return row.toUserId;
            }
             return row.fromUserId;
        });


    res.json({
        data,
    });
 
    }catch (err){
        res.status(400).send({ message: + err.message});
    }

});

// api for feed
userRouter.get("/feed" , userAuth , async( req, res) => {
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        
        //find all connection request.
        const connectionRequests = await ConnectionRequest.find({
            $or: [ 
                { fromUserId: loggedInUser._id } , {toUserId: loggedInUser._id }
                ],
        }).select("fromUserId  toUserId");

        const hideUserFromFeed= new Set();
        
        connectionRequests.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
            
        });


    const users = await User.find({
        $and:[
         {_id: { $nin: Array.from(hideUserFromFeed)} },
         {_id: {$ne: loggedInUser._id}}, 
        ],
    })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

    res.send(users);


    }catch (error) {
        console.error("Error in /feed endpoint:", error);
        res.status(400).json({ error: error.message });
    }
});


module.exports = userRouter;