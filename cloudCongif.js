const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.ClOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary:cloudinary,
  params: {
    folder: "wanderlust_DEV", // your folder name in cloudinary
    allowed_formats: ["jpeg", "png", "jpg"],
    //public_id: (req, file)=>'computed-filename-using-request'
  },
});

module.exports = {
  cloudinary,
  storage,
};