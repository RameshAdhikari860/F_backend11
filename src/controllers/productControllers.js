import { cloudinary } from "../config/cloudinary.js";
import Product from "../models/Product.js";

const createProduct = async (req, res) => {
  if (!req.file) {
    throw new Error("Image is Required");
  }

  const { ram, rom, productName, description, price, gen, brand } = req.body;

  const imageUrl = req.file.path;
  const imageName = req.file.filename;

  try {
    // console.log(ram,rom,productName,description,price)
    if (!ram) {
      throw new Error("ram is required");
    }
    if (!rom) {
      throw new Error("rom is required");
    }
    if (!productName || !description || !price || !gen || !brand) {
      throw new Error("Credential missing");
    }

    const data = await Product.create({
      productName: productName,
      ram: ram,
      rom: rom,
      price: price,
      description: description,
      brand: brand,
      imageUrl,
      imageName,
    });
    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const query = req.query;
    let filter = {};

    if (query.productName) {
      filter.productName = {
        $regex: query.productName,
        $options: "i",
      };
    }
    if (query.description) {
      filter.description = {
        $regex: query.description,
        $options: "i",
      };
    }
    if (query.gen) {
      filter.gen = {
        $in: query.gen
          .split(",")
          .filter(Boolean)
          .map((n) => parseInt(n)),
      };
    }
    if (query.ram) {
      filter.ram = {
        $in: query.ram
          .split(",")
          .filter(Boolean)
          .map((n) => parseInt(n)),
      };
    }
    if (query.rom) {
      filter.rom = {
        $in: query.rom
          .split(",")
          .filter(Boolean)
          .map((n) => parseInt(n)),
      };
    }
    if (query.brand) {
      filter.brand = {
        $in: query.brand.split(","),
      };
    }
    if (query.price) {
      const nums = query.price
        .split(",")
        .filter(Boolean)
        .map((n) => parseInt(n));
      const from = nums[0];
      const to = nums[nums.length - 1];

      if (nums.length > 1) {
        filter.price = {
          $gte: from,
          $lte: to,
        };
      } else {
        filter.price = {
          $lte: from,
        };
      }
    }

    const data = await Product.find(filter);

    res.status(200).json({ data });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const data = await Product.findById(id);
  res.status(200).json({ data });
};

const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    //  {
    //   produN :
    //   ram :
    //   imageNmae :
    //   imageUrl :
    //  }
    console.log(product);
    const imageStatus = await cloudinary.uploader.destroy(product.imageName);
    console.log(imageStatus);
    const data = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deletes Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occured while trying to delete");
  }
};
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    //   const {ram,rom,productName,gen,price,brand} = req.body
    const product = await Product.findById(id)

      if(req.file){
          cloudinary.uploader.destroy(product.imageName)
          const imageUrl = req.file.path;
           const imageName = req.file.filename;
           req.body.imageUrl = imageUrl
           req.body.imageName = imageName
      }

    const data = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ data, message: "prduct updated succcessfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

export {
  createProduct,
  getAllProduct,
  getProductById,
  deleteProductById,
  updateProduct,
};
