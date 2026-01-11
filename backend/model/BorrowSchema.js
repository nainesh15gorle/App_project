import mongoose from "mongoose";
import Item from "./schema.model.js";

// Schema to track when a user borrows lab components
// Fields are kept simple and well-commented for easier debugging.
const { Schema } = mongoose;

const BorrowSchema = new Schema(
  {
    // Name of the person borrowing the component
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Registration number of the borrower
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Reference to the actual component in the inventory (Item collection)
    component: {
      type: Schema.Types.ObjectId,
      ref: Item.modelName, // uses the same model as defined in schema.model.js ("test")
      required: true,
    },

    // How many units are being borrowed
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Optional cached component name for easier debugging / reporting
    componentName: {
      type: String,
      required: false,
      trim: true,
    },

    // Timestamp for when the component was borrowed
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "borrows",
  }
);

const Borrow = mongoose.model("Borrow", BorrowSchema);

export default Borrow;
