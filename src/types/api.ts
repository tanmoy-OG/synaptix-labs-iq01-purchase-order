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

export interface ErrorResponse {
  message: string;
  error: string;
  status: number;
}

export interface ExtractedPdfData {
  header: Record<string, string>;
  item: Record<string, string>;
}

// export interface ExtractedPdfData {
//   id: string;
//   status: 'processing' | 'completed' | 'failed';
//   message: string;
//   downloadUrl?: string;
//   extractedData?: ExtractedPdfData;
// }

export interface SelectedData {
  headerData: Record<string, string>;
  itemData: Record<string, string>;
}

export interface FieldConfig {
  fieldname: string;
  label: string;
  logic: "0" | "1" | "2";
  prompt: string;
  selected: boolean;
}

export interface FieldConfigurationData {
  header: Record<string, FieldConfig>;
  item: Record<string, FieldConfig>;
}

export interface ConfigurePdfResponse {
  extractedData: ExtractedPdfData;
  fieldConfig: FieldConfigurationData;
} 