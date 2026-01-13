import mongoose from "mongoose";

const BorrowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    COMPONENTS: {
      type: String,
      required: true,
    },
    QUANTITY: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Borrow", BorrowSchema);
