const express = require('express');
const requestRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');


//sending connection request API
requestRouter.post(
    "/request/send/:status/:toUserId" ,
     userAuth,
      async (req , res) => {
       try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //allowed status
        const allowedStatus = ["ignored" , "interested"];
        if(!allowedStatus.includes(status)){
        return res
           .status(400)
           .json({ message: "Invalid Status type: " + status });
        };

        //checking toUserID avilabale or not
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message: "User not Found!!"
            });
        }
        const fromUser = await User.findById(fromUserId);

        //if there is alerdy existing connections.
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],

        });
        if(existingConnectionRequest){
            return  res.status(400).send({ message: "Connevction request alerdy exists!"});
        }

        //creating a instance of the BD
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        //connection req will save in DB
        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName+" is " + status +" in  " + toUser.firstName,
            data,
        });
       } catch(err){
        res.status(400).send("ERROR:" + err.message);
       }
});


requestRouter.post("/request/review/:status/:requestId" ,
                    userAuth,
                    async( req , res) => {
                        const loggedInUser = req.user;
                        try{
                            const loggedInUser = req.user;
                            const {status , requestId } = req.params;

                            const allowedStatus = ["accepted", "rejected"];
                            if(!allowedStatus.includes(status)){
                                return res.status(400).json({
                                    message: "Status in not Allowed!"
                                });
                            }

                        const connectionRequest = await ConnectionRequest.findOne({
                            _id: requestId,
                            toUserId: loggedInUser._id,
                            status: "interested",
                        });
                        if(!connectionRequest){
                            return res.status(400)
                            .json({
                                message: "Connection request is not found!"
                            });
                        }

                        connectionRequest.status = status;
                        
                        const data = await connectionRequest.save();
                        res.json({
                            message: "connection request " + status, data
                        });

                        }catch(err){ 
                            res.status(400).send("ERROR:" + err.message);
                        }

                    });


module.exports =  requestRouter;