export interface PurchaseOrderData {
  orderNumber: string;
  orderDate: string;
  vendor: string;
  shipTo: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface UploadResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
  downloadUrl?: string;
}

export interface ErrorResponse {
  message: string;
  error: string;
  status: number;
} 