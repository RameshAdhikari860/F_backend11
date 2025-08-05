import jwt from "jsonwebtoken";

export const verifyToken = (payload)=>{
  return jwt.verify(payload, "secretKey")
};



 
