import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // ✅ Tailwind loaded globally

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
