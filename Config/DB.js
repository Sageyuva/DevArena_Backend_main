const mongoose = require("mongoose")

const connectDB = async() => {
  try {
    const connect = await   mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`MongoDB Connected: ${connect.connection.host}`)
  } catch (error) {
    
    console.error(error)
  }
        }
        module.exports = connectDB