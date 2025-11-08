const user = require("../models/user");
const authorize=(rolesAllowed=[])=>{
    if(typeof rolesAllowed==='string') rolesAllowed= [rolesAllowed]; //admin
    return(req, res, next)=>{
        if (!req.user)
        { res.status(403).json({ msg: "Access denied: insufficient role" });
         }
        if (!rolesAllowed.length) 
        {return next();
        }
        if (!rolesAllowed .includes(req.user.role)){ 
            res.status(403).json({ msg: "forbidden: insufficient role" });
    }
    next();
    }
  

}
module.exports=authorize
  