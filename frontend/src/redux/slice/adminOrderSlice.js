import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return `Bearer ${token}`;
};

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: getAuthToken() }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue({ message: "Authentication failed. Please login again." });
      }
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// Update order delivery status

export const updateOrderStatus = createAsyncThunk('adminOrders/updateOrderStatus', async({id, status}, {rejectWithValue}) => {
  try {
    
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,{status}, {
      headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`}
    })

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.message || "Failed updateOrderStatus")
  }
})



// Delete an order
export const deleteOrders = createAsyncThunk('adminOrders/deleteOrders', async({id}, {rejectWithValue})  => {

try {
  await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, {
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`}
  })
  return id;
} catch (error) {
  return rejectWithValue(error.id?.message || "failed to delete")
}

})

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.error = null;

        // calculate total sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Failed to fetch orders" };
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state,action) => {
        const updateOrders = action.payload;
        const orderIndex = state.orders.findIndex((order) => order._id === updateOrders._id);
        if(orderIndex !== -1) {
          state.orders[orderIndex] = updateOrders;
        }
      })
      .addCase(deleteOrders.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload)
      })
  }
});

export const { clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;