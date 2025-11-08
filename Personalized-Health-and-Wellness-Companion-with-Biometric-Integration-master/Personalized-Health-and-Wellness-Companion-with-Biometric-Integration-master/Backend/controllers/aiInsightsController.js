const {GoogleGenerativeAI} =require("@google/generative-ai");
require("dotenv").config();
const Idea = require('../models/insights');

const genAI =new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateIdea=async(req,res)=>{
const{prompt ,category}= req.body;
try{
const model= genAI.getGenerativeModel({model:"gemini-2.5-flash"})
const result =await model.generateContent(prompt)
const aiResponse= result.response.text()
const newIdea =await Idea.create({prompt,aiResponse ,category})
res.status(201).json(newIdea);
}
catch(err){
    console.log(err)

}
}
exports.getIdeas=async(req,res)=>{
    try{
const ideas =await Idea.find();
res.status(201).json(ideas)
    }
    catch(err){
        res.status(500).json({err:"ai generation failed",details:err.message})
    }
}
exports.deleteIdea = async (req, res) => {
    try {
      const result = await Idea.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).send("Idea not found");
      res.status(200).send("Deleted");
    } catch (err) {
      res.status(500).send("Server error");
    }
  };