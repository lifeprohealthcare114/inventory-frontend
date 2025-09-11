import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// Utility to strip temp/accidental id before POST
const stripId = (data) => {
  const { id, ...rest } = data;
  return rest;
};

// Categories
export const fetchCategories = () => axios.get(`${API_BASE}/categories`);
export const createCategory = (data) =>
  axios.post(`${API_BASE}/categories`, stripId(data));
export const updateCategory = (id, data) =>
  axios.put(`${API_BASE}/categories/${id}`, data);
export const deleteCategory = (id) =>
  axios.delete(`${API_BASE}/categories/${id}`);

// Items
export const fetchItems = () => axios.get(`${API_BASE}/items`);
export const createItem = (data) =>
  axios.post(`${API_BASE}/items`, stripId(data));
export const updateItem = (id, data) =>
  axios.put(`${API_BASE}/items/${id}`, data);
export const deleteItem = (id) =>
  axios.delete(`${API_BASE}/items/${id}`);

// Suppliers
export const fetchSuppliers = () => axios.get(`${API_BASE}/suppliers`);
export const createSupplier = (data) =>
  axios.post(`${API_BASE}/suppliers`, stripId(data));
export const updateSupplier = (id, data) =>
  axios.put(`${API_BASE}/suppliers/${id}`, data);
export const deleteSupplier = (id) =>
  axios.delete(`${API_BASE}/suppliers/${id}`);

// Warehouses
export const fetchWarehouses = () => axios.get(`${API_BASE}/warehouses`);
export const createWarehouse = (data) =>
  axios.post(`${API_BASE}/warehouses`, stripId(data));
export const updateWarehouse = (id, data) =>
  axios.put(`${API_BASE}/warehouses/${id}`, data);
export const deleteWarehouse = (id) =>
  axios.delete(`${API_BASE}/warehouses/${id}`);

// Purchase Orders
export const fetchPurchaseOrders = () =>
  axios.get(`${API_BASE}/purchase-orders`);
export const createPurchaseOrder = (data) =>
  axios.post(`${API_BASE}/purchase-orders`, stripId(data));
export const updatePurchaseOrder = (id, data) =>
  axios.put(`${API_BASE}/purchase-orders/${id}`, data);
export const deletePurchaseOrder = (id) =>
  axios.delete(`${API_BASE}/purchase-orders/${id}`);

// Stock
// Stock Movements
export const fetchStockMovements = (params) =>
  axios.get(`${API_BASE}/stock-movements`, { params });

export const getStockMovementById = (id) =>
  axios.get(`${API_BASE}/stock-movements/${id}`);

export const createStockMovement = (data) =>
  axios.post(`${API_BASE}/stock-movements`, data);

export const updateStockMovement = (id, data) =>
  axios.put(`${API_BASE}/stock-movements/${id}`, data);

export const deleteStockMovement = (id) =>
  axios.delete(`${API_BASE}/stock-movements/${id}`);

export const fetchStockLevels = () =>
  axios.get(`${API_BASE}/stock-movements/stock-levels`);

export const fetchStockLevelsList = () =>
  axios.get(`${API_BASE}/stock-movements/stock-levels/list`);

