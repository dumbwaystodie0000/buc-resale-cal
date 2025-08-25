"use client";

import { useState } from "react";
import {
  ChevronDown,
  Folder,
  FileText,
  Plus,
  Home,
  Building2,
  X,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PropertyType } from "./types";

interface SavedProperty {
  id: string;
  name: string;
  type: PropertyType;
  price: number;
  folder: string;
}

interface AddPropertyDropdownProps {
  onAddProperty: (type: PropertyType, name: string, folder?: string) => void;
  onCreateNewEntry: (type: PropertyType) => void;
  folders: string[];
  onCreateFolder: (name: string) => void;
  disabled?: boolean;
}

export default function AddPropertyDropdown({
  onAddProperty,
  onCreateNewEntry,
  folders,
  onCreateFolder,
  disabled = false,
}: AddPropertyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavedFolderDialogOpen, setIsSavedFolderDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [itemToRename, setItemToRename] = useState<{
    type: "folder" | "property";
    id: string;
    currentName: string;
  } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "folder" | "property";
    id: string;
    name: string;
  } | null>(null);
  const [newName, setNewName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isHoveringMain, setIsHoveringMain] = useState(false);
  const [isHoveringSub, setIsHoveringSub] = useState(false);

  // Mock saved properties - in a real app, this would come from props or API
  const savedProperties: SavedProperty[] = [
    {
      id: "1",
      name: "Marina Bay Condo",
      type: "BUC",
      price: 1200000,
      folder: "Singapore Properties",
    },
    {
      id: "2",
      name: "Punggol BTO",
      type: "BUC",
      price: 800000,
      folder: "Singapore Properties",
    },
    {
      id: "3",
      name: "Orchard Resale",
      type: "Resale",
      price: 2500000,
      folder: "Investment Portfolio",
    },
  ];

  const handleCreateNewEntry = (type: PropertyType) => {
    onCreateNewEntry(type);
    setIsOpen(false);
  };

  const handleFromSavedFolder = (property: SavedProperty) => {
    onAddProperty(property.type, property.name, property.folder);
    setIsSavedFolderDialogOpen(false);
    setIsOpen(false);
    setSelectedFolder(null);
    setActiveTab("all");
  };

  const handleOpenSavedFolderDialog = () => {
    setIsSavedFolderDialogOpen(true);
    setIsOpen(false);
    setSelectedFolder(null);
    setActiveTab("all");
  };

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(folderName);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setActiveTab("all");
  };

  const handleRename = (
    type: "folder" | "property",
    id: string,
    currentName: string,
  ) => {
    setItemToRename({ type, id, currentName });
    setNewName(currentName);
    setIsRenameDialogOpen(true);
  };

  const handleDelete = (
    type: "folder" | "property",
    id: string,
    name: string,
  ) => {
    setItemToDelete({ type, id, name });
    setIsDeleteDialogOpen(true);
  };

  const confirmRename = () => {
    if (itemToRename && newName.trim()) {
      // In a real app, you would call an API to rename the item
      console.log(
        `Renaming ${itemToRename.type} ${itemToRename.id} to "${newName}"`,
      );
      setIsRenameDialogOpen(false);
      setItemToRename(null);
      setNewName("");
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, you would call an API to delete the item
      console.log(`Deleting ${itemToDelete.type} ${itemToDelete.id}`);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getFilteredProperties = (filter: string) => {
    let properties = selectedFolder
      ? savedProperties.filter((prop) => prop.folder === selectedFolder)
      : savedProperties;

    if (filter === "all") return properties;
    return properties.filter((prop) => prop.type === filter);
  };

  const getPropertyIcon = (type: PropertyType) => {
    return (
      <div
        className={`w-3 h-3 rounded-full ${type === "BUC" ? "bg-orange-500" : "bg-green-500"}`}
        data-oid="jshez8t"
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
        data-oid="9gv.xk9"
      >
        <DropdownMenuTrigger asChild disabled={disabled} data-oid="w.r295n">
          <Button
            size="sm"
            className={`h-8 md:h-9 gap-2 text-sm ${disabled ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            disabled={disabled}
            title={
              disabled
                ? "Maximum 3 properties reached"
                : "Add a new property to compare"
            }
            data-oid="-yf1ni5"
          >
            <Plus className="h-4 w-4" data-oid="uv2sf5c" />
            {disabled ? "Max Reached" : "Add Property"}
            <ChevronDown className="h-4 w-4" data-oid="i98i7ko" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 z-[100] relative overflow-visible"
          align="end"
          sideOffset={8}
          collisionPadding={20}
          forceMount
          onMouseEnter={() => {
            setIsHoveringMain(true);
          }}
          onMouseLeave={() => {
            setIsHoveringMain(false);
            // Only close if not hovering over any submenu
            setTimeout(() => {
              if (!isHoveringSub) {
                setIsOpen(false);
                setOpenSubmenu(null);
              }
            }, 150);
          }}
          data-oid="wltc_9x"
        >
          {/* From Saved Folder */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleOpenSavedFolderDialog}
            data-oid="kz6c5p."
          >
            <Folder className="mr-2 h-4 w-4" data-oid="-vxadpg" />
            <span data-oid="sxqmsac">From Saved Folder</span>
          </DropdownMenuItem>

          {/* Create New Entry with Submenu */}
          <div className="relative" data-oid="cfyis_o">
            <DropdownMenuItem
              className="cursor-pointer relative"
              onMouseEnter={() => {
                setIsHoveringSub(true);
                setOpenSubmenu("new-entry");
              }}
              onMouseLeave={() => {
                // Don't immediately close submenu, let the submenu's own mouse events handle it
              }}
              data-oid=":vmol:3"
            >
              <FileText className="mr-2 h-4 w-4" data-oid="q:9_u0i" />
              <span data-oid="88c9.hj">Create New Entry</span>
              <ChevronRight className="ml-auto h-4 w-4" data-oid="1hauz_9" />
            </DropdownMenuItem>

            {/* Create New Entry Submenu */}
            {openSubmenu === "new-entry" && (
              <div
                className="absolute w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-[200] mt-1"
                style={{
                  left: "0px",
                  top: "100%",
                  minHeight: "80px",
                }}
                onMouseEnter={() => {
                  setIsHoveringSub(true);
                  setOpenSubmenu("new-entry");
                }}
                onMouseLeave={() => {
                  setIsHoveringSub(false);
                  setOpenSubmenu(null);
                }}
                data-oid="pvf-j5y"
              >
                <div
                  onClick={() => {
                    handleCreateNewEntry("BUC");
                    setIsOpen(false);
                    setOpenSubmenu(null);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  onMouseEnter={() => {
                    setIsHoveringSub(true);
                    setOpenSubmenu("new-entry");
                  }}
                  data-oid="h9i7gx7"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-orange-500"
                    data-oid="ip:.vr0"
                  />

                  <span className="text-sm" data-oid="g12i3yo">
                    BUC
                  </span>
                </div>
                <div
                  onClick={() => {
                    handleCreateNewEntry("Resale");
                    setIsOpen(false);
                    setOpenSubmenu(null);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  onMouseEnter={() => {
                    setIsHoveringSub(true);
                    setOpenSubmenu("new-entry");
                  }}
                  data-oid="ar0h.t8"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-green-500"
                    data-oid="kqb:k:d"
                  />

                  <span className="text-sm" data-oid="zf02-p.">
                    Resale
                  </span>
                </div>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Saved Folder Dialog */}
      <Dialog
        open={isSavedFolderDialogOpen}
        onOpenChange={setIsSavedFolderDialogOpen}
        data-oid="w76jy:i"
      >
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-hidden"
          data-oid=":vsy1dd"
        >
          <DialogHeader className="mb-0" data-oid="pj7ambh">
            <DialogTitle className="flex items-center gap-2" data-oid="meuw043">
              <Folder className="h-5 w-5 text-emerald-600" data-oid="xpbbtjz" />
              {selectedFolder ? selectedFolder : "Select Folder"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2" data-oid="bd902u3">
            {!selectedFolder ? (
              // Show folders
              <div className="space-y-3" data-oid="meg.4iv">
                {folders.map((folder) => {
                  const folderProperties = savedProperties.filter(
                    (prop) => prop.folder === folder,
                  );
                  return (
                    <div
                      key={folder}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      data-oid="et71zm4"
                    >
                      <div
                        className="flex items-center gap-3"
                        data-oid="4kqjg0i"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleFolderClick(folder)}
                          data-oid="q.0oq8s"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="uv_9lz9"
                          >
                            <Folder
                              className="h-5 w-5 text-slate-500"
                              data-oid="y:mjk1s"
                            />

                            <div className="flex-1" data-oid="c.83s:v">
                              <div
                                className="text-sm font-medium text-slate-900"
                                data-oid="fc7p91b"
                              >
                                {folder}
                              </div>
                              <div
                                className="text-xs text-slate-500"
                                data-oid="j7x-qx6"
                              >
                                {folderProperties.length} properties
                              </div>
                            </div>
                            <ChevronRight
                              className="h-4 w-4 text-slate-400"
                              data-oid="vdj18rg"
                            />
                          </div>
                        </div>
                        <DropdownMenu data-oid=".i:859r">
                          <DropdownMenuTrigger asChild data-oid="idwijg9">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              data-oid="av-n83:"
                            >
                              <MoreHorizontal
                                className="h-4 w-4"
                                data-oid="3xf0co."
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" data-oid="lv2he7k">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRename("folder", folder, folder)
                              }
                              data-oid="6pacl8v"
                            >
                              <Edit
                                className="mr-2 h-4 w-4"
                                data-oid=".5px_h-"
                              />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete("folder", folder, folder)
                              }
                              className="text-red-600"
                              data-oid="ldh8zc7"
                            >
                              <Trash2
                                className="mr-2 h-4 w-4"
                                data-oid="3a-gz2j"
                              />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
                <div
                  onClick={() => setIsCreateFolderDialogOpen(true)}
                  className="p-4 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors text-center"
                  data-oid="6m:gv9p"
                >
                  <Plus
                    className="h-5 w-5 text-emerald-600 mx-auto mb-2"
                    data-oid="uxeifzj"
                  />

                  <span
                    className="text-sm text-emerald-600 font-medium"
                    data-oid="zu3oh8w"
                  >
                    Create New Folder
                  </span>
                </div>
              </div>
            ) : (
              // Show properties within selected folder
              <>
                <div
                  className="flex items-center gap-2 mb-4"
                  data-oid="8b-fr_v"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToFolders}
                    className="text-slate-600 hover:text-slate-900"
                    data-oid="jbwtgj6"
                  >
                    <ChevronRight
                      className="h-4 w-4 rotate-180 mr-1"
                      data-oid="gwat5ti"
                    />
                    Back to Folders
                  </Button>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                  data-oid="fbvb4qo"
                >
                  <TabsList
                    className="grid w-full grid-cols-3"
                    data-oid="avbb4ub"
                  >
                    <TabsTrigger value="all" data-oid="9tx_alz">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="BUC" data-oid="evthswn">
                      BUC
                    </TabsTrigger>
                    <TabsTrigger value="Resale" data-oid="81b2--:">
                      Resale
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4" data-oid="agd0t1v">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="lelxunl"
                    >
                      {getFilteredProperties("all").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="9n0vdd6"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="lavu_dy"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="zsaata1"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="q:tvne5"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="9.pkmty"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="kfcrbw2"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="ray3avr"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="bfvr2bw">
                              <DropdownMenuTrigger asChild data-oid="yzjfv6.">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="u92y::_"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="7vy-4.1"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid=":ph:-z:"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="2.50:s0"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="dr2z0x-"
                                  />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDelete(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  className="text-red-600"
                                  data-oid="nn6f:-l"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="9hetm5b"
                                  />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="BUC" className="mt-4" data-oid="57:6g55">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="_3:vbz-"
                    >
                      {getFilteredProperties("BUC").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="7fmwlxx"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="wsh::vj"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="s8pu95n"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid=":cw7h1j"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="smcwww."
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="wls:quh"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="idpczx3"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="ucyte:a">
                              <DropdownMenuTrigger asChild data-oid="ffjuzg0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="pa5j1sa"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="2wg7cym"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="ba_tq4e"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="dska3ap"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="xxh:xel"
                                  />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDelete(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  className="text-red-600"
                                  data-oid="1wsr6x:"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="duwe4jk"
                                  />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="Resale"
                    className="mt-4"
                    data-oid="qf:w-cl"
                  >
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="993ibyk"
                    >
                      {getFilteredProperties("Resale").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="5e_5-_d"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="u:gp4_r"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid=":_wttqi"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="7oik7iy"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="lq7a.4x"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="ds8s:3v"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="l0.qdcf"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="vxacwkj">
                              <DropdownMenuTrigger asChild data-oid="8ssd31i">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="ghsgup1"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="2v76zq6"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid=".rzsxlr"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="7im01n-"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="wbpsrcd"
                                  />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDelete(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  className="text-red-600"
                                  data-oid="f-wtyge"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="1zi1vf3"
                                  />
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
      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        data-oid="gl-2:m3"
      >
        <DialogContent className="sm:max-w-md" data-oid="kf:d:tm">
          <DialogHeader data-oid="37.omz6">
            <DialogTitle data-oid="cob7gtc">
              Rename {itemToRename?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="-2jvieo">
            <div data-oid="69_y8cs">
              <Label htmlFor="newName" data-oid="f8e_s7x">
                New Name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter new ${itemToRename?.type} name`}
                className="mt-2"
                data-oid="91t.:av"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="ipnf9ku">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                data-oid="qu-x9lq"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRename}
                disabled={!newName.trim()}
                data-oid="cbpvm7u"
              >
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        data-oid=":891-06"
      >
        <DialogContent className="sm:max-w-md" data-oid="zh2i0:o">
          <DialogHeader data-oid="5qn9e0r">
            <DialogTitle data-oid="pnel0ys">
              Delete {itemToDelete?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="wdw6cyj">
            <p className="text-slate-600" data-oid="7zq0gi6">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2" data-oid="2mv_yzw">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                data-oid="jsw06.u"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                data-oid="twh4rt3"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        data-oid="rd0om1p"
      >
        <DialogContent className="sm:max-w-md" data-oid="3ga1nlj">
          <DialogHeader data-oid="der4shk">
            <DialogTitle data-oid=":g6mvbs">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid=".e.4-1w">
            <div data-oid="0n0a-qv">
              <Label htmlFor="newFolderName" data-oid="dtjtf6j">
                Folder Name
              </Label>
              <Input
                id="newFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-2"
                data-oid=":wm_ymt"
              />

              {newFolderName.trim() &&
                folders.includes(newFolderName.trim()) && (
                  <div
                    className="text-xs text-red-600 italic mt-1"
                    data-oid="lpfg6o."
                  >
                    A folder with this name already exists. Please choose a
                    different name.
                  </div>
                )}
            </div>
            <div className="flex justify-end space-x-2" data-oid="-_07i1_">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderDialogOpen(false)}
                data-oid="..m:kvs"
              >
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
                disabled={
                  !newFolderName.trim() ||
                  folders.includes(newFolderName.trim())
                }
                data-oid="hey1hn4"
              >
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
