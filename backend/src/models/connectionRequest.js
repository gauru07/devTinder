//here we will define the connection  between users.

const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
      fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        //required: true,
      },
      toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        //required: true,
      },
      status: {
        type: String,
        required: true,
        enum: {
            values:["ignored" , "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        },
      },
 },
 { timestamps: true,} 
);




//if ever do connectioRequest.find({dromUserId: 388rrnmrroiu99494 , toUserId: kfkjshfu7dufdjh8849});
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function (next){
     const connectionRequest = this;
     // check if form and to user id are same
     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      throw new Error ("Cannot send connection req to youself!");
     }
     next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequestmodel" ,
     connectionRequestSchema
    );

module.exports = ConnectionRequestModel;