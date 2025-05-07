import { ConfigurePdfResponse, ExtractedPdfData, FieldConfigurationData } from "@/types/api";

export const mockExtractedData: ExtractedPdfData = {
  header: {
    "Bestellnr": "10013",
    "Bedat": "23.05.2020",
    "Tel": "+49 123 456789",
    "Info": "Delivery expected by 30.05.2020",
    "Lieferant": "ABC Suppliers Ltd.",
    "Lieferadresse": "Main Warehouse, 123 Business St.",
    "Zahlungsbedingungen": "Net 30"
  },
  item: {
    "Artikelnummer": "10",
    "Beschreibung": "Jol er balti",
    "Menge": "100", 
    "Preis": "50",
    "Einheit": "EA",
    "Gesamt": "5000"
  }
};

export const mockFieldConfig: FieldConfigurationData = {
  header: {
    "0": {
      fieldname: "Bestellnr",
      label: "PO Number",
      logic: "1",
      prompt: "",
      selected: true
    },
    "1": {
      fieldname: "Bedat",
      label: "PO Date",
      logic: "1",
      prompt: "",
      selected: true
    },
    "2": {
      fieldname: "Tel",
      label: "",
      logic: "0",
      prompt: "",
      selected: false
    },
    "3": {
      fieldname: "Info",
      label: "Delivery Date",
      logic: "2",
      prompt: "Derive the date from this field",
      selected: true
    },
    "4": {
      fieldname: "Lieferant",
      label: "Vendor",
      logic: "1",
      prompt: "",
      selected: true
    },
    "5": {
      fieldname: "Lieferadresse",
      label: "Ship To",
      logic: "1",
      prompt: "",
      selected: true
    },
    "6": {
      fieldname: "Zahlungsbedingungen",
      label: "Payment Terms",
      logic: "1",
      prompt: "",
      selected: true
    }
  },
  item: {
    "0": {
      fieldname: "Artikelnummer",
      label: "Item No.",
      logic: "1",
      prompt: "",
      selected: true
    },
    "1": {
      fieldname: "Beschreibung",
      label: "Item Desc",
      logic: "1",
      prompt: "",
      selected: true
    },
    "2": {
      fieldname: "Menge",
      label: "Qty",
      logic: "1",
      prompt: "",
      selected: true
    },
    "3": {
      fieldname: "Preis",
      label: "Price",
      logic: "1",
      prompt: "",
      selected: true
    },
    "4": {
      fieldname: "Einheit",
      label: "UOM",
      logic: "1",
      prompt: "",
      selected: true
    },
    "5": {
      fieldname: "Gesamt",
      label: "Total",
      logic: "1",
      prompt: "",
      selected: true
    }
  }
};

export const mockConfigureResponse: ConfigurePdfResponse = {
  extractedData: mockExtractedData,
  fieldConfig: mockFieldConfig
}; 