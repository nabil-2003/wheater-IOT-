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
    },
 createdAt: { type: Date, default: Date.now, expires: '7d' }
})


    module.exports = model("DATA" , SchemaData) ; 



