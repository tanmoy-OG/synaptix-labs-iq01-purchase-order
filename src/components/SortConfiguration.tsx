import { Button } from '@/components/ui/button';
import { ConfigurePdfResponse } from '@/types/api';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

// Dialog components
const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end space-x-2 mt-6">{children}</div>
);

interface SortConfigurationProps {
  config: ConfigurePdfResponse;
  onSave: (config: ConfigurePdfResponse) => void;
  isSaving: boolean;
  isExtracting: boolean;
}

export function SortConfiguration({ config, onSave, isSaving, isExtracting }: SortConfigurationProps) {
  const navigate = useNavigate();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [name, setConfigName] = useState(config.name);

  useEffect(() => {
    let nextPos = 1;
    Object.values(config.header).forEach((field) => {
      if (field.selected) {
        field.pos = nextPos++;
      }
    });
    Object.values(config.item).forEach((field) => {
      if (field.selected) {
        field.pos = nextPos++;
      }
    });
  }, [config]);

  const initialHeaders = useMemo(() => {
    const headerFields = Object.entries(config.header)
      .filter(([, f]) => f.selected)
      .map(([, f]) => f.label || f.fieldname);
    const itemFields = Object.entries(config.item)
      .filter(([, f]) => f.selected)
      .map(([, f]) => f.label || f.fieldname);
    return [...headerFields, ...itemFields];
  }, [config]);

  const [headers, setHeaders] = useState<string[]>(initialHeaders);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const applyPositionsFromHeaders = (orderedHeaders: string[]) => {
    console.log("before", config)
    const setPositions = (group: Record<string, { label: string; fieldname: string; selected: boolean; pos: number }>) => {
      Object.values(group).forEach((field) => {
        if (!field.selected) return;
        const display = field.label || field.fieldname;
        const idx = orderedHeaders.indexOf(display);
        if (idx !== -1) {
          field.pos = idx + 1;
        }
      });
    };

    setPositions(config.header);
    setPositions(config.item);
    console.log("after", config)
  };

  const onDragStart = (index: number) => () => setDragIndex(index);
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const onDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...headers];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setHeaders(updated);
    applyPositionsFromHeaders(updated);
    setDragIndex(null);
  };

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    if (!name.trim()) {
      toast.error('Please enter a configuration name');
      return;
    }

    try {
      await onSave({
        ...config,
        name: name.trim(),
      });
      setShowSaveDialog(false);
    } catch (error) {
      // If it's a 409 error, keep the dialog open so user can change the name
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Dialog will stay open, allowing user to modify the name
        return;
      }
      // For other errors, close the dialog
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h, idx) => (
                <th
                  key={h + idx}
                  draggable
                  onDragStart={onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={onDrop(idx)}
                  className="border px-4 py-3 text-left bg-muted/20 cursor-move select-none"
                  title="Drag to reorder"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {headers.map((_, idx) => (
                <td key={idx} className="border px-4 py-6 text-sm text-muted-foreground">
                  {/* Intentionally empty to show grid without values */}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/data-configuration', { state: { config, fromSort: true } })}>Back</Button>
        <Button onClick={() => navigate('/extract-results', { state: { name: config.name } })}>
          Continue
        </Button>
        <Button onClick={handleSaveClick}>Save Configuration</Button>
      </div>

      {/* Save Configuration Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Configuration</DialogTitle>
            <DialogDescription>
              Enter a name for this configuration. This will help you identify and reuse this
              configuration later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Configuration Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setConfigName(e.target.value)}
                placeholder="Enter configuration name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm} disabled={isSaving || isExtracting || !name.trim()}>
              {isSaving ? 'Saving...' : isExtracting ? 'Extracting...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


