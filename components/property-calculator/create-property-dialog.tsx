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
      <img
        src={propertyType === "BUC" ? "/buc.png" : "/resale.png"}
        alt={propertyType}
        className="w-6 h-6"
        data-oid="property-type-icon"
      />
    );
  };

  const getPropertyTitle = () => {
    return propertyType === "BUC"
      ? "Create New BUC Property"
      : "Create New Resale Property";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="ac-1:i2">
      <DialogContent className="sm:max-w-md" data-oid="2k1g9ev">
        <DialogHeader className="pb-2" data-oid="5v:p0vb">
          <DialogTitle className="flex items-center gap-2" data-oid="yoju06d">
            {getPropertyIcon()}
            {getPropertyTitle()}
          </DialogTitle>
          <p className="text-sm text-slate-600" data-oid=".fx4byd">
            Enter the property details and choose a folder to organize your
            properties.
          </p>
        </DialogHeader>

        <div className="space-y-6" data-oid="t9vbxoh">
          <div className="space-y-3" data-oid="3kao.s6">
            <Label htmlFor="property-name" data-oid="7dtz0:_">
              Property Name
            </Label>
            <Input
              id="property-name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="Enter property name"
              className="w-full"
              data-oid="c1n0nz_"
            />
          </div>

          <div className="space-y-3" data-oid="s7_1:ui">
            <Label htmlFor="folder" data-oid="9xetxxi">
              Folder (Optional)
            </Label>
            {!isCreatingFolder ? (
              <div className="flex gap-2 w-full h-9" data-oid="nnr:kw-">
                <Select
                  value={selectedFolder}
                  onValueChange={setSelectedFolder}
                  className="flex-1"
                  data-oid="hwiru53"
                >
                  <SelectTrigger className="w-full" data-oid="qydwp65">
                    <SelectValue placeholder="No Folder" data-oid="zbzcjbu" />
                  </SelectTrigger>
                  <SelectContent data-oid="_y6myon">
                    <SelectItem value="no-folder" data-oid="utnpljv">
                      No Folder
                    </SelectItem>
                    {folders.map((folder) => (
                      <SelectItem
                        key={folder}
                        value={folder}
                        data-oid="5xqual6"
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
                  data-oid="dxpl4sr"
                >
                  <Plus className="h-4 w-4" data-oid="5ruqxt2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3" data-oid="joj3jzl">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full"
                  data-oid="h8zw4q4"
                />

                <div className="flex gap-2" data-oid="wps72:5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateFolder}
                    className="flex-1"
                    data-oid="6oqr9t4"
                  >
                    <Folder className="mr-2 h-4 w-4" data-oid="ydt:grs" />
                    Create Folder
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingFolder(false)}
                    className="flex-1"
                    data-oid="8d4w5.4"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-12" data-oid="-9tlq-_">
          <Button variant="outline" onClick={onClose} data-oid="l933144">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!propertyName.trim()}
            data-oid="m4:b3:8"
          >
            Create Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
