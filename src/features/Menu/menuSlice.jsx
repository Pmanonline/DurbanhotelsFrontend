// features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendURL from "../../config";

const getToken = (getState) => {
  const state = getState();

  return (
    state.adminAuth?.adminInfo?.token || state.auth?.userInfo?.token || null
  );
};

// ==================== Async Thunks ====================

// ── Get all menus (public) ───────────────────────────────────────────────────
export const fetchAllMenus = createAsyncThunk(
  "menu/fetchAllMenus",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.is_public !== undefined)
        queryParams.append("is_public", String(params.is_public));
      if (params.menu_type) queryParams.append("menu_type", params.menu_type);
      if (params.page) queryParams.append("page", String(params.page));
      if (params.limit) queryParams.append("limit", String(params.limit));

      const response = await axios.get(
        `${backendURL}/menu/public?${queryParams}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch menus",
      );
    }
  },
);

// ── Get menu by ID (admin — returns full menu tree) ───────────────────────────
// FIX: was calling /${menuId}/public/items (public flat items endpoint).
//      Now calls the protected GET /:menuId which returns { data: { menu } }.
export const fetchMenuById = createAsyncThunk(
  "menu/fetchMenuById",
  async (menuId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.get(`${backendURL}/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch menu",
      );
    }
  },
);

// ── Get my menu (owner) ──────────────────────────────────────────────────────
export const fetchMyMenu = createAsyncThunk(
  "menu/fetchMyMenu",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.get(`${backendURL}/menu/my-menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your menu",
      );
    }
  },
);

// ── Get all menus (admin) ────────────────────────────────────────────────────
// FIX: was calling /menu/admin — correct route is GET /menu (protected)
export const fetchAllMenusAdmin = createAsyncThunk(
  "menu/fetchAllMenusAdmin",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);

      const queryParams = new URLSearchParams();
      if (params.is_public !== undefined)
        queryParams.append("is_public", String(params.is_public));
      if (params.menu_type) queryParams.append("menu_type", params.menu_type);
      if (params.page) queryParams.append("page", String(params.page));
      if (params.limit) queryParams.append("limit", String(params.limit));

      const response = await axios.get(`${backendURL}/menu?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch menus",
      );
    }
  },
);

// ── Create menu ───────────────────────────────────────────────────────────────
export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (menuData, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(`${backendURL}/menu`, menuData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create menu",
      );
    }
  },
);

// ── Update menu ───────────────────────────────────────────────────────────────
export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async ({ menuId, menuData }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.put(
        `${backendURL}/menu/${menuId}`,
        menuData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update menu",
      );
    }
  },
);

// ── Delete menu ───────────────────────────────────────────────────────────────
export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (menuId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.delete(`${backendURL}/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { menuId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete menu",
      );
    }
  },
);

// ── Add category ──────────────────────────────────────────────────────────────
export const addCategory = createAsyncThunk(
  "menu/addCategory",
  async ({ menuId, categoryData }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(
        `${backendURL}/menu/${menuId}/categories`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add category",
      );
    }
  },
);

// ── Update category ───────────────────────────────────────────────────────────
export const updateCategory = createAsyncThunk(
  "menu/updateCategory",
  async (
    { menuId, categoryId, categoryData },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/menu/${menuId}/categories/${categoryId}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category",
      );
    }
  },
);

// ── Delete category ───────────────────────────────────────────────────────────
export const deleteCategory = createAsyncThunk(
  "menu/deleteCategory",
  async ({ menuId, categoryId }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.delete(
        `${backendURL}/menu/${menuId}/categories/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return { menuId, categoryId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category",
      );
    }
  },
);

// ── Add subcategory ───────────────────────────────────────────────────────────
export const addSubCategory = createAsyncThunk(
  "menu/addSubCategory",
  async (
    { menuId, categoryId, subCategoryData },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories`,
        subCategoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add subcategory",
      );
    }
  },
);

// ── Update subcategory ────────────────────────────────────────────────────────
export const updateSubCategory = createAsyncThunk(
  "menu/updateSubCategory",
  async (
    { menuId, categoryId, subCategoryId, subCategoryData },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories/${subCategoryId}`,
        subCategoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subcategory",
      );
    }
  },
);

