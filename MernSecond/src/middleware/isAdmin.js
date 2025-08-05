

const isAdmin = (req,res,next)=>{

  
const role = req.user.role
if(role ==="ADMIN"){
  next()
}else{
  return res.status(400).send("Not authorized")
}

   
}

export {isAdmin}