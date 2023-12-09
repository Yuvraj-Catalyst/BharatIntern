const mongoose = require("mongoose");
let postContent = mongoose.Schema({
    username:{
        type:String,
    },
    postDate:{
        type:String,
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    content:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
})
const Post = mongoose.model("Post",postContent);
module.exports = Post;