// ── Delete subcategory ────────────────────────────────────────────────────────
export const deleteSubCategory = createAsyncThunk(
  "menu/deleteSubCategory",
  async (
    { menuId, categoryId, subCategoryId },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.delete(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories/${subCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return {
        menuId,
        categoryId,
        subCategoryId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subcategory",
      );
    }
  },
);

// ── Add menu item ─────────────────────────────────────────────────────────────
export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async (
    { menuId, categoryId, subCategoryId, itemData },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories/${subCategoryId}/items`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add menu item",
      );
    }
  },
);

// ── Update menu item ──────────────────────────────────────────────────────────
export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async (
    { menuId, categoryId, subCategoryId, itemId, itemData },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories/${subCategoryId}/items/${itemId}`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update menu item",
      );
    }
  },
);

// ── Delete menu item ──────────────────────────────────────────────────────────
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (
    { menuId, categoryId, subCategoryId, itemId },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.delete(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories/${subCategoryId}/items/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return {
        menuId,
        categoryId,
        subCategoryId,
        itemId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete menu item",
      );
    }
  },
);

// ── Toggle item availability ──────────────────────────────────────────────────
export const toggleItemAvailability = createAsyncThunk(
  "menu/toggleItemAvailability",
  async (
    { menuId, categoryId, subCategoryId, itemId },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/menu/${menuId}/categories/${categoryId}/subcategories/${subCategoryId}/items/${itemId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle availability",
      );
    }
  },
);

// ── Get all menu items (public) ───────────────────────────────────────────────
export const fetchAllMenuItems = createAsyncThunk(
  "menu/fetchAllMenuItems",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.categoryId)
        queryParams.append("categoryId", params.categoryId);
      if (params.subCategoryId)
        queryParams.append("subCategoryId", params.subCategoryId);
      if (params.available !== undefined)
        queryParams.append("available", String(params.available));

      const response = await axios.get(
        `${backendURL}/menu/public/items?${queryParams}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch menu items",
      );
    }
  },
);

// ── Create order (public) ─────────────────────────────────────────────────────
export const createOrder = createAsyncThunk(
  "menu/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/menu/public/orders`,
        orderData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

// ── Track order by ID (public) ────────────────────────────────────────────────
export const trackOrder = createAsyncThunk(
  "menu/trackOrder",
  async (trackingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/menu/public/orders/track/${trackingId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track order",
      );
    }
  },
);

