const mongoose = require("mongoose")
const {Schema  , model} = mongoose
const SchemaData =  new Schema({
    day :  {
        type : Number  , 
        required : true 
    },
    date :  {
        type : Number  , 
        required : true 
    },
    data :{
        type: Object , 
         required : true 
    }})


    module.exports = model("DATA" , SchemaData) ; 



