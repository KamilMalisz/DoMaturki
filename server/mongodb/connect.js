import mongoose from "mongoose";

const connectMongoDB = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectMongoDB;
