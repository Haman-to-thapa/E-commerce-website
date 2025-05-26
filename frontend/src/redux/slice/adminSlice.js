import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all users (admin only)
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return rejectWithValue({ message: "No authentication token found. Please login again." });
    }

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      return rejectWithValue({ message: "Authentication failed. Please login again." });
    }
    return rejectWithValue(error.response?.data || { message: "Failed to fetch users" });
  }
})

// Add the create user action
export const addUser = createAsyncThunk('admin/addUser', async(userData, {rejectWithValue}) => {

try {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }

  })
 return response.data;
} catch (error) {
  return rejectWithValue(error.response.message)
}
})

// Update user info

  export const updateUser = createAsyncThunk('admin/updatedUser', async({id, name, email, role}, {rejectWithValue}) => {
    try {

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,{name,email,role}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      })
     return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  })


// Delete a user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {

  try {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
    });
    return response.data;
  } catch (error) {

    return rejectWithValue(error.response?.data || "Error deleting user");
  }
});


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users : [],
    loading : false,
    error : null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUsers.fulfilled, (state,action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
    .addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const updatedUser = action.payload.user;
      const userIndex = state.users.findIndex((user) => user._id === updatedUser._id);

      if(userIndex !== -1) {
        state.users[userIndex] = updatedUser;
      }
      state.error = null;
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to update user";
    })
    .addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== action.payload.user);
      state.error = null;
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to delete user";
    })
    .addCase(addUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users.push(action.payload.user) // add a new user to the state

    })
    .addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to add user";
    })

  }
});

export default adminSlice.reducer;