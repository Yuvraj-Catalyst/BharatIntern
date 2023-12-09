const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    amount:{
        type:Number,
        required:true,
    },
    transactionType:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    recordDate:{
        type:String,
    },
});
const Transaction = mongoose.model("Transaction",transactionSchema);
module.exports = Transaction;
