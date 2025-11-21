import { uploadOnCloudinary } from "../config/cloudnary.js";
import { Product } from "../models/product.model.js";
import path from "path";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, size, bestseller } = req.body;

    // Validate required fields
    if ([name, description, price, category, subCategory, size, bestseller].some(
      field => !field || field.trim() === ""
    )) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Get filenames saved by multer
    const image1 = req.files?.image1?.[0]?.path;
    const image2 = req.files?.image2?.[0]?.path;
    const image3 = req.files?.image3?.[0]?.path;
    const image4 = req.files?.image4?.[0]?.path;

    let imageUrls = [];

    // Upload image1
    if (image1) {
      const filePath = image1;
      const upload = await uploadOnCloudinary(filePath);
      if (upload?.secure_url) imageUrls.push(upload.secure_url);
    }

    // Upload image2
    if (image2) {
      const filePath = image2;
      const upload = await uploadOnCloudinary(filePath);
      if (upload?.secure_url) imageUrls.push(upload.secure_url);
    }

    // Upload image3
    if (image3) {
      const filePath = image3;
      const upload = await uploadOnCloudinary(filePath);
      if (upload?.secure_url) imageUrls.push(upload.secure_url);
    }

    // Upload image4
    if (image4) {
      const filePath = image4;
      const upload = await uploadOnCloudinary(filePath);
      if (upload?.secure_url) imageUrls.push(upload.secure_url);
    }

    // Save to database
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      subCategory,
      size: JSON.parse(size),
      bestseller,
      image: imageUrls,
      date: Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category, subCategory, size, bestseller, removeImages } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }



    const uploadNewImages = [];

    const paths = [
      req.files?.image1?.[0]?.path,
      req.files?.image2?.[0]?.path,
      req.files?.image3?.[0]?.path,
      req.files?.image4?.[0]?.path
    ];

    for (const filePath of paths) {
      if (filePath) {
        const upload = await uploadOnCloudinary(filePath);
        if (upload?.secure_url) uploadNewImages.push(upload.secure_url);
      }
    }


    let finalImages = [...product.image];

    if (removeImages) {
      const removeList = JSON.parse(removeImages);
      finalImages = finalImages.filter((img, i) => !removeList.includes(i));
    }


    finalImages.push(...uploadNewImages);


    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        subCategory,
        size: JSON.parse(size),
        bestseller,
        image: finalImages,
      },
      { new: true } // return updated product
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`
    });
  }
};


export const listProducts = async (req, res) => {
  try {
    const products = await Product.find()
    return res.status(200).send({ success: true, message: `all products`, products });
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Product ID is required",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const singleproduct = await Product.findById(req.params.id)
    return res.status(200).send({ success: true, message: `single procduct get successfully`, singleproduct });
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};