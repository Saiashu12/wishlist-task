import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { Shipping } from "../routes/modal/Shipping";
import { connectDB } from "../db.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.public.appProxy(request);
  const shop = session.shop;

  await connectDB();
  const data = await Shipping.findOne({ shop });
  return (
    Response.json(data.toObject()) || {
      title: "Free Shipping Bar",
      goalAmount: 100,
      initialMessage: "Get your shopping on! goal amount ",
      pendingMessage: "Just goal amount more to unlock free shipping",
      successMessage: "Yay! Free shipping unlocked",
      backgroundColor: "#3e4e4c",
      textColor: "#ffffff",
      specialTextColor: "#ff9900",
      fontFamily: "Roboto",
      fontSize: "18",
    }
  );
};
