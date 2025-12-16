import mongoose from "mongoose";

const FreeShippingBarSchema = new mongoose.Schema(
  {
    shop: { type: String, required: true }, 
    title: String,
    goalAmount: Number,
    initialMessage: String,
    pendingMessage: String,
    successMessage: String,
    backgroundColor: String,
    textColor: String,
    specialTextColor: String,
    fontFamily: String,
    fontSize: Number,
  },
  { timestamps: true }
);

export const Shipping = mongoose.models.Shipping ||  mongoose.model("Shipping", FreeShippingBarSchema);
