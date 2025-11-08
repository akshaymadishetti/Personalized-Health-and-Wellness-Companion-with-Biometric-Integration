const mongoose =require("mongoose");

const insightsSchema= new mongoose.Schema({
    prompt : String ,
    aiResponse: String ,
    category: String  

}, { timestamps: true });
module.exports=mongoose.model('Insights' ,insightsSchema);