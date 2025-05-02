import { ExtractedPdfData } from "@/types/api";

export const mockExtractedData: ExtractedPdfData = {
  header: {
    "PO Number": "10013",
    "PO Date": "23.05.2020",
    "Vendor": "ABC Suppliers Ltd.",
    "Ship To": "Main Warehouse, 123 Business St.",
    "Payment Terms": "Net 30",
    "Delivery Date": "30.05.2020"
  },
  item: {
    "Item No.": "10",
    "Item Desc": "Jol er balti",
    "Qty": "100", 
    "Price": "50",
    "UOM": "EA",
    "Total": "5000"
  }
}; 