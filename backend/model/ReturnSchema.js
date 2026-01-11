import mongoose from "mongoose";
import Item from "./schema.model.js";

// Schema to track when a user returns lab components
// Mirrors the Borrow schema for consistent debugging and reporting.
const { Schema } = mongoose;

const ReturnSchema = new Schema(
  {
    // Name of the person returning the component
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Registration number of the student returning the component
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

    // How many units are being returned
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

    // Timestamp for when the component was returned
    returnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "returns",
  }
);

const Return = mongoose.model("Return", ReturnSchema);

export default Return;
