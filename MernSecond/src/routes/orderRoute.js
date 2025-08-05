import express from "express";
import { createOrder, updateKhaltiPaymentStatus } from "../controllers/orderController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();


router.post('/create',isLoggedIn,createOrder)
router.post('/khaltiStatusUpdate',isLoggedIn,updateKhaltiPaymentStatus)



export default router;