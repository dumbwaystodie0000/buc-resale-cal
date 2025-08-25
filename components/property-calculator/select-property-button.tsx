"use client";

import { useState } from "react";
import { ChevronRight, Folder, Building2, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PropertyType, SavedProperty } from "./types";
import { mockFolders, mockSavedProperties } from "./constants";
import CreatePropertyDialog from "./create-property-dialog";

interface SelectPropertyButtonProps {
  columnId: string;
  propertyType: PropertyType;
  onSelectSavedProperty: (property: SavedProperty) => void;
  onCreateNewProperty: (
    name: string,
    type: PropertyType,
    folder?: string,
  ) => void;
  onCreateFolder: (name: string) => void;
}

export default function SelectPropertyButton({
  columnId,
  propertyType,
  onSelectSavedProperty,
  onCreateNewProperty,
  onCreateFolder,
}: SelectPropertyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isHoveringMain, setIsHoveringMain] = useState(false);
  const [isHoveringSub, setIsHoveringSub] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateNew = (type: PropertyType) => {
    setShowCreateDialog(true);
    setIsOpen(false);
  };

  const handleCreateConfirm = (name: string, folder?: string) => {
    onCreateNewProperty(name, propertyType, folder);
    setShowCreateDialog(false);
  };

  const handleCreateCancel = () => {
    setShowCreateDialog(false);
    setSelectedTypeForDialog(null);
  };

  const handleFromSavedFolder = (property: SavedProperty) => {
    onSelectSavedProperty(property);
    setIsOpen(false);
  };

  const getFolderProperties = (folderName: string) => {
    return mockSavedProperties.filter(
      (prop) => prop.folder === folderName && prop.type === propertyType,
    );
  };

  const getPropertyIcon = (type: PropertyType) => {
    return (
      <img
        src={type === "BUC" ? "/buc.png" : "/resale.png"}
        alt={type}
        className="w-6 h-6"
        data-oid="property-type-icon"
      />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <DropdownMenu
        open={isOpen}
        onOpenChange={setIsOpen}
        modal={false}
        data-oid="q37wi5t"
      >
        <DropdownMenuTrigger asChild data-oid="2u4j96m">
          <Button
            variant="outline"
            className="w-full h-8 text-xs font-semibold text-slate-700 bg-transparent"
            data-oid="_nw8i5e"
          >
            Select / Create New {propertyType} Entry
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 z-[100] overflow-visible"
          align="start"
          sideOffset={8}
          collisionPadding={20}
          forceMount
          onMouseEnter={() => setIsHoveringMain(true)}
          onMouseLeave={() => {
            setIsHoveringMain(false);
            // Only close if not hovering over any submenu
            setTimeout(() => {
              if (!isHoveringSub) {
                setIsOpen(false);
              }
            }, 100);
          }}
          data-oid="ykuvgxf"
        >
          {/* From Saved Folder */}
          <DropdownMenuItem
            className="cursor-pointer"
            onMouseEnter={() => {
              setIsHoveringSub(true);
              setOpenSubmenu("saved-folder");
            }}
            onMouseLeave={() => {
              setIsHoveringSub(false);
              setOpenSubmenu(null);
            }}
            data-oid="fgg48-3"
          >
            <Folder className="mr-2 h-4 w-4" data-oid="ewwtamh" />
            <span data-oid="bkx45in">From Saved Folder</span>
            <ChevronRight className="ml-auto h-4 w-4" data-oid="ht6_a:b" />
          </DropdownMenuItem>

          {/* Create New Entry */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleCreateNew(propertyType)}
            data-oid="--v6:he"
          >
            <Building2 className="mr-2 h-4 w-4" data-oid="avlr5.h" />
            <span data-oid="cf7f-90">Create New {propertyType} Entry</span>
          </DropdownMenuItem>

          {/* From Saved Folder Submenu */}
          {openSubmenu === "saved-folder" && (
            <div
              className="absolute left-0 top-0 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-[110] overflow-visible"
              style={{ transform: "translateX(-100%)" }}
              onMouseEnter={() => {
                setIsHoveringSub(true);
                setOpenSubmenu("saved-folder");
              }}
              onMouseLeave={() => {
                setIsHoveringSub(false);
                setOpenSubmenu(null);
              }}
              data-oid="mobmxq0"
            >
              {mockFolders.map((folder) => {
                const folderProperties = getFolderProperties(folder);
                return (
                  <div key={folder} data-oid="ke2376m">
                    <div
                      className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border-b border-slate-100"
                      data-oid="28q:wvg"
                    >
                      <Folder
                        className="mr-2 h-4 w-4 inline"
                        data-oid="oq_.u-h"
                      />

                      <span data-oid="uquqqxm">
                        {folder} ({folderProperties.length})
                      </span>
                    </div>
                    {folderProperties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => handleFromSavedFolder(property)}
                        className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2"
                        onMouseEnter={() => {
                          setIsHoveringSub(true);
                          setOpenSubmenu("saved-folder");
                        }}
                        data-oid=":o25hks"
                      >
                        {getPropertyIcon(property.type)}
                        <div className="flex-1 min-w-0" data-oid="e8z.pnz">
                          <div
                            className="text-sm text-slate-900"
                            data-oid="1moa5z_"
                          >
                            {property.name}
                          </div>
                          <div
                            className="text-xs text-slate-500"
                            data-oid="fwwgg6i"
                          >
                            {property.type} -{" "}
                            {formatPrice(property.purchasePrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {folderProperties.length === 0 && (
                      <div
                        className="px-3 py-2 text-slate-500 pl-8 text-sm"
                        data-oid=":8bvzk8"
                      >
                        No properties in this folder
                      </div>
                    )}
                  </div>
                );
              })}
              <div
                onClick={() => onCreateFolder("New Folder")}
                className="px-3 py-2 text-emerald-600 text-sm border-t border-slate-200 mt-2 pt-2 cursor-pointer hover:bg-slate-50 flex items-center"
                onMouseEnter={() => {
                  setIsHoveringSub(true);
                  setOpenSubmenu("saved-folder");
                }}
                data-oid="a0vxros"
              >
                <Plus
                  className="mr-2 h-4 w-4 flex-shrink-0"
                  data-oid="ixnk:v4"
                />

                <span className="whitespace-nowrap" data-oid="wbia-d_">
                  Create New Folder
                </span>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreatePropertyDialog
        isOpen={showCreateDialog}
        onClose={handleCreateCancel}
        onConfirm={handleCreateConfirm}
        propertyType={propertyType}
        folders={mockFolders}
        onCreateFolder={onCreateFolder}
        data-oid="whuea-4"
      />
    </>
  );
}
