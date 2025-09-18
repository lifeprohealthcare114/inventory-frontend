import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "../api/api";

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

const LOW_STOCK_THRESHOLD = 5;

const DataProvider = ({ children }) => {
  // ------------------ Base States ------------------
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------ Pagination ------------------
  const [warehousesPage, setWarehousesPage] = useState(0);
  const [warehousesTotalPages, setWarehousesTotalPages] = useState(0);
  const [warehousesSearch, setWarehousesSearch] = useState("");

  const [suppliersPage, setSuppliersPage] = useState(0);
  const [suppliersTotalPages, setSuppliersTotalPages] = useState(0);
  const [suppliersSearch, setSuppliersSearch] = useState("");

  // ------------------ Dashboard Aggregates ------------------
  const [totalItems, setTotalItems] = useState(0);
  const [totalStockMovements, setTotalStockMovements] = useState(0);
  const [inventoryByCategory, setInventoryByCategory] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  // ------------------ Helpers ------------------
  const handleError = (err) => {
    console.error(err);
    setError(err?.response?.data?.message || err.message || "Unknown error");
  };
  const clearError = () => setError(null);

  const normalizeList = (res) => res?.data?.content ?? res?.data ?? [];
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

  const enrichCategories = useCallback(
    (categoriesList, itemsList) =>
      categoriesList.map((c) => {
        const relatedItems = itemsList.filter((i) => i.categoryId === c.id);
        const itemsCount = relatedItems.length;
        const lowStock = relatedItems.filter((i) => getQty(i) < LOW_STOCK_THRESHOLD).length;
        const totalValue = relatedItems.reduce((sum, i) => sum + getQty(i) * getPrice(i), 0);
        return { ...c, itemsCount, lowStock, totalValue };
      }),
    []
  );

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

  // ------------------ Fetchers ------------------
  const fetchCategoriesData = useCallback(() => safeFetch(api.fetchCategories, setCategories), [safeFetch]);

  const fetchSuppliersData = useCallback(async () => {
    try {
      const res = await api.fetchSuppliersPaginated({
        page: suppliersPage,
        size: 10,
        search: suppliersSearch,
        sortField: "name",
        sortDir: "asc",
      });
      const list = normalizeList(res);
      setSuppliers(list);
      setSuppliersTotalPages(res.data.totalPages || 0);
      return list;
    } catch (err) {
      handleError(err);
      setSuppliers([]);
      setSuppliersTotalPages(0);
      return [];
    }
  }, [suppliersPage, suppliersSearch]);

  const fetchItemsData = useCallback(async () => {
    try {
      const res = await api.fetchItems();
      const list = normalizeList(res).map((i) => ({ ...i, lastPurchasePrice: i.lastPurchasePrice ?? null }));
      setItems(list);
      return list;
    } catch (err) {
      handleError(err);
      setItems([]);
      return [];
    }
  }, []);

  const fetchWarehousesData = useCallback(async () => {
    try {
      const res = await api.fetchWarehousesPaginated({
        page: warehousesPage,
        size: 10,
        search: warehousesSearch,
        sortField: "name",
        sortDir: "asc",
      });
      const list = normalizeList(res);
      setWarehouses(list);
      setWarehousesTotalPages(res.data.totalPages || 0);
      return list;
    } catch (err) {
      handleError(err);
      setWarehouses([]);
      setWarehousesTotalPages(0);
      return [];
    }
  }, [warehousesPage, warehousesSearch]);

  const fetchPurchaseOrdersData = useCallback(() => safeFetch(api.fetchPurchaseOrders, setPurchaseOrders), [safeFetch]);
  const fetchStockMovementsData = useCallback(() => safeFetch(api.fetchStockMovements, setStockMovements), [safeFetch]);

  // ------------------ Dashboard Aggregates Computation ------------------
  const computeDashboardAggregates = useCallback((categoriesList, itemsList, stockList) => {
    setTotalItems(itemsList.length);
    setTotalStockMovements(stockList.length);

    const invByCategory = categoriesList.map((c) => {
      const relatedItems = itemsList.filter((i) => i.categoryId === c.id);
      const totalValue = relatedItems.reduce((sum, i) => sum + getQty(i) * getPrice(i), 0);
      return { name: c.name, value: totalValue };
    });
    setInventoryByCategory(invByCategory);

    const categoryDist = categoriesList.map((c) => {
      const relatedItemsCount = itemsList.filter((i) => i.categoryId === c.id).length;
      return { name: c.name, count: relatedItemsCount };
    });
    setCategoryDistribution(categoryDist);
  }, []);

  // ------------------ Fetch All ------------------
  const fetchAll = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const results = await Promise.allSettled([
        fetchCategoriesData(),
        fetchSuppliersData(),
        fetchItemsData(),
        fetchWarehousesData(),
        fetchPurchaseOrdersData(),
        fetchStockMovementsData(),
      ]);

      const fulfilledResults = results.map((r) => (r.status === "fulfilled" ? r.value : []));
      const catRes = fulfilledResults[0];
      const itemRes = fulfilledResults[2];
      const whRes = fulfilledResults[3];
      const stockRes = fulfilledResults[5];

      setItems(itemRes);
      setCategories(enrichCategories(catRes, itemRes));
      setWarehouses(whRes);

      // Compute dashboard aggregates
      computeDashboardAggregates(catRes, itemRes, stockRes);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [
    fetchCategoriesData,
    fetchSuppliersData,
    fetchItemsData,
    fetchWarehousesData,
    fetchPurchaseOrdersData,
    fetchStockMovementsData,
    enrichCategories,
    computeDashboardAggregates,
  ]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const reload = fetchAll;

  // ------------------ CRUD Helpers ------------------
  const createEntity = (setter, apiFn) => async (data) =>
    wrap(async () => {
      const tempId = `temp-${Date.now()}`;
      setter((prev) => [...prev, { ...data, id: tempId }]);
      const res = await apiFn(data);
      const saved = res?.data ?? res;
      setter((prev) => prev.map((x) => (x.id === tempId ? saved : x)));
      await fetchAll();
      return saved;
    });

  const updateEntity = (list, setter, apiFn) => async (id, data) =>
    wrap(async () => {
      const snap = snapshot(list);
      setter((prev) => prev.map((x) => (x.id === id ? { ...x, ...data } : x)));
      try {
        const res = await apiFn(id, data);
        const saved = res?.data ?? res;
        setter((prev) => prev.map((x) => (x.id === id ? saved : x)));
        await fetchAll();
        return saved;
      } catch (err) {
        setter(snap);
        throw err;
      }
    });

  const removeEntity = (list, setter, apiFn) => async (id) =>
    wrap(async () => {
      const snap = snapshot(list);
      setter((prev) => prev.filter((x) => x.id !== id));
      try {
        const res = await apiFn(id);
        await fetchAll();
        return res?.data ?? true;
      } catch (err) {
        setter(snap);
        throw err;
      }
    });

  // ------------------ Exposed Methods ------------------
  return (
    <DataContext.Provider
      value={{
        loading,
        error,
        clearError,
        reload,

        categories,
        addCategory: createEntity(setCategories, api.createCategory),
        editCategory: updateEntity(categories, setCategories, api.updateCategory),
        removeCategory: removeEntity(categories, setCategories, api.deleteCategory),

        suppliers,
        suppliersPage,
        setSuppliersPage,
        suppliersTotalPages,
        suppliersSearch,
        setSuppliersSearch,
        addSupplier: createEntity(setSuppliers, api.createSupplier),
        editSupplier: updateEntity(suppliers, setSuppliers, api.updateSupplier),
        removeSupplier: removeEntity(suppliers, setSuppliers, api.deleteSupplier),
        fetchSuppliers: fetchSuppliersData,

        items,
        addItem: createEntity(setItems, api.createItem),
        editItem: updateEntity(items, setItems, api.updateItem),
        removeItem: removeEntity(items, setItems, api.deleteItem),

        warehouses,
        warehousesPage,
        setWarehousesPage,
        warehousesTotalPages,
        warehousesSearch,
        setWarehousesSearch,
        addWarehouse: createEntity(setWarehouses, api.createWarehouse),
        editWarehouse: updateEntity(warehouses, setWarehouses, api.updateWarehouse),
        removeWarehouse: removeEntity(warehouses, setWarehouses, api.deleteWarehouse),

        purchaseOrders,
        addPurchaseOrder: createEntity(setPurchaseOrders, api.createPurchaseOrder),
        editPurchaseOrder: updateEntity(purchaseOrders, setPurchaseOrders, api.updatePurchaseOrder),
        removePurchaseOrder: removeEntity(purchaseOrders, setPurchaseOrders, api.deletePurchaseOrder),

        stock: stockMovements,
        stockMovements,
        addStockMovement: createEntity(setStockMovements, api.createStockMovement),
        editStockMovement: updateEntity(stockMovements, setStockMovements, api.updateStockMovement),
        removeStockMovement: removeEntity(stockMovements, setStockMovements, api.deleteStockMovement),

        // Dashboard aggregates
        totalItems,
        totalStockMovements,
        inventoryByCategory,
        categoryDistribution,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
