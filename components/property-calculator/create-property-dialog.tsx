"use client"

import { useState, useEffect } from "react"
import { X, Plus, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PropertyType } from "./types"

interface CreatePropertyDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string, folder?: string) => void
  propertyType: PropertyType
  folders: string[]
  onCreateFolder: (name: string) => void
}

export default function CreatePropertyDialog({
  isOpen,
  onClose,
  onConfirm,
  propertyType,
  folders,
  onCreateFolder
}: CreatePropertyDialogProps) {
  const [propertyName, setPropertyName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  // Generate default property name when dialog opens
  useEffect(() => {
    if (isOpen) {
      const defaultName = propertyType === "BUC" ? `BUC Property` : `Resale Property`
      setPropertyName(defaultName)
      setSelectedFolder("")
      setIsCreatingFolder(false)
      setNewFolderName("")
    }
  }, [isOpen, propertyType])

  const handleConfirm = () => {
    if (propertyName.trim()) {
      const folder = isCreatingFolder && newFolderName.trim() ? newFolderName.trim() : 
                    (selectedFolder === "no-folder" ? undefined : selectedFolder || undefined)
      onConfirm(propertyName.trim(), folder)
      onClose()
    }
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim())
      setSelectedFolder(newFolderName.trim())
      setIsCreatingFolder(false)
      setNewFolderName("")
    }
  }

  const getPropertyIcon = () => {
    return (
      <div className={`w-4 h-4 rounded-full ${propertyType === "BUC" ? "bg-orange-500" : "bg-green-500"}`} />
    )
  }

  const getPropertyTitle = () => {
    return propertyType === "BUC" ? "Create New BUC Property" : "Create New Resale Property"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            {getPropertyIcon()}
            {getPropertyTitle()}
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Enter the property details and choose a folder to organize your properties.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="property-name">Property Name</Label>
            <Input
              id="property-name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="Enter property name"
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="folder">Folder (Optional)</Label>
            {!isCreatingFolder ? (
              <div className="flex gap-2 w-full h-9">
                <Select value={selectedFolder} onValueChange={setSelectedFolder} className="flex-1">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-folder">No Folder</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
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
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateFolder}
                    className="flex-1"
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    Create Folder
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingFolder(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-12">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!propertyName.trim()}>
            Create Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 