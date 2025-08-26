"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Property } from "./types";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newFolderName: string;
  onNewFolderNameChange: (name: string) => void;
  onCreateFolderAndSave: () => void;
  onCancel: () => void;
}

export default function CreateFolderDialog({
  isOpen,
  onOpenChange,
  newFolderName,
  onNewFolderNameChange,
  onCreateFolderAndSave,
  onCancel,
}: CreateFolderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} data-oid="8341dwn">
      <DialogContent className="sm:max-w-md" data-oid="k9o5pts">
        <DialogHeader data-oid="w6kw0nb">
          <DialogTitle data-oid="3ol7iir">Create New Folder</DialogTitle>
          <DialogDescription data-oid="dytdrwn">
            Enter a name for the new folder and save your property to it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4" data-oid="yfl4fql">
          <div className="space-y-2" data-oid="5-hjs:n">
            <Label htmlFor="folder-name" data-oid="_fd7gms">
              Folder Name
            </Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => onNewFolderNameChange(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onCreateFolderAndSave();
                }
              }}
              autoFocus
              data-oid="ilylep."
            />
          </div>
          <div className="flex justify-end space-x-2" data-oid="vzehqvq">
            <Button variant="outline" onClick={onCancel} data-oid="8ifqryo">
              Cancel
            </Button>
            <Button
              onClick={onCreateFolderAndSave}
              disabled={!newFolderName.trim()}
              data-oid="ppdbmu8"
            >
              Create & Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
