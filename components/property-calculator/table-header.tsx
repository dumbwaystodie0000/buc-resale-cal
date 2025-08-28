"use client";

import { useState } from "react";
import { X, Edit2, Save, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Property, SavedProperty, PropertyType } from "./types";
import { mockFolders } from "./constants";
import { PropertyTypeBadge } from "./ui-components";
import SelectPropertyButton from "./select-property-button";
import HoldingPeriodInput from "./holding-period-input";

interface TableHeaderProps {
  properties: Property[];
  editingPropertyId: string | null;
  editingName: string;
  onStartEdit: (property: Property) => void;
  onSaveEdit: (propertyId: string) => void;
  onCancelEdit: () => void;
  onEditingNameChange: (name: string) => void;
  onRemoveProperty: (id: string) => void;
  onSaveExistingProperty: (property: Property, folder?: string) => void;
  onCreateFolder: (name: string) => void;
  onSelectSavedProperty: (property: SavedProperty) => void;
  onCreateNewProperty: (
    name: string,
    type: PropertyType,
    folder?: string,
  ) => void;
  hasPropertyData: (property: Property) => boolean;
  onHoldingPeriodChange: (value: string) => void;
  onHoldingPeriodBlur: () => void;
  onOpenCreateFolderDialog: (property: Property) => void;
}

export default function TableHeader({
  properties,
  editingPropertyId,
  editingName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditingNameChange,
  onRemoveProperty,
  onSaveExistingProperty,
  onCreateFolder,
  onSelectSavedProperty,
  onCreateNewProperty,
  hasPropertyData,
  onHoldingPeriodChange,
  onHoldingPeriodBlur,
  onOpenCreateFolderDialog,
}: TableHeaderProps) {
  const handleOpenCreateFolderDialog = (property: Property) => {
    onOpenCreateFolderDialog(property);
  };
  return (
    <thead className="text-sm" data-oid=".idf25f">
      <tr
        className="sticky top-0 z-20 bg-white border-b border-[#CCCCCC]/50"
        data-oid="ow:60ja"
      >
        <th
          className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-[#666666] font-semibold border-r border-[#CCCCCC]/50"
          data-oid="zc5ej9s"
        >
          <HoldingPeriodInput
            value={String(properties[0]?.holdingPeriod || 4)}
            onChange={onHoldingPeriodChange}
            onBlur={onHoldingPeriodBlur}
            data-oid="6whz11x"
          />
        </th>
        {properties.map((property, i) => (
          <th
            key={property.id}
            className="px-4 py-3 text-left font-medium text-[#666666] border-r border-[#CCCCCC]/50 last:border-r-0"
            data-oid=":9l4t-s"
          >
            <div
              className="relative flex flex-col items-center gap-2"
              data-oid="zib-52d"
            >
              <PropertyTypeBadge type={property.type} data-oid="sm3fxhb" />
              <div className="text-[#000000] font-bold" data-oid="df1i4q5">
                {editingPropertyId === property.id ? (
                  // Inline editing mode
                  <div className="flex items-center gap-2" data-oid="o0pkewl">
                    <Input
                      value={editingName}
                      onChange={(e) => onEditingNameChange(e.target.value)}
                      className="h-7 text-xs text-center border-[#CCCCCC] focus:border-[#999999] focus:outline-[#999999] text-[#000000]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onSaveEdit(property.id);
                        } else if (e.key === "Escape") {
                          onCancelEdit();
                        }
                      }}
                      autoFocus
                      data-oid="uu8d4fc"
                    />

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => onSaveEdit(property.id)}
                      data-oid="ia4-y9z"
                    >
                      <Save className="h-3 w-3" data-oid="8v:gmn0" />
                    </Button>
                  </div>
                ) : hasPropertyData(property) ? (
                  // Property has data - show editable name with save options
                  <div className="text-center" data-oid="_m-pfot">
                    <div
                      className="flex items-center justify-center gap-2"
                      data-oid="ejgwlz9"
                    >
                      <div
                        className="font-semibold text-[#000000]"
                        data-oid="domsef_"
                      >
                        {property.name}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                        onClick={() => onStartEdit(property)}
                        title="Rename the title"
                        data-oid="srzyls0"
                      >
                        <Edit2 className="h-3 w-3" data-oid="3sjj.4p" />
                      </Button>
                      {hasPropertyData(property) && (
                        <DropdownMenu data-oid="918_osa">
                          <DropdownMenuTrigger asChild data-oid="p9f8i81">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0"
                              title="Save the record"
                              data-oid="9u4-jio"
                            >
                              <Save className="h-3 w-3" data-oid="-jl.arq" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="pqpg6_b">
                            <DropdownMenuItem
                              onClick={() => onSaveExistingProperty(property)}
                              data-oid="6sl1ve1"
                            >
                              <Folder
                                className="h-3 w-3 mr-2"
                                data-oid="9lxhf7r"
                              />
                              Save to Default Folder
                            </DropdownMenuItem>
                            {mockFolders.map((folder) => (
                              <DropdownMenuItem
                                key={folder}
                                onClick={() =>
                                  onSaveExistingProperty(property, folder)
                                }
                                data-oid="4jwv455"
                              >
                                <Folder
                                  className="h-3 w-3 mr-2"
                                  data-oid="2ld023y"
                                />
                                Save to {folder}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenCreateFolderDialog(property)
                              }
                              data-oid="1kr5d.o"
                            >
                              <Folder
                                className="h-3 w-3 mr-2"
                                data-oid="8xyvtmc"
                              />
                              Create New Folder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ) : (
                  // Property has no data - show SelectPropertyButton
                  <SelectPropertyButton
                    columnId={property.id}
                    propertyType={property.type}
                    onSelectSavedProperty={onSelectSavedProperty}
                    onCreateNewProperty={onCreateNewProperty}
                    onCreateFolder={onCreateFolder}
                    data-oid="bzl-aht"
                  />
                )}
              </div>
              {properties.length > 1 && (
                <button
                  onClick={() => onRemoveProperty(property.id)}
                  aria-label="Remove property"
                  className="absolute top-0 right-0 rounded-full p-1.5 text-[#999999] hover:text-[#B40101] hover:bg-[#F9E6E6]"
                  data-oid=".p-aiqi"
                >
                  <X className="h-4 w-4" data-oid="5yu9yin" />
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
