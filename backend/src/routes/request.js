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
        console.log('=== LIKE/PASS REQUEST DEBUG ===');
        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        console.log('User from auth:', req.user);
        
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        console.log('From User ID:', fromUserId);
        console.log('To User ID:', toUserId);
        console.log('Status:', status);

        //allowed status
        const allowedStatus = ["ignored" , "interested"];
        if(!allowedStatus.includes(status)){
            console.log('❌ Invalid status:', status);
            return res
               .status(400)
               .json({ error: "Invalid Status type: " + status });
        };

        console.log('✅ Status is valid');

        //checking toUserID avilabale or not
        const toUser = await User.findById(toUserId);
        if(!toUser){
            console.log('❌ To user not found:', toUserId);
            return res.status(404).json({
                error: "User not Found!!"
            });
        }
        console.log('✅ To user found:', toUser.firstName);
        
        const fromUser = await User.findById(fromUserId);
        console.log('✅ From user found:', fromUser.firstName);

        // 🔧 FIXED: Only check for pending/active requests, not all requests
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId, status: { $in: ["interested", "ignored"] } },
                { fromUserId: toUserId, toUserId: fromUserId, status: { $in: ["interested", "ignored"] } },
            ],
        });
        
        if(existingConnectionRequest){
            console.log('❌ Connection request already exists with status:', existingConnectionRequest.status);
            return  res.status(400).json({ error: "Connection request already exists!" });
        }
        console.log('✅ No existing connection request found');

        //creating a instance of the BD
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        
        console.log('✅ Creating new connection request:', connectionRequest);
        
        //connection req will save in DB
        const data = await connectionRequest.save();
        console.log('✅ Connection request saved to database:', data._id);

        const response = {
            success: true,
            message: req.user.firstName+" is " + status +" in  " + toUser.firstName,
            data,
        };
        
        console.log('✅ Sending response:', response);
        console.log('=== END DEBUG ===');
        
        res.json(response);
       } catch(err){
        console.error('❌ Error in request/send:', err);
        res.status(400).json({ error: err.message });
       }
});


requestRouter.post("/request/review/:status/:requestId" ,
                    userAuth,
                    async( req , res) => {
                        try{
                            console.log('=== ACCEPT/REJECT REQUEST DEBUG ===');
                            console.log('Request params:', req.params);
                            console.log('User from auth:', req.user);
                            
                            const loggedInUser = req.user;
                            const {status , requestId } = req.params;

                            console.log('Status:', status);
                            console.log('Request ID:', requestId);

                            const allowedStatus = ["accepted", "rejected"];
                            if(!allowedStatus.includes(status)){
                                console.log('❌ Invalid status:', status);
                                return res.status(400).json({
                                    error: "Status in not Allowed!"
                                });
                            }

                            console.log('✅ Status is valid');

                        const connectionRequest = await ConnectionRequest.findOne({
                            _id: requestId,
                            toUserId: loggedInUser._id,
                            status: "interested",
                        });
                        
                        if(!connectionRequest){
                            console.log('❌ Connection request not found');
                            return res.status(400)
                            .json({
                                error: "Connection request is not found!"
                            });
                        }
                        
                        console.log('✅ Connection request found:', connectionRequest._id);

                        connectionRequest.status = status;
                        
                        const data = await connectionRequest.save();
                        console.log('✅ Connection request updated:', data);
                        
                        const response = {
                            success: true,
                            message: "connection request " + status, 
                            data
                        };
                        
                        console.log('✅ Sending response:', response);
                        console.log('=== END DEBUG ===');
                        
                        res.json(response);

                        }catch(err){ 
                            console.error('❌ Error in request/review:', err);
                            res.status(400).json({ error: err.message });
                        }

                    });


module.exports =  requestRouter;