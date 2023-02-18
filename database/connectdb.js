import mongoose from "mongoose";

try {
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.URI_MONGO)
  console.log('Connect DB ok 👏')
} catch (error) {
  console.log('Error de conexion mongodb:' + error)
}