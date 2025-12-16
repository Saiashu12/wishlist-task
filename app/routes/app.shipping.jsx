import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { Shipping } from "../routes/modal/Shipping";
import { connectDB } from "../db.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  await connectDB();
  const data = await Shipping.findOne({ shop });
  return (
    Response.json(data.toObject()) || {
      title: "Free Shipping Bar",
      goalAmount: 100,
      initialMessage: "Get your shopping on!",
      pendingMessage: "Just ₹50 more to unlock free shipping",
      successMessage: "Yay! Free shipping unlocked",
      backgroundColor: "#3e4e4c",
      textColor: "#ffffff",
      specialTextColor: "#ff9900",
      fontFamily: "Roboto",
      fontSize: "18",
    }
  );
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  await connectDB();

  const body = await request.formData();
  const data = Object.fromEntries(body);
  data.goalAmount = Number(data.goalAmount);
  data.fontSize = Number(data.fontSize);

  console.log("form submitted data:", data);

  await Shipping.findOneAndUpdate({ shop }, data, { upsert: true, new: true });

  return { status: "saved" };
};

export default function Index() {
  const saved = useLoaderData();
  const fetcher = useFetcher();

  const [form, setForm] = useState(saved);

  const updateField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <style>
        {`
        input[type="number"] {
          appearance: textfield;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          appearance: none;
        }
      `}
      </style>

      <h2>Free Shipping Bar Settings</h2>

      <form method="post">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Goal Amount
        </label>
        <input
          type="number"
          name="goalAmount"
          placeholder="enter amount in dollars"
          value={form.goalAmount}
          onChange={(e) => updateField("goalAmount", e.target.value)}
          style={{
            width: "220px",
            height: "20px",
          }}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Initial Message
        </label>
        <textarea
          name="initialMessage"
          value={form.initialMessage}
          placeholder="ensure that message contains keyword of goalamount"
          onChange={(e) => updateField("initialMessage", e.target.value)}
          style={{
            width: "220px",
            height: "45px",
            padding: "6px",
            borderRadius: "6px",
          }}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Pending Message
        </label>
        <textarea
          name="pendingMessage"
          value={form.pendingMessage}
          placeholder="ensure that message contains keyword of goalamount"
          style={{
            width: "220px",
            height: "45px",
            padding: "6px",
            borderRadius: "6px",
          }}
          onChange={(e) => updateField("pendingMessage", e.target.value)}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Success Message
        </label>
        <textarea
          name="successMessage"
          value={form.successMessage}
          placeholder="enter success message"
          style={{
            width: "220px",
            height: "45px",
            padding: "6px",
            borderRadius: "6px",
          }}
          onChange={(e) => updateField("successMessage", e.target.value)}
        />
        <br />
        <br />
        <label>Background Color</label>
        <input
          type="color"
          name="backgroundColor"
          value={form.backgroundColor}
          onChange={(e) => updateField("backgroundColor", e.target.value)}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Text Color
        </label>
        <input
          type="color"
          name="textColor"
          value={form.textColor}
          onChange={(e) => updateField("textColor", e.target.value)}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Special Highlight Color
        </label>
        <input
          type="color"
          name="specialTextColor"
          value={form.specialTextColor}
          onChange={(e) => updateField("specialTextColor", e.target.value)}
        />
        <br />
        <br />
        <label
          style={{
            paddingRight: "20px",
          }}
        >
          Font Family
        </label>
        <select
          name="fontFamily"
          value={form.fontFamily}
          onChange={(e) => updateField("fontFamily", e.target.value)}
        >
          <option value="Roboto">Roboto</option>
          <option value="Lato">Lato</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Oswald">Oswald</option>
          <option value="Raleway">Raleway</option>
          <option value="Carter One">Carter One</option>
        </select>
        <br />
        <br />
        <label>Font Size (px)</label>
        <input
          type="number"
          name="fontSize"
          value={form.fontSize}
          onChange={(e) => updateField("fontSize", e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Save Settings</button>
      </form>

      <hr />
      <br />
      <br />
      <h3>Preview:</h3>
      <style>
        {`
    @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Lato&family=Open+Sans&family=Montserrat&family=Oswald&family=Raleway&family=Carter+One&display=swap');
  `}
      </style>

      <div
        style={{
          background: form.backgroundColor,
          color: form.textColor,
          fontSize: `${form.fontSize}px`,
          fontFamily: `${form.fontFamily}`,
          padding: "12px",
          borderRadius: "6px",
        }}
      >
        {form.initialMessage}{" "}
        <span style={{ color: form.specialTextColor }}>
          ({form.goalAmount} Left)
        </span>
      </div>
    </div>
  );
}
