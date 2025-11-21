
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config(); // loads .env

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("LOCALPATH ", path.resolve(localFilePath))

    const res = await cloudinary.uploader.upload(path.resolve(localFilePath), {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return res;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};
