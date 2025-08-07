import express from "express";
import {
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/productControllers.js";
import { uploads } from "../config/cloudinary.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/",getAllProduct);





router.get("/test",(req,res)=>{
    const myNameIs = req.myName
    console.log("i am test function ")
    res.send("I am test created")
})




router.post("/",isLoggedIn,isAdmin,uploads.single('image'), createProduct);
router.get("/product/:id", getProductById);
router.delete("/:id",isLoggedIn,isAdmin, deleteProductById);
router.put("/update/:id",isLoggedIn,isAdmin,uploads.single('image'), updateProduct);

export default router;
