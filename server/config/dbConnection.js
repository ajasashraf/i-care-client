const mongoose = require("mongoose");

const connection = () => {
  mongoose.connect("mongodb+srv://ajas:ajas123@cluster0.ciqiyr0.mongodb.net/Cluster0?retryWrites=true&w=majority", () =>
    console.log("db connected")
  );
};

export default connection;
