import jwt from 'jsonwebtoken'

 const isLoggedIn =  (req,res,next)=>{

  
    

    try {
      const token = req.cookies.authToken

    if(!token){
      return  res.status(400).send("User Not authenticated")
    }

    const decoded = jwt.verify(token, "secretKey")

    req.user =  decoded

    next()
    } catch (error) {
      res.status(400).send("Error occured ")
    }

  }



  export {isLoggedIn}