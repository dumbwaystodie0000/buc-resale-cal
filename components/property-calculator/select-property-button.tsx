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
      <div
        className={`w-3 h-3 rounded-full ${type === "BUC" ? "bg-orange-500" : "bg-green-500"}`}
        data-oid="zwcnt12"
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
        data-oid="qy:1p3a"
      >
        <DropdownMenuTrigger asChild data-oid="ysbj59b">
          <Button
            variant="outline"
            className="w-full h-8 text-xs font-semibold text-slate-700 bg-transparent"
            data-oid="n21gm9d"
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
          data-oid="iid.ksd"
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
            data-oid="qxsw13z"
          >
            <Folder className="mr-2 h-4 w-4" data-oid="slr-ars" />
            <span data-oid="4eeotou">From Saved Folder</span>
            <ChevronRight className="ml-auto h-4 w-4" data-oid="-b-yfe4" />
          </DropdownMenuItem>

          {/* Create New Entry */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleCreateNew(propertyType)}
            data-oid="rsstpdz"
          >
            <Building2 className="mr-2 h-4 w-4" data-oid="wf:wd_b" />
            <span data-oid="diiz.oc">Create New {propertyType} Entry</span>
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
              data-oid="2hnzoye"
            >
              {mockFolders.map((folder) => {
                const folderProperties = getFolderProperties(folder);
                return (
                  <div key={folder} data-oid="rbpbbg5">
                    <div
                      className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border-b border-slate-100"
                      data-oid="t0sdcnk"
                    >
                      <Folder
                        className="mr-2 h-4 w-4 inline"
                        data-oid="3pggpyq"
                      />
                      <span data-oid="siclcqz">
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
                        data-oid="nivh7i:"
                      >
                        {getPropertyIcon(property.type)}
                        <div className="flex-1 min-w-0" data-oid="r_29jpz">
                          <div
                            className="text-sm text-slate-900"
                            data-oid="0.9ewr7"
                          >
                            {property.name}
                          </div>
                          <div
                            className="text-xs text-slate-500"
                            data-oid="tupug8f"
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
                        data-oid="lg3..99"
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
                data-oid=".1x90oo"
              >
                <Plus
                  className="mr-2 h-4 w-4 flex-shrink-0"
                  data-oid="g9fu8ww"
                />
                <span className="whitespace-nowrap" data-oid="oqseq6l">
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
        data-oid="-6ia763"
      />
    </>
  );
}
