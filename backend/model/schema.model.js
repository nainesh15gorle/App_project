import mongoose from "mongoose";
const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    COMPONENTS: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    QUANTITY: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { collection: "items" }
);

export default mongoose.model("Item", ItemSchema);
