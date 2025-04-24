import fs from 'fs';
import path from 'path';

// Define the paths
const orderLowerPath = path.join(process.cwd(), 'models', 'order.js');
const orderUpperPath = path.join(process.cwd(), 'models', 'Order.js');

// Check if files exist
const lowerExists = fs.existsSync(orderLowerPath);
const upperExists = fs.existsSync(orderUpperPath);

console.log(`Checking file existence:`);
console.log(`- lowercase order.js exists: ${lowerExists}`);
console.log(`- uppercase Order.js exists: ${upperExists}`);

// If both files exist, we need to fix the issue
if (lowerExists && upperExists) {
  console.log('Both files exist. Removing the lowercase version...');
  fs.unlinkSync(orderLowerPath);
  console.log('Lowercase version removed successfully.');
} 
// If only lowercase exists, rename it to uppercase
else if (lowerExists && !upperExists) {
  console.log('Only lowercase version exists. Renaming to uppercase...');
  const content = fs.readFileSync(orderLowerPath, 'utf8');
  fs.writeFileSync(orderUpperPath, content);
  fs.unlinkSync(orderLowerPath);
  console.log('File renamed successfully.');
}
// If only uppercase exists, we're good
else if (!lowerExists && upperExists) {
  console.log('Only uppercase version exists. No action needed.');
}
// If neither exists, we have a bigger problem
else {
  console.error('ERROR: Neither file exists! Creating the Order.js file...');
  
  // Create the Order.js file with the correct content
  const orderContent = `import mongoose from "mongoose";


const  orderItemSchema = new mongoose.Schema({
  productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},

  name: {type: String, required: true},
  image: {type: String , required: true},
  price: {type: Number, required: true},
 size : String, 
 color: String,
 quantity: {type: Number, required: true},

},
{_id: false}
);

const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  orderItems: [orderItemSchema],

  shippingAddress: 
  {
    address: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true}
},

paymentMethod: {type: String, required: true},
totalPrice: {type: Number, required: true},
isPaid: {type: Boolean, default: false},
paidAt: {type: Date},

isDelivered: {type: Boolean, default: false},
deliveredAt: {type: Date},
paymentStatus: {type: String, default: "Pending"},
status: {type: String, enum: ["Processing", "Shipping","Delivered","Cancelled"], default: "Processing"}

},{timestamps: true})

export default mongoose.model("Order", orderSchema);`;
  
  fs.writeFileSync(orderUpperPath, orderContent);
  console.log('Order.js file created successfully.');
}

console.log('File check and fix completed.');
