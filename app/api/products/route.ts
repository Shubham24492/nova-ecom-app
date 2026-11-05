import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "CloudRunner Sneakers", category: "Footwear", price: 129, image: "👟", accent: "#dff4ec" },
  { id: 2, name: "Nimbus Headphones", category: "Audio", price: 189, image: "🎧", accent: "#eee9ff" },
  { id: 3, name: "Orbit Smart Watch", category: "Wearables", price: 249, image: "⌚", accent: "#ffe9d8" },
  { id: 4, name: "Vertex Backpack", category: "Accessories", price: 89, image: "🎒", accent: "#dfeeff" },
  { id: 5, name: "Aero Desk Lamp", category: "Home", price: 119, image: "💡", accent: "#fff0bf" },
  { id: 6, name: "Pulse Speaker", category: "Audio", price: 159, image: "🔊", accent: "#ffdede" },
];

export async function GET() {
  return NextResponse.json({ products, source: process.env.AZURE_SQL_CONNECTION_STRING ? "azure-compatible" : "demo-catalog" });
}
