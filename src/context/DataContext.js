// src/context/DataContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as api from "../api/api";

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

// ---------- Settings ----------
const LOW_STOCK_THRESHOLD = 5;

const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
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

  const getQty = (i) => i?.stock ?? i?.quantity ?? i?.qty ?? 0;
  const getPrice = (i) => i?.price ?? i?.cost ?? 0;

  // ---------- Enrichers ----------
  const enrichCategories = useCallback(
    (categoriesList, itemsList) =>
      categoriesList.map((c) => {
        const relatedItems = itemsList.filter((i) => i.categoryId === c.id);
        const itemsCount = relatedItems.length;
        const lowStock = relatedItems.filter(
          (i) => getQty(i) < LOW_STOCK_THRESHOLD
        ).length;
        const totalValue = relatedItems.reduce(
          (sum, i) => sum + getQty(i) * getPrice(i),
          0
        );
        return { ...c, itemsCount, lowStock, totalValue };
      }),
    []
  );

  const enrichWarehouses = useCallback(
    (warehousesList, itemsList) =>
      warehousesList.map((w) => {
        const relatedItems = itemsList.filter((i) => i.warehouseId === w.id);
        const itemsCount = relatedItems.length;
        const value = relatedItems.reduce(
          (sum, i) => sum + getQty(i) * getPrice(i),
          0
        );
        const associatedItems = relatedItems
          .map((i) => i.name || i.itemName || i.code || "")
          .filter(Boolean)
          .join(", ");
        return { ...w, itemsCount, value, associatedItems };
      }),
    []
  );

  // ---------- Safe Fetch ----------
  const safeFetch = useCallback(async (fetchFn, setter) => {
    try {
      const res = await fetchFn();
      const list = normalizeList(res);
      setter(list);
      return list;
    } catch (err) {
      handleError(err);
      setter([]);
      return [];
    }
  }, []);

  // ---------- Fetchers ----------
  const fetchCategories = useCallback(
    () => safeFetch(api.fetchCategories, setCategories),
    [safeFetch]
  );

  const fetchSuppliers = useCallback(
    () => safeFetch(api.fetchSuppliers, setSuppliers),
    [safeFetch]
  );

  // ✅ Updated: ensure lastPurchasePrice is always available
  const fetchItems = useCallback(async () => {
    try {
      const res = await api.fetchItems();
      const list = normalizeList(res).map((i) => ({
        ...i,
        lastPurchasePrice: i.lastPurchasePrice ?? null,
      }));
      setItems(list);
      return list;
    } catch (err) {
      handleError(err);
      setItems([]);
      return [];
    }
  }, []);

  const fetchWarehouses = useCallback(
    () => safeFetch(api.fetchWarehouses, setWarehouses),
    [safeFetch]
  );

  const fetchPurchaseOrders = useCallback(
    () => safeFetch(api.fetchPurchaseOrders, setPurchaseOrders),
    [safeFetch]
  );

  const fetchStockMovements = useCallback(
    () => safeFetch(api.fetchStockMovements, setStockMovements),
    [safeFetch]
  );

  // ---------- Fetch All ----------
  const fetchAll = useCallback(
    async () => {
      setLoading(true);
      clearError();

      try {
        const results = await Promise.allSettled([
          fetchCategories(),
          fetchSuppliers(),
          fetchItems(),
          fetchWarehouses(),
          fetchPurchaseOrders(),
          fetchStockMovements(),
        ]);

        const [catRes, supRes, itemRes, whRes, poRes, stockRes] = results.map(
          (r) => (r.status === "fulfilled" ? r.value : [])
        );

        setItems(itemRes);
        setCategories(enrichCategories(catRes, itemRes));
        setWarehouses(enrichWarehouses(whRes, itemRes));

        setLoading(false);
        return { catRes, supRes, itemRes, whRes, poRes, stockRes };
      } catch (err) {
        handleError(err);
        setLoading(false);
        return {};
      }
    },
    [
      fetchCategories,
      fetchSuppliers,
      fetchItems,
      fetchWarehouses,
      fetchPurchaseOrders,
      fetchStockMovements,
      enrichCategories,
      enrichWarehouses,
    ]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const reload = fetchAll;

  // ---------- CRUD Helpers ----------
  // Categories
  const addCategory = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      setCategories((prev) => [...prev, { ...data, id: tempId }]);
      const res = await api.createCategory(data);
      const saved = res?.data ?? res;
      setCategories((prev) =>
        prev.map((c) => (c.id === tempId ? saved : c))
      );
      await fetchAll();
      return saved;
    });

  const editCategory = (id, data) =>
    wrap(async () => {
      const snap = snapshot(categories);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      try {
        const res = await api.updateCategory(id, data);
        const saved = res?.data ?? res;
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? saved : c))
        );
        await fetchAll();
        return saved;
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
        const res = await api.deleteCategory(id);
        await fetchAll();
        return res?.data ?? true;
      } catch (err) {
        setCategories(snap);
        throw err;
      }
    });

  // Suppliers
  const addSupplier = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      setSuppliers((prev) => [...prev, { ...data, id: tempId }]);
      const res = await api.createSupplier(data);
      const saved = res?.data ?? res;
      setSuppliers((prev) =>
        prev.map((s) => (s.id === tempId ? saved : s))
      );
      return saved;
    });

  const editSupplier = (id, data) =>
    wrap(async () => {
      const snap = snapshot(suppliers);
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
      try {
        const res = await api.updateSupplier(id, data);
        const saved = res?.data ?? res;
        setSuppliers((prev) =>
          prev.map((s) => (s.id === id ? saved : s))
        );
        return saved;
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
        const res = await api.deleteSupplier(id);
        return res?.data ?? true;
      } catch (err) {
        setSuppliers(snap);
        throw err;
      }
    });

  // Items
  const addItem = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      setItems((prev) => [...prev, { ...data, id: tempId }]);
      const res = await api.createItem(data);
      const savedItem = res?.data ?? res;
      setItems((prev) =>
        prev.map((i) => (i.id === tempId ? savedItem : i))
      );
      await fetchAll();
      return savedItem;
    });

  const editItem = (id, data) =>
    wrap(async () => {
      const snap = snapshot(items);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data } : i))
      );
      try {
        const res = await api.updateItem(id, data);
        const saved = res?.data ?? res;
        setItems((prev) =>
          prev.map((i) => (i.id === id ? saved : i))
        );
        await fetchAll();
        return saved;
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
        const res = await api.deleteItem(id);
        await fetchAll();
        return res?.data ?? true;
      } catch (err) {
        setItems(snap);
        throw err;
      }
    });

  // Warehouses
  const addWarehouse = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      setWarehouses((prev) => [...prev, { ...data, id: tempId }]);
      const res = await api.createWarehouse(data);
      const saved = res?.data ?? res;
      setWarehouses((prev) =>
        prev.map((w) => (w.id === tempId ? saved : w))
      );
      await fetchAll();
      return saved;
    });

  const editWarehouse = (id, data) =>
    wrap(async () => {
      const snap = snapshot(warehouses);
      setWarehouses((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...data } : w))
      );
      try {
        const res = await api.updateWarehouse(id, data);
        const saved = res?.data ?? res;
        setWarehouses((prev) =>
          prev.map((w) => (w.id === id ? saved : w))
        );
        await fetchAll();
        return saved;
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
        const res = await api.deleteWarehouse(id);
        await fetchAll();
        return res?.data ?? true;
      } catch (err) {
        setWarehouses(snap);
        throw err;
      }
    });

  // Stock Movements
  const addStockMovement = (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      setStockMovements((prev) => [...prev, { ...data, id: tempId }]);
      const res = await api.createStockMovement(data);
      const saved = res?.data ?? res;
      setStockMovements((prev) =>
        prev.map((s) => (s.id === tempId ? saved : s))
      );
      await fetchAll();
      return saved;
    });

  const editStockMovement = (id, data) =>
    wrap(async () => {
      const snap = snapshot(stockMovements);
      setStockMovements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
      try {
        const res = await api.updateStockMovement(id, data);
        const saved = res?.data ?? res;
        setStockMovements((prev) =>
          prev.map((s) => (s.id === id ? saved : s))
        );
        await fetchAll();
        return saved;
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
        const res = await api.deleteStockMovement(id);
        await fetchAll();
        return res?.data ?? true;
      } catch (err) {
        setStockMovements(snap);
        throw err;
      }
    });

  // Purchase Orders
  const normalizePO = (po) => ({
    ...po,
    supplierId: po.supplier?.id || po.supplierId || null,
    supplierName: po.supplier?.name || po.supplierName || null,
    itemId: po.item?.id || po.itemId || null,
    itemName: po.item?.name || po.itemName || null,
    totalAmount: (po.quantity || 0) * (po.price || 0),
  });

  const addPurchaseOrder = (data) =>
    wrap(async () => {
      const payload = normalizePO(data);
      const res = await api.createPurchaseOrder(payload);
      const saved = res?.data ?? res;
      await fetchAll();
      return saved;
    });

  const editPurchaseOrder = (id, data) =>
    wrap(async () => {
      const payload = normalizePO(data);
      const res = await api.updatePurchaseOrder(id, payload);
      const saved = res?.data ?? res;
      await fetchAll();
      return saved;
    });

  const removePurchaseOrder = (id) =>
    wrap(async () => {
      const snap = snapshot(purchaseOrders);
      setPurchaseOrders((prev) => prev.filter((p) => p.id !== id));
      try {
        const res = await api.deletePurchaseOrder(id);
        await fetchAll();
        return res?.data ?? true;
      } catch (err) {
        setPurchaseOrders(snap);
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

        stock: stockMovements,
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
