import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/cutomers/customerSlice";
import productReducer from "../features/product/productSlice";
import brandReducer from "../features/brand/brandSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";
import bCategoryReducer from "../features/bcategory/bcategorySlice";
import blogReducer from "../features/blogs/blogSlice";
import colorReducer from "../features/color/colorSlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import supplierReducer from "../features/supplier/supplierSlice";
import uploadReducer from "../features/upload/uploadSlice";
import couponReducer from "../features/coupon/couponSlice";

const base_url = "http://localhost:5000/api/";

const config = {
  baseURL: 'http://api.example.com', // Base URL for API requests
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json', // Content type for request payloads
    'Authorization': 'Bearer <your_token>', // Authorization header with token
  },
  // Other axios configuration options...
};

const productService = {
  createProduct: async (product) => {
    try {
      const response = await axios.post(`${base_url}product/`, product, config);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product. Please try again later.");
    }
  }
};

export const createProducts = createAsyncThunk(
  "product/create-products",
  async function createProductThunk(productData, thunkAPI) {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    brand: brandReducer,
    pCategory: pCategoryReducer,
    bCategory: bCategoryReducer,
    blogs: blogReducer,
    color: colorReducer,
    enquiry: enquiryReducer,
    upload: uploadReducer,
    coupon: couponReducer,
    supplier: supplierReducer,
  },
});
