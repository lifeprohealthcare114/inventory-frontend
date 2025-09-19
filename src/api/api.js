import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// ---------------------- Axios Instance ----------------------
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s timeout
});

// ---------------------- Interceptors ----------------------

// Request interceptor (optional: add auth headers here)
api.interceptors.request.use(
  config => {
    // Example: attach token
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    // Optional: show toast/alert globally
    return Promise.reject(error);
  }
);

// ---------------------- Utility ----------------------
const stripId = data => {
  const { id, ...rest } = data;
  return rest;
};

// ---------------------- Categories ----------------------
export const fetchCategories = () => api.get("/categories");
export const createCategory = data => api.post("/categories", stripId(data));
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = id => api.delete(`/categories/${id}`);

// ---------------------- Items ----------------------
export const fetchItems = () => api.get("/items");
export const createItem = data => api.post("/items", stripId(data));
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = id => api.delete(`/items/${id}`);

// ---------------------- Suppliers ----------------------
export const fetchSuppliers = () => api.get("/suppliers");
export const createSupplier = data => api.post("/suppliers", stripId(data));
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = id => api.delete(`/suppliers/${id}`);

// ---------------------- Warehouses ----------------------
export const fetchWarehouses = () => api.get("/warehouses");
export const createWarehouse = data => api.post("/warehouses", stripId(data));
export const updateWarehouse = (id, data) => api.put(`/warehouses/${id}`, data);
export const deleteWarehouse = id => api.delete(`/warehouses/${id}`);

// ---------------------- Purchase Orders ----------------------
export const fetchPurchaseOrders = () => api.get("/purchase-orders");
export const createPurchaseOrder = data => api.post("/purchase-orders", stripId(data));
export const updatePurchaseOrder = (id, data) => api.put(`/purchase-orders/${id}`, data);
export const deletePurchaseOrder = id => api.delete(`/purchase-orders/${id}`);

// ---------------------- Stock Movements ----------------------
export const fetchStockMovements = params => api.get("/stock-movements", { params });
export const getStockMovementById = id => api.get(`/stock-movements/${id}`);
export const createStockMovement = data => api.post("/stock-movements", stripId(data));
export const updateStockMovement = (id, data) => api.put(`/stock-movements/${id}`, data);
export const deleteStockMovement = id => api.delete(`/stock-movements/${id}`);
export const fetchStockLevels = () => api.get("/stock-movements/stock-levels");
export const fetchStockLevelsList = () => api.get("/stock-movements/stock-levels/list");

// ---------------------- Stock Adjustments ----------------------
export const fetchStockAdjustments = () => api.get("/stock-adjustments");
export const createStockAdjustment = data => api.post("/stock-adjustments", stripId(data));
export const updateStockAdjustment = (id, data) => api.put(`/stock-adjustments/${id}`, data);
export const deleteStockAdjustment = id => api.delete(`/stock-adjustments/${id}`);
export const approveStockAdjustment = id => api.post(`/stock-adjustments/${id}/approve`);
export const rejectStockAdjustment = id => api.post(`/stock-adjustments/${id}/reject`);

// ---------------------- Alerts / Reorder ----------------------
export const fetchLowStockItems = () => api.get("/alerts/low-stock");
export const createReorderDraftPO = data => api.post("/alerts/reorder", stripId(data));

// ---------------------- Issues ----------------------
// ---------------------- Issues (Paginated) ----------------------
export const fetchIssues = ({
  page = 0,
  size = 10,
  search = "",
  status = "",
} = {}) =>
  api.get("/issues", {
    params: {
      page,
      size,
      search: search || undefined,
      status: status || undefined,
    },
  });

export const createIssue = (data) => api.post("/issues", stripId(data));
export const markIssueReturned = (id) => api.post(`/issues/${id}/return`);

// ---------------------- Consumption ----------------------
export const fetchConsumptions = () => api.get("/consumptions");
export const createConsumption = data => api.post("/consumptions", stripId(data));
// ---------------------- Items (Paginated) ----------------------
export const fetchItemsPaginated = ({ page = 0, size = 10, search = "", sortField = "name", sortDir = "asc" }) =>
  api.get("/items/paginated", {
    params: { page, size, search, sortField, sortDir },
  });

// ---------------------- Warehouses (Paginated) ----------------------
export const fetchWarehousesPaginated = ({ page = 0, size = 10, search = "", sortField = "name", sortDir = "asc" }) =>
  api.get("/warehouses/paginated", {
    params: { page, size, search, sortField, sortDir },
  });
// ---------------------- Categories (Paginated) ----------------------
export const fetchCategoriesPaginated = ({
  page = 0,
  size = 10,
  search = "",
  sortField = "name",
  sortDir = "asc",
}) =>
  api.get("/categories/paginated", {
    params: { page, size, search, sortField, sortDir },
  });
// ---------------------- Suppliers (Paginated) ----------------------
export const fetchSuppliersPaginated = ({
  page = 0,
  size = 10,
  search = "",
  sortField = "name",
  sortDir = "asc",
}) =>
  api.get("/suppliers/paginated", {
    params: { page, size, search, sortField, sortDir },
  });
// ---------------------- Purchase Orders (Paginated) ----------------------
export const fetchPurchaseOrdersPaginated = ({
  page = 0,
  size = 10,
  search = "",
  sortField = "poNumber",
  sortDir = "asc",
}) =>
  api.get("/purchase-orders/paginated", {
    params: { page, size, search, sortField, sortDir },
  });
// ---------------------- Stock Movements (Paginated) ----------------------
export const fetchStockMovementsPaginated = ({
  page = 0,
  size = 10,
  itemId = '',
  type = '',
  from = '',
  to = '',
  sortField = 'date',
  sortDir = 'desc',
}) =>
  api.get("/stock-movements/paginated", {
    params: { page, size, itemId, type, from, to, sortField, sortDir },
  });

// ---------------------- Items per Warehouse (Paginated) ----------------------
export const fetchItemsForWarehousePaginated = (
  warehouseId,
  { page = 0, size = 10, search = "", sortField = "name", sortDir = "asc" } = {}
) =>
  api.get(`/items/warehouse/${warehouseId}`, {
    params: { page, size, search, sortField, sortDir },
  });


// ---------------------- Export Axios instance (optional) ----------------------
export default api;
