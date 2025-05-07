import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldConfig, FieldConfigurationData } from "@/types/api";
import { useState } from "react";

interface FieldConfigurationViewProps {
  fieldConfig: FieldConfigurationData;
  onSave: (config: FieldConfigurationData) => void;
  onCancel: () => void;
}

export function FieldConfigurationView({ fieldConfig, onSave, onCancel }: FieldConfigurationViewProps) {
  const [config, setConfig] = useState<FieldConfigurationData>(fieldConfig);

  const handleFieldChange = (
    section: "header" | "item",
    fieldId: string,
    key: keyof FieldConfig,
    value: string | boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldId]: {
          ...prev[section][fieldId],
          [key]: value,
        },
      },
    }));
  };

  const renderFieldConfig = (section: "header" | "item", fieldId: string, field: FieldConfig) => {
    if (!field.selected) return null;

    // If the field's logic is 0, set it to 1 by default since 0 is reserved for unselected fields
    if (field.logic === "0") {
      handleFieldChange(section, fieldId, "logic", "1");
    }

    return (
      <Card key={fieldId} className="mb-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Field Name</Label>
              <Input
                value={field.fieldname}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={section === "header" ? "Header Data" : "Item Data"}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={field.label}
                onChange={(e) => handleFieldChange(section, fieldId, "label", e.target.value)}
                placeholder="Enter field label"
              />
            </div>
            <div className="space-y-2">
              <Label>Logic</Label>
              <Select
                value={field.logic}
                onValueChange={(value) => handleFieldChange(section, fieldId, "logic", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Direct Mapping</SelectItem>
                  <SelectItem value="2">AI Prompt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {field.logic === "2" && (
              <div className="space-y-2 md:col-span-2">
                <Label>Prompt</Label>
                <Textarea
                  value={field.prompt}
                  onChange={(e) => handleFieldChange(section, fieldId, "prompt", e.target.value)}
                  placeholder="Enter transformation prompt"
                  className="h-10"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const selectedHeaderFields = Object.entries(config.header).filter(([, field]) => field.selected);
  const selectedItemFields = Object.entries(config.item).filter(([, field]) => field.selected);

  return (
    <div className="space-y-6">
      {selectedHeaderFields.length > 0 && (
        <div className="space-y-4">
          <CardHeader>
            <CardTitle>Header Fields</CardTitle>
          </CardHeader>
          {selectedHeaderFields.map(([fieldId, field]) => 
            renderFieldConfig("header", fieldId, field)
          )}
        </div>
      )}

      {selectedItemFields.length > 0 && (
        <div className="space-y-4">
          <CardHeader>
            <CardTitle>Item Fields</CardTitle>
          </CardHeader>
          {selectedItemFields.map(([fieldId, field]) => 
            renderFieldConfig("item", fieldId, field)
          )}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(config)}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
} 