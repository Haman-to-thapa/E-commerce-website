// import mongoose from "mongoose";
import dotenv  from 'dotenv'
import mongoose from 'mongoose'
import product from './models/product.js';
import User from './models/User.js';
import products from './data/products.js';



dotenv.config()

// Connect to mongoDB

await mongoose.connect(process.env.MONGO_URI);

// Function to seed data

const seedData = async () => {
  try {
    // Cear existingg datat

    await product.deleteMany();
    await User.deleteMany();


    // Create a default amdin User

    const createUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    })

    // Assign the default user Id to each product

    const userID = createUser._id;

    const sampleProducts = products.map((product) => {
      return {...product, user : userID};
    });


    // insert the products into the database 
    await product.insertMany(sampleProducts);
    console.log("product data seeded Successfully");
    process.exit();


  } catch (error) {
    console.error("Error seeding the data",error);
    process.exit(1);

  }
}

seedData()

