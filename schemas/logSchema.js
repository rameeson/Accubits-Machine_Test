const mongoose= require("mongoose")
const logSchema= new mongoose.Schema({
    data:Date,
    email:String,
    newsletter:String
})

const Logs= mongoose.model("Logs",logSchema)
module.exports=Logs