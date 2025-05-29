import { FieldsSelectionView } from "@/components/FieldsSelectionView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useConfiguration } from "@/hooks/useConfiguration";
import { ConfigurePdfResponse } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function EditConfigurationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { editConfiguration, saveConfiguration, isLoading } = useConfiguration();
  const [config, setConfig] = useState<ConfigurePdfResponse | null>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const configName = location.state?.name as string;

  useEffect(() => {
    if (!configName) {
      toast.error("No configuration selected");
      navigate('/configurations');
      return;
    }

    const loadConfiguration = async () => {
      try {
        const data = await editConfiguration(configName);
        setConfig(data);
        setNewName(data.name);
      } catch (error) {
        console.error('Error loading configuration:', error);
        navigate('/configurations');
      }
    };

    loadConfiguration();
  }, [configName, editConfiguration, navigate]);

  const handleFieldSelect = useCallback((section: "header" | "item", fieldId: string, selected: boolean) => {
    if (!config) return;

    setConfig(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [fieldId]: {
            ...prev[section][fieldId],
            selected
          }
        }
      };
    });
  }, [config]);

  const handleSave = useCallback(async () => {
    if (!config) return;

    try {
      await saveConfiguration({
        ...config,
        name: newName
      });
      navigate('/configurations');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  }, [config, newName, saveConfiguration, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/configurations');
  }, [navigate]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Edit Configuration: {config.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldsSelectionView
            config={config}
            onFieldSelect={handleFieldSelect}
            onSubmit={() => setIsRenameDialogOpen(true)}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Configuration</DialogTitle>
            <DialogDescription>
              You can update the configuration name if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Configuration name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!newName.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 