import axios from "axios";
import { URL } from "./api";

export async function GetAllProducts(start = 0, end = 100) {
  try {
    const response = await axios.get(`${URL}/products`);
    let data = response.data;

    // Slice using start and end
    data = data.slice(start, end);

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function GetProductById(id) {
  const response = await fetch(`${URL}/products/${id}`);
  if (!response.ok) throw new Error("Product not found");
  return response.json();
}

