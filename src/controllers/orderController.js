import Order from "../models/Order.js";
import axios from "axios";

const createOrder = async (req, res) => {
  try {
    // console.log(req.body)
    const order = req.body;
    order.user = req.user.id;

    if (!order.paymentMethod) {
      throw new Error("payment method is required");
    }
    if (!order.totalPrice) {
      throw new Error("total Price is required");
    }
    if (!order.cartItems) {
      throw new Error("orderItems Is Required");
    }

    if (order.paymentMethod === "KHALTI") {
      // const options = {
      //   "return_url": "http://localhost:5173/checkout",
      //  "website_url": "http://localhost:5173/",
      //   "amount": order.totalPrice * 100,
      //   "purchase_order_id" : Date.now(),
      //   "purchase_order_name": `order- ${Date.now()}`,
      // };
      const options = {
        return_url: "http://localhost:5173/dashboard",
        website_url: "http://localhost:5173/",
        amount: order.totalPrice * 100,
        purchase_order_id: Date.now(),
        purchase_order_name: `order- ${Date.now()}`,
      };

      // PAYMENT FROM KHALTI
      const result = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        options,
        {
          headers: {
            Authorization: "Key 568bc038de7b4f0bab83b87a64a29aa3",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result.data);
      if (result.data.pidx) {
        order.pidx = result.data.pidx;
        const data = await Order.create(order);
      

      res
        .status(200)
        .json({
          message: "khalti payment initiated payment processing",
          data: data,
          paymentUrl: result.data.payment_url,
        });}
    } else {
      const data = await Order.create(order);

      res.status(200).json({ message: "order created Successfully", data });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderStatus = req.body.orderStatus;
    const id = req.params.id;

    if (!orderStatus) {
      throw new Error("OrderStatus is required");
    }

    const data = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: " error to update order status " });
  }
};



const updateKhaltiPaymentStatus = async (req,res)=>{
   
   const {pidx} = req.body
   const userId = req.user.id

   const  orderExist =  await Order.findOne({pidx})

  const result =  await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{pidx},{
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        })

  

    if(result.data.status !== "Completed"){throw new Error("Payment Not completed")}

    if(result.data.total_amount !== orderExist.totalPrice * 100){throw new Error("Error in price")}

    const  result1 = await Order.findOneAndUpdate({pidx},{paymentStatus:"paid",orderStatus:"confirmed"},{new:true})

    res.status(200).json({
      message: "payment status  is paid",
      data : result1
    })
}


export { createOrder,updateOrderStatus,updateKhaltiPaymentStatus };
