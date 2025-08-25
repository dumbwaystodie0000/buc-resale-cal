"use client";

import { useState, useEffect } from "react";
import { X, Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PropertyType } from "./types";

interface CreatePropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, folder?: string) => void;
  propertyType: PropertyType;
  folders: string[];
  onCreateFolder: (name: string) => void;
}

export default function CreatePropertyDialog({
  isOpen,
  onClose,
  onConfirm,
  propertyType,
  folders,
  onCreateFolder,
}: CreatePropertyDialogProps) {
  const [propertyName, setPropertyName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Generate default property name when dialog opens
  useEffect(() => {
    if (isOpen) {
      const defaultName =
        propertyType === "BUC" ? `BUC Property` : `Resale Property`;
      setPropertyName(defaultName);
      setSelectedFolder("");
      setIsCreatingFolder(false);
      setNewFolderName("");
    }
  }, [isOpen, propertyType]);

  const handleConfirm = () => {
    if (propertyName.trim()) {
      const folder =
        isCreatingFolder && newFolderName.trim()
          ? newFolderName.trim()
          : selectedFolder === "no-folder"
            ? undefined
            : selectedFolder || undefined;
      onConfirm(propertyName.trim(), folder);
      onClose();
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setSelectedFolder(newFolderName.trim());
      setIsCreatingFolder(false);
      setNewFolderName("");
    }
  };

  const getPropertyIcon = () => {
    return (
      <div
        className={`w-4 h-4 rounded-full ${propertyType === "BUC" ? "bg-orange-500" : "bg-green-500"}`}
        data-oid="pxnrx3v"
      />
    );
  };

  const getPropertyTitle = () => {
    return propertyType === "BUC"
      ? "Create New BUC Property"
      : "Create New Resale Property";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="0603fs5">
      <DialogContent className="sm:max-w-md" data-oid="l9j4fvj">
        <DialogHeader className="pb-2" data-oid="8gcz_ak">
          <DialogTitle className="flex items-center gap-2" data-oid="46ily4y">
            {getPropertyIcon()}
            {getPropertyTitle()}
          </DialogTitle>
          <p className="text-sm text-slate-600" data-oid="d2qowbd">
            Enter the property details and choose a folder to organize your
            properties.
          </p>
        </DialogHeader>

        <div className="space-y-6" data-oid="46jkak.">
          <div className="space-y-3" data-oid="_8-likh">
            <Label htmlFor="property-name" data-oid="tuhma1o">
              Property Name
            </Label>
            <Input
              id="property-name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="Enter property name"
              className="w-full"
              data-oid="yz0zz0p"
            />
          </div>

          <div className="space-y-3" data-oid="nen5kd.">
            <Label htmlFor="folder" data-oid="smye5od">
              Folder (Optional)
            </Label>
            {!isCreatingFolder ? (
              <div className="flex gap-2 w-full h-9" data-oid="bp.7jrp">
                <Select
                  value={selectedFolder}
                  onValueChange={setSelectedFolder}
                  className="flex-1"
                  data-oid="s0ieoly"
                >
                  <SelectTrigger className="w-full" data-oid="co1co:d">
                    <SelectValue placeholder="No Folder" data-oid="6r3z.y5" />
                  </SelectTrigger>
                  <SelectContent data-oid="4hatuu0">
                    <SelectItem value="no-folder" data-oid="gg:_wn0">
                      No Folder
                    </SelectItem>
                    {folders.map((folder) => (
                      <SelectItem
                        key={folder}
                        value={folder}
                        data-oid="zn5f_w-"
                      >
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingFolder(true)}
                  className="h-9 w-9 p-0 flex-shrink-0"
                  data-oid="5tw.s_y"
                >
                  <Plus className="h-4 w-4" data-oid="h85f4tc" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3" data-oid="sksmqch">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full"
                  data-oid="p1uqdmd"
                />

                <div className="flex gap-2" data-oid="v:pa9ky">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateFolder}
                    className="flex-1"
                    data-oid="z4dw8lw"
                  >
                    <Folder className="mr-2 h-4 w-4" data-oid="a1e6ah2" />
                    Create Folder
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingFolder(false)}
                    className="flex-1"
                    data-oid="fz-bxr7"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-12" data-oid="phd01_z">
          <Button variant="outline" onClick={onClose} data-oid="n8cx:3a">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!propertyName.trim()}
            data-oid="r6ns3i5"
          >
            Create Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
