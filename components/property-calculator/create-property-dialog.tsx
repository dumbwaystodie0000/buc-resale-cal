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
        data-oid="tvx.54l"
      />
    );
  };

  const getPropertyTitle = () => {
    return propertyType === "BUC"
      ? "Create New BUC Property"
      : "Create New Resale Property";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-oid="_ic-elx">
      <DialogContent className="sm:max-w-md" data-oid="hxc2owp">
        <DialogHeader className="pb-2" data-oid="94.onr5">
          <DialogTitle className="flex items-center gap-2" data-oid="fo-x-u:">
            {getPropertyIcon()}
            {getPropertyTitle()}
          </DialogTitle>
          <p className="text-sm text-slate-600" data-oid="2unjy.y">
            Enter the property details and choose a folder to organize your
            properties.
          </p>
        </DialogHeader>

        <div className="space-y-6" data-oid="q7iv5ln">
          <div className="space-y-3" data-oid="858pi5-">
            <Label htmlFor="property-name" data-oid="hxpfnzs">
              Property Name
            </Label>
            <Input
              id="property-name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="Enter property name"
              className="w-full"
              data-oid="b2n666c"
            />
          </div>

          <div className="space-y-3" data-oid="8dk3kt4">
            <Label htmlFor="folder" data-oid="8biy2l2">
              Folder (Optional)
            </Label>
            {!isCreatingFolder ? (
              <div className="flex gap-2 w-full h-9" data-oid="shz0gxa">
                <Select
                  value={selectedFolder}
                  onValueChange={setSelectedFolder}
                  className="flex-1"
                  data-oid="adxt016"
                >
                  <SelectTrigger className="w-full" data-oid="0yfuu1e">
                    <SelectValue placeholder="No Folder" data-oid="6y1bo79" />
                  </SelectTrigger>
                  <SelectContent data-oid="4w-znc0">
                    <SelectItem value="no-folder" data-oid="cwjbb6g">
                      No Folder
                    </SelectItem>
                    {folders.map((folder) => (
                      <SelectItem
                        key={folder}
                        value={folder}
                        data-oid="j1n8bza"
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
                  data-oid="oz0ie22"
                >
                  <Plus className="h-4 w-4" data-oid="w6tmejb" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3" data-oid="grpke_3">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full"
                  data-oid=":l.ii_r"
                />

                <div className="flex gap-2" data-oid="xr_8xbm">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateFolder}
                    className="flex-1"
                    data-oid="3ofol-j"
                  >
                    <Folder className="mr-2 h-4 w-4" data-oid="q-ijttk" />
                    Create Folder
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingFolder(false)}
                    className="flex-1"
                    data-oid="-ox81gp"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-12" data-oid="8hnosrn">
          <Button variant="outline" onClick={onClose} data-oid="4kpwqq3">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!propertyName.trim()}
            data-oid="xrd3vde"
          >
            Create Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
