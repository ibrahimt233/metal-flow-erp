
// Purchase Order Type
export interface PurchaseOrder {
  id: number;
  supplierName: string;
  date: string;
  productName: string;
  unitCost: number;
  totalCost: number;
}

// Product Type
export interface Product {
  id: number;
  name: string;
  material: string;
  thickness: number;
  length: number;
  width: number;
  links: string;
}

// Production Order Type
export interface ProductionOrder {
  id: number;
  purchaseOrderId?: number;
  productId: number;
  productName: string;
  productionStart: string;
  productionEnd: string;
  completed: boolean;
}

// Sales Order Type
export interface SalesOrder {
  id: number;
  clientName: string;
  date: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
