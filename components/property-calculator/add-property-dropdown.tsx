"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FileText, Plus, Home, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
    setIsOpen(false)
  }

  const getFolderProperties = (folderName: string) => {
    return savedProperties.filter(prop => prop.folder === folderName)
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
        className="w-64 z-[100] overflow-visible" 
        align="end" 
        sideOffset={8} 
        collisionPadding={20} 
        forceMount
        onMouseEnter={() => setIsHoveringMain(true)}
        onMouseLeave={() => {
          setIsHoveringMain(false)
          // Only close if not hovering over any submenu
          setTimeout(() => {
            if (!isHoveringSub) {
              setIsOpen(false)
            }
          }, 100)
        }}
      >
        {/* From Saved Folder */}
        <DropdownMenuItem
          className="cursor-pointer"
          onMouseEnter={() => {
            setIsHoveringSub(true)
            setOpenSubmenu("saved-folder")
          }}
          onMouseLeave={() => {
            setIsHoveringSub(false)
            setOpenSubmenu(null)
          }}
        >
          <Folder className="mr-2 h-4 w-4" />
          <span>From Saved Folder</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        
        {/* Create New Entry */}
        <DropdownMenuItem
          className="cursor-pointer"
          onMouseEnter={() => {
            setIsHoveringSub(true)
            setOpenSubmenu("new-entry")
          }}
          onMouseLeave={() => {
            setIsHoveringSub(false)
            setOpenSubmenu(null)
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Create New Entry</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        
        {/* From Saved Folder Submenu */}
        {openSubmenu === "saved-folder" && (
          <div 
            className="absolute left-0 top-0 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-[110] overflow-visible"
            style={{ transform: 'translateX(-100%)' }}
            onMouseEnter={() => {
              setIsHoveringSub(true)
              setOpenSubmenu("saved-folder")
            }}
            onMouseLeave={() => {
              setIsHoveringSub(false)
              setOpenSubmenu(null)
            }}
          >
            {folders.map((folder) => {
              const folderProperties = getFolderProperties(folder)
              return (
                <div key={folder}>
                  <div className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border-b border-slate-100">
                    <Folder className="mr-2 h-4 w-4 inline" />
                    <span>{folder} ({folderProperties.length})</span>
                  </div>
                  {folderProperties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => handleFromSavedFolder(property)}
                      className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2"
                      onMouseEnter={() => {
                        setIsHoveringSub(true)
                        setOpenSubmenu("saved-folder")
                      }}
                    >
                      {getPropertyIcon(property.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900">{property.name}</div>
                        <div className="text-xs text-slate-500">
                          {property.type} - {formatPrice(property.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {folderProperties.length === 0 && (
                    <div className="px-3 py-2 text-slate-500 pl-8">
                      No properties in this folder
                    </div>
                  )}
                </div>
              )
            })}
                                 <div
                       onClick={() => onCreateFolder("New Folder")}
                       className="px-3 py-2 text-emerald-600 text-sm border-t border-slate-200 mt-2 pt-2 cursor-pointer hover:bg-slate-50 flex items-center"
                       onMouseEnter={() => {
                         setIsHoveringSub(true)
                         setOpenSubmenu("saved-folder")
                       }}
                     >
                       <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                       <span className="whitespace-nowrap">Create New Folder</span>
                     </div>
          </div>
        )}
        
        {/* Create New Entry Submenu */}
        {openSubmenu === "new-entry" && (
          <div 
            className="absolute left-0 top-0 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-[110] overflow-visible"
            style={{ transform: 'translateX(-100%)' }}
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
              onClick={() => handleCreateNewEntry("BUC")}
              className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2"
              onMouseEnter={() => {
                setIsHoveringSub(true)
                setOpenSubmenu("new-entry")
              }}
            >
              <Building2 className="h-4 w-4 text-orange-500" />
              <span className="text-sm">BUC</span>
            </div>
            <div
              onClick={() => handleCreateNewEntry("Resale")}
              className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2"
              onMouseEnter={() => {
                setIsHoveringSub(true)
                setOpenSubmenu("new-entry")
              }}
            >
              <Home className="h-4 w-4 text-green-500" />
              <span className="text-sm">Resale</span>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 