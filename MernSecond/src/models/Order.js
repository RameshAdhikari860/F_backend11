
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const orderSchema = new mongoose.Schema({

    user  :{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    orderNumber : {
        type : String,
        default : ()=>uuidv4()
    },
    cartItems : {
        type : [
            {
                product : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Product"
                },
                quantity  : {
                    type  :Number
                }
            }
        ]
    },
    totalPrice : {
        type : Number,
        required : true
    },
    orderStatus : {
        type : String,
        enum : ["pending","confirmed","shipped","delivered"],
        default : "pending"
    },
    paymentMethod : {
        type : String,
        enum : ["KHALTI","COD"],
        required : true   
     },
     paymentStatus : {
        type : String,
        enum : ["paid","notPaid"],
        default : "notPaid"
     },
     orderDate : {
        type : Date,
        default : Date.now()
     },
     address : {
        type : String,
        required : true
     },
     phone : {
        type : String,
        required : true
     },
     pidx:{
        type : String,
     }


},{
    timestamps: true
})






const Order = mongoose.model("Order",orderSchema)

export default Order;