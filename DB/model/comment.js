const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    text: String,
    postId:{type:mongoose.Schema.Types.ObjectId , ref:"Post" , required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId , ref:"User" , required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId , ref:"User" }],
    isDeleted :{type:Boolean , default:false},
    deletedBy:{type:mongoose.Schema.Types.ObjectId , ref:"User" },
    replys:[{type:mongoose.Schema.Types.ObjectId , ref:"Comment" }]
}, {
    timestamps: true
})
const commentModel  = mongoose.model("Comment" , commentSchema);
module.exports = commentModel