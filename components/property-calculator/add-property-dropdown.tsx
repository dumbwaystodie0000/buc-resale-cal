"use client"

import { useState } from "react"
import { ChevronDown, Folder, FileText, Plus, Home, Building2, X, ChevronRight, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PropertyType } from "./types"

interface SavedProperty {
  id: string
  name: string
  type: PropertyType
  price: number
  folder: string
}

interface AddPropertyDropdownProps {
  onAddProperty: (type: PropertyType, name: string, folder?: string) => void
  onCreateNewEntry: (type: PropertyType) => void
  folders: string[]
  onCreateFolder: (name: string) => void
  disabled?: boolean
}

export default function AddPropertyDropdown({ onAddProperty, onCreateNewEntry, folders, onCreateFolder, disabled = false }: AddPropertyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSavedFolderDialogOpen, setIsSavedFolderDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [itemToRename, setItemToRename] = useState<{ type: 'folder' | 'property', id: string, currentName: string } | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'property', id: string, name: string } | null>(null)
  const [newName, setNewName] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isHoveringMain, setIsHoveringMain] = useState(false)
  const [isHoveringSub, setIsHoveringSub] = useState(false)

  // Mock saved properties - in a real app, this would come from props or API
  const savedProperties: SavedProperty[] = [
    { id: "1", name: "Marina Bay Condo", type: "BUC", price: 1200000, folder: "Singapore Properties" },
    { id: "2", name: "Punggol BTO", type: "BUC", price: 800000, folder: "Singapore Properties" },
    { id: "3", name: "Orchard Resale", type: "Resale", price: 2500000, folder: "Investment Portfolio" },
  ]

  const handleCreateNewEntry = (type: PropertyType) => {
    onCreateNewEntry(type)
    setIsOpen(false)
  }

  const handleFromSavedFolder = (property: SavedProperty) => {
    onAddProperty(property.type, property.name, property.folder)
    setIsSavedFolderDialogOpen(false)
    setIsOpen(false)
    setSelectedFolder(null)
    setActiveTab("all")
  }

  const handleOpenSavedFolderDialog = () => {
    setIsSavedFolderDialogOpen(true)
    setIsOpen(false)
    setSelectedFolder(null)
    setActiveTab("all")
  }

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(folderName)
  }

  const handleBackToFolders = () => {
    setSelectedFolder(null)
    setActiveTab("all")
  }

  const handleRename = (type: 'folder' | 'property', id: string, currentName: string) => {
    setItemToRename({ type, id, currentName })
    setNewName(currentName)
    setIsRenameDialogOpen(true)
  }

  const handleDelete = (type: 'folder' | 'property', id: string, name: string) => {
    setItemToDelete({ type, id, name })
    setIsDeleteDialogOpen(true)
  }

  const confirmRename = () => {
    if (itemToRename && newName.trim()) {
      // In a real app, you would call an API to rename the item
      console.log(`Renaming ${itemToRename.type} ${itemToRename.id} to "${newName}"`)
      setIsRenameDialogOpen(false)
      setItemToRename(null)
      setNewName("")
    }
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, you would call an API to delete the item
      console.log(`Deleting ${itemToDelete.type} ${itemToDelete.id}`)
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const getFilteredProperties = (filter: string) => {
    let properties = selectedFolder 
      ? savedProperties.filter(prop => prop.folder === selectedFolder)
      : savedProperties
    
    if (filter === "all") return properties
    return properties.filter(prop => prop.type === filter)
  }

  const getPropertyIcon = (type: PropertyType) => {
    return (
      <div className={`w-3 h-3 rounded-full ${type === "BUC" ? "bg-orange-500" : "bg-green-500"}`} />
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            size="sm"
            className={`h-8 md:h-9 gap-2 text-sm ${disabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            disabled={disabled}
            title={disabled ? "Maximum 3 properties reached" : "Add a new property to compare"}
          >
            <Plus className="h-4 w-4" />
            {disabled ? "Max Reached" : "Add Property"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 z-[100] relative overflow-visible" 
          align="end" 
          sideOffset={8} 
          collisionPadding={20} 
          forceMount
          onMouseEnter={() => {
            setIsHoveringMain(true)
          }}
          onMouseLeave={() => {
            setIsHoveringMain(false)
            // Only close if not hovering over any submenu
            setTimeout(() => {
              if (!isHoveringSub) {
                setIsOpen(false)
                setOpenSubmenu(null)
              }
            }, 150)
          }}
        >
          {/* From Saved Folder */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleOpenSavedFolderDialog}
          >
            <Folder className="mr-2 h-4 w-4" />
            <span>From Saved Folder</span>
          </DropdownMenuItem>
          
          {/* Create New Entry with Submenu */}
          <div className="relative">
            <DropdownMenuItem
              className="cursor-pointer relative"
              onMouseEnter={() => {
                setIsHoveringSub(true)
                setOpenSubmenu("new-entry")
              }}
              onMouseLeave={() => {
                // Don't immediately close submenu, let the submenu's own mouse events handle it
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Create New Entry</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            
            {/* Create New Entry Submenu */}
            {openSubmenu === "new-entry" && (
              <div 
                className="absolute w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-[200] mt-1"
                style={{ 
                  left: '0px',
                  top: '100%',
                  minHeight: '80px'
                }}
                onMouseEnter={() => {
                  setIsHoveringSub(true)
                  setOpenSubmenu("new-entry")
                }}
                onMouseLeave={() => {
                  setIsHoveringSub(false)
                  setOpenSubmenu(null)
                }}
              >
                <div
                  onClick={() => {
                    handleCreateNewEntry("BUC")
                    setIsOpen(false)
                    setOpenSubmenu(null)
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  onMouseEnter={() => {
                    setIsHoveringSub(true)
                    setOpenSubmenu("new-entry")
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">BUC</span>
                </div>
                <div
                  onClick={() => {
                    handleCreateNewEntry("Resale")
                    setIsOpen(false)
                    setOpenSubmenu(null)
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  onMouseEnter={() => {
                    setIsHoveringSub(true)
                    setOpenSubmenu("new-entry")
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Resale</span>
                </div>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Saved Folder Dialog */}
      <Dialog open={isSavedFolderDialogOpen} onOpenChange={setIsSavedFolderDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden">
          <DialogHeader className="mb-0">
            <DialogTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-emerald-600" />
              {selectedFolder ? selectedFolder : "Select Folder"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-2">
            {!selectedFolder ? (
              // Show folders
              <div className="space-y-3">
                {folders.map((folder) => {
                  const folderProperties = savedProperties.filter(prop => prop.folder === folder)
                  return (
                    <div
                      key={folder}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleFolderClick(folder)}
                        >
                          <div className="flex items-center gap-3">
                            <Folder className="h-5 w-5 text-slate-500" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900">{folder}</div>
                              <div className="text-xs text-slate-500">{folderProperties.length} properties</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRename('folder', folder, folder)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete('folder', folder, folder)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
                <div
                  onClick={() => setIsCreateFolderDialogOpen(true)}
                  className="p-4 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors text-center"
                >
                  <Plus className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                  <span className="text-sm text-emerald-600 font-medium">Create New Folder</span>
                </div>
              </div>
            ) : (
              // Show properties within selected folder
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToFolders}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                    Back to Folders
                  </Button>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="BUC">BUC</TabsTrigger>
                    <TabsTrigger value="Resale">Resale</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getFilteredProperties("all").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                            >
                              <div className="flex items-center gap-3">
                                {getPropertyIcon(property.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900">{property.name}</div>
                                  <div className="text-xs text-slate-500">
                                    {property.type} - {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRename('property', property.id, property.name)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete('property', property.id, property.name)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="BUC" className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getFilteredProperties("BUC").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                            >
                              <div className="flex items-center gap-3">
                                {getPropertyIcon(property.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900">{property.name}</div>
                                  <div className="text-xs text-slate-500">
                                    {property.type} - {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRename('property', property.id, property.name)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete('property', property.id, property.name)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="Resale" className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getFilteredProperties("Resale").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                            >
                              <div className="flex items-center gap-3">
                                {getPropertyIcon(property.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900">{property.name}</div>
                                  <div className="text-xs text-slate-500">
                                    {property.type} - {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRename('property', property.id, property.name)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete('property', property.id, property.name)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Rename {itemToRename?.type === 'folder' ? 'Folder' : 'Property'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newName">New Name</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter new ${itemToRename?.type} name`}
                className="mt-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmRename} disabled={!newName.trim()}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {itemToDelete?.type === 'folder' ? 'Folder' : 'Property'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-600">
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newFolderName">Folder Name</Label>
              <Input
                id="newFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-2"
              />
              {newFolderName.trim() && folders.includes(newFolderName.trim()) && (
                <div className="text-xs text-red-600 italic mt-1">
                  A folder with this name already exists. Please choose a different name.
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (newFolderName.trim()) {
                    onCreateFolder(newFolderName.trim());
                    setIsCreateFolderDialogOpen(false);
                    setNewFolderName("");
                  }
                }} 
                disabled={!newFolderName.trim() || folders.includes(newFolderName.trim())}
              >
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 