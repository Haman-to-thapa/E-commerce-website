import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async(_, {rejectWithValue}) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return rejectWithValue({ message: "No authentication token found. Please login again." });
    }

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, {headers: {
      Authorization: `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      return rejectWithValue({ message: "Authentication failed. Please login again." });
    }
    return rejectWithValue(error.response?.data || { message: error.message || "Failed to fetch orders" });
  }
})


// Async thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk('orders/fetchOrderDetails', async(orderId, {rejectWithValue}) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return rejectWithValue({ message: "No authentication token found. Please login again." });
    }

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
      {headers: {
        Authorization: `Bearer ${token}`
      }}
    )
    return response.data;

  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      return rejectWithValue({ message: "Authentication failed. Please login again." });
    }
    return rejectWithValue(error.response?.data || { message: error.message || "Failed to fetch order details" });
  }
})

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    //Fetch user orders
    .addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase(fetchUserOrders.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload?.message || action.error?.message || "Failed to fetch orders";
    })
 // fetch order details
 .addCase(fetchOrderDetails.pending, (state) => {
  state.loading = true;
  state.error = null;
 })
 .addCase(fetchOrderDetails.fulfilled, (state,action) => {
  state.loading = false;
  state.orderDetails = action.payload;
 })
 .addCase(fetchOrderDetails.rejected, (state,action) => {
  state.loading = false;
  state.error = action.payload?.message || action.error?.message || "Failed to fetch order details";
 })
  },
})
 export default orderSlice.reducer;