const jwt=require("jsonwebtoken")

exports.protect=(req,res,next)=>{
try
{
let token=req.headers.authorization;
if(!token || !token.startsWith("Bearer "))
{
    return res.status(401).json({message:"UnAuthorized"})
}
token=token.split(" ")[1]
const decoded=jwt.verify(token,process.env.JWT_SECRETKEY)
req.user=decoded
console.log(req.user)
next()
}
catch(error)
{
    res.status(401).json({message:error.message})
}
}


