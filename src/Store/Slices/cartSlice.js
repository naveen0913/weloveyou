import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { BaseUrl, prodUrl } from "../../Components/Constants";

const API_BASE = "http://localhost:8081/api/cart";

export const fetchCartItems = createAsyncThunk(
  "cart/fetchItems",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth?.userId;
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      // const res = await axios.get(
      //   `http://localhost:8081/api/cart/user/${userId}`
      // );

      const res = await axios.get(prodUrl+"cart/user/"+userId)

      if (res.data.code === 200) {
        return { items: res.data.data };
      } else {
        return rejectWithValue("Failed to fetch cart items");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, newQuantity }, { rejectWithValue }) => {
    try {
      if (newQuantity < 1)
        return rejectWithValue("Quantity must be at least 1");

      const formData = new FormData();
      const cartPayload = { cartQuantity: newQuantity };
      formData.append("cartPayload", JSON.stringify(cartPayload));

      const res = await axios.put(
        `${prodUrl}cart/update/${cartItemId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.code === 200) {
        toast.success("Cart Updated Successfully");
        return { cartItemId, newQuantity };
      } else {
        toast.error("Failed to Update Cart");
        return rejectWithValue("Failed to update");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_BASE}/${cartItemId}`);
      if (res.data.code === 200) {
        toast.success("Item Removed from the cart!", { autoClose: 1000 });
        return cartItemId;
      } else {
        toast.error("Unable to remove from the cart!", { autoClose: 1000 });
        return rejectWithValue("Delete failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      return rejectWithValue(err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async (
    { selectedOption, userId, productId, payload },
    { rejectWithValue, dispatch }
  ) => {
    try {
      if (!selectedOption) return rejectWithValue("No option selected");

      const formData = new FormData();
      const { mainPhoto, uploadedPhotos, ...restPayload } = payload;
      formData.append("cartPayload", JSON.stringify(restPayload));

      if (mainPhoto instanceof File) {
        formData.append("customImages", mainPhoto);
      }

      if (Array.isArray(uploadedPhotos) && uploadedPhotos.length > 0) {
        uploadedPhotos.forEach((photoObj) => {
          if (photoObj instanceof File) {
            formData.append("customImages", photoObj);
          }
        });
      }

      if (
        !(mainPhoto instanceof File) &&
        (!Array.isArray(uploadedPhotos) || uploadedPhotos.length === 0)
      ) {
        formData.append("customImages", new File([], "empty.jpg"));
      }

      const res = await axios.post(
        `${prodUrl}cart/add/${selectedOption.id}/${userId}/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.code === 201) {
        await dispatch(uploadCustomerPreview(res.data.data));
        const updatedCart = await dispatch(fetchCartItems()).unwrap();
        return updatedCart;
      } else {
        toast.error("Failed to add item. Try again.");
        return rejectWithValue("Failed to add item");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong while adding to cart.");
      return rejectWithValue(err.message);
    }
  }
);

export const uploadCustomerPreview = createAsyncThunk(
  "cart/uploadCustomerPreview",
  async (cartId, { rejectWithValue }) => {
    try {
      for (const item of JSON.parse(localStorage.getItem("previewData"))) {
        const formData = new FormData();
        formData.append("imageName", item.imageName);
        formData.append("imageType", item.imageType);

        if (item.imageFile) {
          const blob = await (await fetch(item.imageFile)).blob();
          formData.append("files", blob, item.imageName);
        }

        const response = await axios.post(
          `${prodUrl}cart/add/cart/preview-data/${cartId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.data.code === 201) {
          localStorage.removeItem("previewData");
        }
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartItems: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.items = items;
      state.itemCount = items.length;
    },
  },
  extraReducers: (builder) => {
    // Add item
    builder.addCase(addToCart.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.items = action.payload.items;
      state.itemCount = state.items.length;
      state.total = state.items.reduce(
        (total, item) =>
          total +
          (item.price ?? item.optionPrice ?? 0) * (item.cartQuantity ?? 1),
        0
      );
    });

    // get user cart items
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.itemCount = state.items.length;
        state.total = state.items.reduce(
          (total, item) =>
            total +
            (item.price ?? item.optionPrice ?? 0) * (item.cartQuantity ?? 1),
          0
        );
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // update cart quantity
    builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
      const { cartItemId, newQuantity } = action.payload;
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      if (item) {
        item.cartQuantity = newQuantity;
      }
      state.itemCount = state.items.length;
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
      );
    });

    // delete cart item
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload
      );
      state.itemCount = state.items.length;
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
      );
    });
  },
});

export const { clearCart, setCartItems, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
