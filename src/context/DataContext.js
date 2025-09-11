import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/api";

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [stockMovements, setStockMovements] = useState([]); // real state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Helpers ----------
  const handleError = (err) => {
    console.error(err);
    setError(err?.response?.data?.message || err.message || "Unknown error");
  };

  const clearError = () => setError(null);

  const normalizeList = (res) =>
    res?.data?.content ? res.data.content : res?.data || [];

  const snapshot = (data) => JSON.parse(JSON.stringify(data));

  const wrap = async (fn) => {
    try {
      clearError();
      const data = await fn();
      return { success: true, data };
    } catch (err) {
      handleError(err);
      return { success: false, error: err };
    }
  };

  // ---------- Fetchers ----------
  const fetchCategories = async () =>
    wrap(async () => {
      const res = await api.fetchCategories();
      setCategories(normalizeList(res));
      return res.data;
    });

  const fetchSuppliers = async () =>
    wrap(async () => {
      const res = await api.fetchSuppliers();
      setSuppliers(normalizeList(res));
      return res.data;
    });

  const fetchItems = async () =>
    wrap(async () => {
      const res = await api.fetchItems();
      setItems(normalizeList(res));
      return res.data;
    });

  const fetchWarehouses = async () =>
    wrap(async () => {
      const res = await api.fetchWarehouses();
      setWarehouses(normalizeList(res));
      return res.data;
    });

  const fetchPurchaseOrders = async () =>
    wrap(async () => {
      const res = await api.fetchPurchaseOrders();
      setPurchaseOrders(normalizeList(res));
      return res.data;
    });

  const fetchStockMovements = async () =>
    wrap(async () => {
      const res = await api.fetchStockMovements();
      setStockMovements(normalizeList(res));
      return res.data;
    });

  const fetchAll = async () => {
    setLoading(true);
    clearError();
    await Promise.all([
      fetchCategories(),
      fetchSuppliers(),
      fetchItems(),
      fetchWarehouses(),
      fetchPurchaseOrders(),
      fetchStockMovements(),
    ]);
    setLoading(false);
  };

  const reload = fetchAll;

  useEffect(() => {
    fetchAll();
  }, []);

  // ---------- CRUD with Optimistic Updates ----------
  // Categories
  const addCategory = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId };
      setCategories((prev) => [...prev, optimistic]);

      const res = await api.createCategory(data);
      setCategories((prev) =>
        prev.map((c) => (c.id === tempId ? res.data : c))
      );
      return res.data;
    });

  const editCategory = (id, data) =>
    wrap(async () => {
      const snap = snapshot(categories);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );

      try {
        const res = await api.updateCategory(id, data);
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? res.data : c))
        );
        return res.data;
      } catch (err) {
        setCategories(snap);
        throw err;
      }
    });

  const removeCategory = (id) =>
    wrap(async () => {
      const snap = snapshot(categories);
      setCategories((prev) => prev.filter((c) => c.id !== id));

      try {
        await api.deleteCategory(id);
        return true;
      } catch (err) {
        setCategories(snap);
        throw err;
      }
    });

  // Suppliers
  const addSupplier = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId };
      setSuppliers((prev) => [...prev, optimistic]);

      const res = await api.createSupplier(data);
      setSuppliers((prev) =>
        prev.map((s) => (s.id === tempId ? res.data : s))
      );
      return res.data;
    });

  const editSupplier = (id, data) =>
    wrap(async () => {
      const snap = snapshot(suppliers);
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );

      try {
        const res = await api.updateSupplier(id, data);
        setSuppliers((prev) =>
          prev.map((s) => (s.id === id ? res.data : s))
        );
        return res.data;
      } catch (err) {
        setSuppliers(snap);
        throw err;
      }
    });

  const removeSupplier = (id) =>
    wrap(async () => {
      const snap = snapshot(suppliers);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));

      try {
        await api.deleteSupplier(id);
        return true;
      } catch (err) {
        setSuppliers(snap);
        throw err;
      }
    });

  // Items
  const addItem = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId };
      setItems((prev) => [...prev, optimistic]);

      const res = await api.createItem(data);
      setItems((prev) =>
        prev.map((i) => (i.id === tempId ? res.data : i))
      );
      return res.data;
    });

  const editItem = (id, data) =>
    wrap(async () => {
      const snap = snapshot(items);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data } : i))
      );

      try {
        const res = await api.updateItem(id, data);
        setItems((prev) =>
          prev.map((i) => (i.id === id ? res.data : i))
        );
        return res.data;
      } catch (err) {
        setItems(snap);
        throw err;
      }
    });

  const removeItem = (id) =>
    wrap(async () => {
      const snap = snapshot(items);
      setItems((prev) => prev.filter((i) => i.id !== id));

      try {
        await api.deleteItem(id);
        return true;
      } catch (err) {
        setItems(snap);
        throw err;
      }
    });

  // Warehouses
  const addWarehouse = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId };
      setWarehouses((prev) => [...prev, optimistic]);

      const res = await api.createWarehouse(data);
      setWarehouses((prev) =>
        prev.map((w) => (w.id === tempId ? res.data : w))
      );
      return res.data;
    });

  const editWarehouse = (id, data) =>
    wrap(async () => {
      const snap = snapshot(warehouses);
      setWarehouses((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...data } : w))
      );

      try {
        const res = await api.updateWarehouse(id, data);
        setWarehouses((prev) =>
          prev.map((w) => (w.id === id ? res.data : w))
        );
        return res.data;
      } catch (err) {
        setWarehouses(snap);
        throw err;
      }
    });

  const removeWarehouse = (id) =>
    wrap(async () => {
      const snap = snapshot(warehouses);
      setWarehouses((prev) => prev.filter((w) => w.id !== id));

      try {
        await api.deleteWarehouse(id);
        return true;
      } catch (err) {
        setWarehouses(snap);
        throw err;
      }
    });

  // Purchase Orders
  const addPurchaseOrder = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId };
      setPurchaseOrders((prev) => [...prev, optimistic]);

      const res = await api.createPurchaseOrder(data);
      setPurchaseOrders((prev) =>
        prev.map((p) => (p.id === tempId ? res.data : p))
      );
      return res.data;
    });

  const editPurchaseOrder = (id, data) =>
    wrap(async () => {
      const snap = snapshot(purchaseOrders);
      setPurchaseOrders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );

      try {
        const res = await api.updatePurchaseOrder(id, data);
        setPurchaseOrders((prev) =>
          prev.map((p) => (p.id === id ? res.data : p))
        );
        return res.data;
      } catch (err) {
        setPurchaseOrders(snap);
        throw err;
      }
    });

  const removePurchaseOrder = (id) =>
    wrap(async () => {
      const snap = snapshot(purchaseOrders);
      setPurchaseOrders((prev) => prev.filter((p) => p.id !== id));

      try {
        await api.deletePurchaseOrder(id);
        return true;
      } catch (err) {
        setPurchaseOrders(snap);
        throw err;
      }
    });

  // Stock Movements
  const addStockMovement = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...data, id: tempId };
      setStockMovements((prev) => [...prev, optimistic]);

      const res = await api.createStockMovement(data);
      setStockMovements((prev) =>
        prev.map((s) => (s.id === tempId ? res.data : s))
      );
      return res.data;
    });

  const editStockMovement = (id, data) =>
    wrap(async () => {
      const snap = snapshot(stockMovements);
      setStockMovements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );

      try {
        const res = await api.updateStockMovement(id, data);
        setStockMovements((prev) =>
          prev.map((s) => (s.id === id ? res.data : s))
        );
        return res.data;
      } catch (err) {
        setStockMovements(snap);
        throw err;
      }
    });

  const removeStockMovement = (id) =>
    wrap(async () => {
      const snap = snapshot(stockMovements);
      setStockMovements((prev) => prev.filter((s) => s.id !== id));

      try {
        await api.deleteStockMovement(id);
        return true;
      } catch (err) {
        setStockMovements(snap);
        throw err;
      }
    });

  return (
    <DataContext.Provider
      value={{
        loading,
        error,
        clearError,
        reload,

        categories,
        addCategory,
        editCategory,
        removeCategory,

        suppliers,
        addSupplier,
        editSupplier,
        removeSupplier,

        items,
        addItem,
        editItem,
        removeItem,

        warehouses,
        addWarehouse,
        editWarehouse,
        removeWarehouse,

        purchaseOrders,
        addPurchaseOrder,
        editPurchaseOrder,
        removePurchaseOrder,

        stock: stockMovements, // alias for dashboard compatibility
        stockMovements,
        addStockMovement,
        editStockMovement,
        removeStockMovement,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
