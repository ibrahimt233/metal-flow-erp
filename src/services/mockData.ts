
import { PurchaseOrder, Product, ProductionOrder, SalesOrder } from "@/types";

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    supplierName: "SteelWorks Inc.",
    date: "2025-03-15",
    productName: "Steel Sheets",
    unitCost: 45.5,
    totalCost: 910.0,
  },
  {
    id: 2,
    supplierName: "Metal Suppliers Co.",
    date: "2025-03-20",
    productName: "Aluminum Rods",
    unitCost: 23.75,
    totalCost: 475.0,
  },
  {
    id: 3,
    supplierName: "Industrial Metals",
    date: "2025-03-22",
    productName: "Copper Wiring",
    unitCost: 65.25,
    totalCost: 1305.0,
  },
  {
    id: 4,
    supplierName: "SteelWorks Inc.",
    date: "2025-03-25",
    productName: "Stainless Steel Sheets",
    unitCost: 72.0,
    totalCost: 2160.0,
  },
  {
    id: 5,
    supplierName: "Metal Fabricators",
    date: "2025-03-30",
    productName: "Titanium Plates",
    unitCost: 125.5,
    totalCost: 1255.0,
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Steel Sheet A36",
    material: "Steel",
    thickness: 2.5,
    length: 120.0,
    width: 60.0,
    links: "https://example.com/steel-sheet-a36,https://metals.com/a36-specs",
  },
  {
    id: 2,
    name: "Aluminum Rod 6061",
    material: "Aluminum",
    thickness: 1.5,
    length: 200.0,
    width: 1.5,
    links: "https://example.com/aluminum-rod-6061",
  },
  {
    id: 3,
    name: "Copper Wire 12 Gauge",
    material: "Copper",
    thickness: 0.8,
    length: 500.0,
    width: 0.8,
    links: "https://example.com/copper-wire-12-gauge",
  },
  {
    id: 4,
    name: "Stainless Steel Sheet 304",
    material: "Stainless Steel",
    thickness: 1.2,
    length: 100.0,
    width: 50.0,
    links: "https://example.com/stainless-steel-304,https://metals.com/304-specs",
  },
  {
    id: 5,
    name: "Titanium Plate Grade 5",
    material: "Titanium",
    thickness: 3.0,
    length: 50.0,
    width: 50.0,
    links: "https://example.com/titanium-grade-5",
  },
];

// Mock Production Orders
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 1,
    purchaseOrderId: 1,
    productId: 1,
    productName: "Steel Sheet A36",
    productionStart: "2025-03-16",
    productionEnd: "2025-03-18",
    completed: true,
  },
  {
    id: 2,
    purchaseOrderId: 2,
    productId: 2,
    productName: "Aluminum Rod 6061",
    productionStart: "2025-03-21",
    productionEnd: "2025-03-23",
    completed: true,
  },
  {
    id: 3,
    purchaseOrderId: 3,
    productId: 3,
    productName: "Copper Wire 12 Gauge",
    productionStart: "2025-03-23",
    productionEnd: "2025-03-25",
    completed: false,
  },
  {
    id: 4,
    purchaseOrderId: 4,
    productId: 4,
    productName: "Stainless Steel Sheet 304",
    productionStart: "2025-03-26",
    productionEnd: "2025-03-28",
    completed: false,
  },
  {
    id: 5,
    productId: 5,
    productName: "Titanium Plate Grade 5",
    productionStart: "2025-03-31",
    productionEnd: "2025-04-02",
    completed: false,
  },
];

// Mock Sales Orders
export const mockSalesOrders: SalesOrder[] = [
  {
    id: 1,
    clientName: "Construction Corp",
    date: "2025-03-19",
    productName: "Steel Sheet A36",
    quantity: 15,
    unitPrice: 55.0,
    totalPrice: 825.0,
  },
  {
    id: 2,
    clientName: "Engineering Solutions",
    date: "2025-03-24",
    productName: "Aluminum Rod 6061",
    quantity: 25,
    unitPrice: 30.0,
    totalPrice: 750.0,
  },
  {
    id: 3,
    clientName: "Electric Installations",
    date: "2025-03-26",
    productName: "Copper Wire 12 Gauge",
    quantity: 10,
    unitPrice: 75.0,
    totalPrice: 750.0,
  },
  {
    id: 4,
    clientName: "Kitchen Fixtures",
    date: "2025-03-29",
    productName: "Stainless Steel Sheet 304",
    quantity: 8,
    unitPrice: 90.0,
    totalPrice: 720.0,
  },
  {
    id: 5,
    clientName: "Aerospace Industries",
    date: "2025-04-03",
    productName: "Titanium Plate Grade 5",
    quantity: 5,
    unitPrice: 150.0,
    totalPrice: 750.0,
  },
];