// ── Get orders by phone (public) ──────────────────────────────────────────────
export const fetchOrdersByPhone = createAsyncThunk(
  "menu/fetchOrdersByPhone",
  async (phone, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendURL}/menu/public/orders/phone/${phone}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// ── Get all orders (staff) ────────────────────────────────────────────────────
export const fetchAllOrders = createAsyncThunk(
  "menu/fetchAllOrders",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);

      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append("status", params.status);
      if (params.orderType) queryParams.append("orderType", params.orderType);
      if (params.date) queryParams.append("date", params.date);
      if (params.page) queryParams.append("page", String(params.page));
      if (params.limit) queryParams.append("limit", String(params.limit));

      const response = await axios.get(
        `${backendURL}/menu/orders?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// ── Get order by ID (staff) ───────────────────────────────────────────────────
export const fetchOrderById = createAsyncThunk(
  "menu/fetchOrderById",
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.get(`${backendURL}/menu/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

// ── Update order status (staff) ───────────────────────────────────────────────
export const updateOrderStatus = createAsyncThunk(
  "menu/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/menu/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);

// ── Update payment status (staff) ─────────────────────────────────────────────
export const updatePaymentStatus = createAsyncThunk(
  "menu/updatePaymentStatus",
  async (
    { orderId, paymentStatus, paymentMethod },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/menu/orders/${orderId}/payment`,
        { paymentStatus, paymentMethod },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment status",
      );
    }
  },
);

// ==================== Initial State ====================

const initialState = {
  // Menu data
  menus: [],
  currentMenu: null,
  menuItems: [],

  // Orders
  orders: [],
  currentOrder: null,
  orderTracking: null,

  // UI states
  loading: false,
  error: null,
  success: false,
  successMessage: null,

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

// ==================== Slice ====================

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
    },
    clearMenuSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    clearCurrentMenu: (state) => {
      state.currentMenu = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderTracking: (state) => {
      state.orderTracking = null;
    },
    resetMenuState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch All Menus ────────────────────────────────────────────────────
      .addCase(fetchAllMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload.data?.menus || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Menu By ID ───────────────────────────────────────────────────
      // FIX: now reads data.menu (full category tree) not data.items (flat list)
      .addCase(fetchMenuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenu = action.payload.data?.menu || null;
        state.menuItems = []; // clear stale flat list; full tree is in currentMenu.categories
      })
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch My Menu ──────────────────────────────────────────────────────
      .addCase(fetchMyMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenu = action.payload.data?.menu || null;
      })
      .addCase(fetchMyMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch All Menus Admin ───────────────────────────────────────────────
      .addCase(fetchAllMenusAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMenusAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload.data?.menus || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllMenusAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Create Menu ─────────────────────────────────────────────────────────
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenu = action.payload.data?.menu || null;
        state.success = true;
        state.successMessage =
          action.payload.message || "Menu created successfully";
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ── Update Menu ─────────────────────────────────────────────────────────
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenu = action.payload.data?.menu || null;
        state.success = true;
        state.successMessage =
          action.payload.message || "Menu updated successfully";

        // Update in menus array if present
        const index = state.menus.findIndex(
          (m) => m._id === action.payload.data?.menu?._id,
        );
        if (index !== -1) {
          state.menus[index] = action.payload.data.menu;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Delete Menu ─────────────────────────────────────────────────────────
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = state.menus.filter(
          (m) => m._id !== action.payload.menuId,
        );
        if (state.currentMenu?._id === action.payload.menuId) {
          state.currentMenu = null;
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Menu deleted successfully";
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Add Category ────────────────────────────────────────────────────────
      .addCase(addCategory.fulfilled, (state, action) => {
        if (state.currentMenu) {
          state.currentMenu.categories.push(action.payload.data?.category);
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Category added successfully";
        state.loading = false;
      })

      // ── Update Category ─────────────────────────────────────────────────────
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const index = state.currentMenu.categories.findIndex(
            (c) => c._id === action.payload.data?.category?._id,
          );
          if (index !== -1) {
            state.currentMenu.categories[index] = action.payload.data.category;
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Category updated successfully";
        state.loading = false;
      })

      // ── Delete Category ─────────────────────────────────────────────────────
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (state.currentMenu) {
          state.currentMenu.categories = state.currentMenu.categories.filter(
            (c) => c._id !== action.payload.categoryId,
          );
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Category deleted successfully";
        state.loading = false;
      })

      // ── Add SubCategory ─────────────────────────────────────────────────────
      .addCase(addSubCategory.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.meta.arg.categoryId,
          );
          if (category) {
            category.subCategories.push(action.payload.data?.subCategory);
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Subcategory added successfully";
        state.loading = false;
      })

      // ── Update SubCategory ──────────────────────────────────────────────────
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.meta.arg.categoryId,
          );
          if (category) {
            const index = category.subCategories.findIndex(
              (s) => s._id === action.payload.data?.subCategory?._id,
            );
            if (index !== -1) {
              category.subCategories[index] = action.payload.data.subCategory;
            }
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Subcategory updated successfully";
        state.loading = false;
      })

      // ── Delete SubCategory ──────────────────────────────────────────────────
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.payload.categoryId,
          );
          if (category) {
            category.subCategories = category.subCategories.filter(
              (s) => s._id !== action.payload.subCategoryId,
            );
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Subcategory deleted successfully";
        state.loading = false;
      })

      // ── Add Menu Item ───────────────────────────────────────────────────────
      .addCase(addMenuItem.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.meta.arg.categoryId,
          );
          if (category) {
            const subCategory = category.subCategories.find(
              (s) => s._id === action.meta.arg.subCategoryId,
            );
            if (subCategory) {
              subCategory.items.push(action.payload.data?.item);
            }
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Menu item added successfully";
        state.loading = false;
      })

      // ── Update Menu Item ────────────────────────────────────────────────────
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.meta.arg.categoryId,
          );
          if (category) {
            const subCategory = category.subCategories.find(
              (s) => s._id === action.meta.arg.subCategoryId,
            );
            if (subCategory) {
              const index = subCategory.items.findIndex(
                (i) => i._id === action.payload.data?.item?._id,
              );
              if (index !== -1) {
                subCategory.items[index] = action.payload.data.item;
              }
            }
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Menu item updated successfully";
        state.loading = false;
      })

      // ── Delete Menu Item ────────────────────────────────────────────────────
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.payload.categoryId,
          );
          if (category) {
            const subCategory = category.subCategories.find(
              (s) => s._id === action.payload.subCategoryId,
            );
            if (subCategory) {
              subCategory.items = subCategory.items.filter(
                (i) => i._id !== action.payload.itemId,
              );
            }
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Menu item deleted successfully";
        state.loading = false;
      })

      // ── Toggle Item Availability ────────────────────────────────────────────
      .addCase(toggleItemAvailability.fulfilled, (state, action) => {
        if (state.currentMenu) {
          const category = state.currentMenu.categories.find(
            (c) => c._id === action.meta.arg.categoryId,
          );
          if (category) {
            const subCategory = category.subCategories.find(
              (s) => s._id === action.meta.arg.subCategoryId,
            );
            if (subCategory) {
              const item = subCategory.items.find(
                (i) => i._id === action.meta.arg.itemId,
              );
              if (item) {
                item.available = action.payload.data?.available;
              }
            }
          }
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Item availability toggled";
        state.loading = false;
      })

      // ── Fetch All Menu Items ────────────────────────────────────────────────
      .addCase(fetchAllMenuItems.fulfilled, (state, action) => {
        state.menuItems = action.payload.data?.items || [];
      })

      // ── Create Order ────────────────────────────────────────────────────────
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data?.order || null;
        state.orderTracking = {
          ...action.payload.data?.order,
          trackingId: action.payload.data?.trackingId,
        };
        state.success = true;
        state.successMessage =
          action.payload.message || "Order placed successfully";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Track Order ─────────────────────────────────────────────────────────
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderTracking = action.payload.data?.order || null;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Orders By Phone ───────────────────────────────────────────────
      .addCase(fetchOrdersByPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data?.orders || [];
      })
      .addCase(fetchOrdersByPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch All Orders ────────────────────────────────────────────────────
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data?.orders || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Order By ID ───────────────────────────────────────────────────
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data?.order || null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update Order Status ─────────────────────────────────────────────────
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const orderId = action.meta.arg.orderId;
        const orderIndex = state.orders.findIndex((o) => o._id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.data?.order;
        }
        if (state.currentOrder?._id === orderId) {
          state.currentOrder = action.payload.data?.order;
        }
        if (state.orderTracking?._id === orderId) {
          state.orderTracking = action.payload.data?.order;
        }
        state.success = true;
        state.successMessage = action.payload.message || "Order status updated";
        state.loading = false;
      })

      // ── Update Payment Status ───────────────────────────────────────────────
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const orderId = action.meta.arg.orderId;
        const orderIndex = state.orders.findIndex((o) => o._id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.data?.order;
        }
        if (state.currentOrder?._id === orderId) {
          state.currentOrder = action.payload.data?.order;
        }
        if (state.orderTracking?._id === orderId) {
          state.orderTracking = action.payload.data?.order;
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Payment status updated";
        state.loading = false;
      });
  },
});

// ==================== Exports ====================

export const {
  clearMenuError,
  clearMenuSuccess,
  clearCurrentMenu,
  clearCurrentOrder,
  clearOrderTracking,
  resetMenuState,
} = menuSlice.actions;

export default menuSlice.reducer;
