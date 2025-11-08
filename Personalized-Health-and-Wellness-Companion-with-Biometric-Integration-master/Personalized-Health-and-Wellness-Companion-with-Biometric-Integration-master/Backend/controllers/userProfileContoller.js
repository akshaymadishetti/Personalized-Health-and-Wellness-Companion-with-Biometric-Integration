const user = require('../models/HealthProfile')
exports.getProfile=(req,res)=>{
    if(!req.user){
        return res.status(400).json({message:"user not found"})
    }
    res.json({
        id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        
    });
}
exports.listUsers= async( req,res)=>{
    try{
const users =await user.find().select('-password');
res.json(users);
    }
    catch(err){
res.status(500).json({message:"server error"})
    }
}