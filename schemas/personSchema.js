const mongoose=require("mongoose")
const personSchema= new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    age:Number
})
const Person= mongoose.model("Person",personSchema)
module.exports=Person