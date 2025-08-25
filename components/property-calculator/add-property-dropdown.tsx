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
        data-oid="xud:c6q"
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
        data-oid="14:43mk"
      >
        <DropdownMenuTrigger asChild disabled={disabled} data-oid="-r-nl8q">
          <Button
            size="sm"
            className={`h-8 md:h-9 gap-2 text-sm ${disabled ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            disabled={disabled}
            title={
              disabled
                ? "Maximum 3 properties reached"
                : "Add a new property to compare"
            }
            data-oid="ee39bwc"
          >
            <Plus className="h-4 w-4" data-oid="lp_2srh" />
            {disabled ? "Max Reached" : "Add Property"}
            <ChevronDown className="h-4 w-4" data-oid="g6vvj4." />
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
          data-oid="t:16pu5"
        >
          {/* From Saved Folder */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleOpenSavedFolderDialog}
            data-oid="5qcnhxs"
          >
            <Folder className="mr-2 h-4 w-4" data-oid="4s:94p:" />
            <span data-oid="ukzkiyo">From Saved Folder</span>
          </DropdownMenuItem>

          {/* Create New Entry with Submenu */}
          <div className="relative" data-oid="0bc.qd7">
            <DropdownMenuItem
              className="cursor-pointer relative"
              onMouseEnter={() => {
                setIsHoveringSub(true);
                setOpenSubmenu("new-entry");
              }}
              onMouseLeave={() => {
                // Don't immediately close submenu, let the submenu's own mouse events handle it
              }}
              data-oid="xkxretv"
            >
              <FileText className="mr-2 h-4 w-4" data-oid="fu23r5x" />
              <span data-oid="9o6ieaz">Create New Entry</span>
              <ChevronRight className="ml-auto h-4 w-4" data-oid="c-ofb0h" />
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
                data-oid="1_dy157"
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
                  data-oid="03v6sd5"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-orange-500"
                    data-oid="d-sfnzy"
                  />
                  <span className="text-sm" data-oid="yryjbwj">
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
                  data-oid=".ifrp02"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-green-500"
                    data-oid="0jo1-__"
                  />
                  <span className="text-sm" data-oid="dt4cxv:">
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
        data-oid="qceeo:t"
      >
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-hidden"
          data-oid="kamzszp"
        >
          <DialogHeader className="mb-0" data-oid="uodjhan">
            <DialogTitle className="flex items-center gap-2" data-oid="deoeqx.">
              <Folder className="h-5 w-5 text-emerald-600" data-oid="ccwhu5c" />
              {selectedFolder ? selectedFolder : "Select Folder"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2" data-oid="9xdrgro">
            {!selectedFolder ? (
              // Show folders
              <div className="space-y-3" data-oid="ic:-c6-">
                {folders.map((folder) => {
                  const folderProperties = savedProperties.filter(
                    (prop) => prop.folder === folder,
                  );
                  return (
                    <div
                      key={folder}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      data-oid="s34gb97"
                    >
                      <div
                        className="flex items-center gap-3"
                        data-oid="s4xav1p"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleFolderClick(folder)}
                          data-oid="lcrg7gq"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="nl13uz4"
                          >
                            <Folder
                              className="h-5 w-5 text-slate-500"
                              data-oid="il5lszi"
                            />
                            <div className="flex-1" data-oid="l3f7646">
                              <div
                                className="text-sm font-medium text-slate-900"
                                data-oid="okhqrh6"
                              >
                                {folder}
                              </div>
                              <div
                                className="text-xs text-slate-500"
                                data-oid="9.0fct7"
                              >
                                {folderProperties.length} properties
                              </div>
                            </div>
                            <ChevronRight
                              className="h-4 w-4 text-slate-400"
                              data-oid="7j2qz7b"
                            />
                          </div>
                        </div>
                        <DropdownMenu data-oid="mibdr4p">
                          <DropdownMenuTrigger asChild data-oid="t21481h">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              data-oid="gut9dfu"
                            >
                              <MoreHorizontal
                                className="h-4 w-4"
                                data-oid="f7ls:7s"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" data-oid="5_dfgy2">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRename("folder", folder, folder)
                              }
                              data-oid="89:dpdb"
                            >
                              <Edit
                                className="mr-2 h-4 w-4"
                                data-oid="s2mbvd5"
                              />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete("folder", folder, folder)
                              }
                              className="text-red-600"
                              data-oid="bbrgu6f"
                            >
                              <Trash2
                                className="mr-2 h-4 w-4"
                                data-oid="r23zek9"
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
                  data-oid="vq3sgu6"
                >
                  <Plus
                    className="h-5 w-5 text-emerald-600 mx-auto mb-2"
                    data-oid="_w:z.eo"
                  />
                  <span
                    className="text-sm text-emerald-600 font-medium"
                    data-oid="aflzxi4"
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
                  data-oid="h19x25i"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToFolders}
                    className="text-slate-600 hover:text-slate-900"
                    data-oid="1:qcvnw"
                  >
                    <ChevronRight
                      className="h-4 w-4 rotate-180 mr-1"
                      data-oid="tfeva.1"
                    />
                    Back to Folders
                  </Button>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                  data-oid="70uqyrv"
                >
                  <TabsList
                    className="grid w-full grid-cols-3"
                    data-oid=".o-m7eq"
                  >
                    <TabsTrigger value="all" data-oid="3m-b16w">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="BUC" data-oid="zwy:anj">
                      BUC
                    </TabsTrigger>
                    <TabsTrigger value="Resale" data-oid="d:6d7nr">
                      Resale
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4" data-oid="xy7nlj7">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="s72gggv"
                    >
                      {getFilteredProperties("all").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="v751w_w"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="03:3go."
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="ffe9fjk"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="n7i.14a"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="csvpo0b"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="5j3_71t"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="yumiwc3"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="kotp.xj">
                              <DropdownMenuTrigger asChild data-oid="i.osm73">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="ga5jq7s"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="4k:i5n5"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="1z_vehv"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="2bz6d6p"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="h4v3q5s"
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
                                  data-oid="z-.so0g"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="44p8ap."
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

                  <TabsContent value="BUC" className="mt-4" data-oid="ah-rx3-">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="vj29.mf"
                    >
                      {getFilteredProperties("BUC").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="71bb6mg"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="5pcq1o9"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="gv845yw"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="d_0ynrm"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="g_nwlet"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="6.j4:mk"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="7a8t9.k"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="mm9p8b2">
                              <DropdownMenuTrigger asChild data-oid="qs94780">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="sy5j7.z"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="d68z2l_"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="resi-3g"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid=":11k3pf"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="0r3w5:4"
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
                                  data-oid="3d6solb"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="2t_7eby"
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
                    data-oid="gp3wbl0"
                  >
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="6watmma"
                    >
                      {getFilteredProperties("Resale").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="-nenfzc"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="3t7i977"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="tz6f50."
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="ijugse7"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="ej_qx6r"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="eoo8rb9"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid=":vqtlud"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid=".dp1ky-">
                              <DropdownMenuTrigger asChild data-oid="3lz32vv">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="uu:6r1t"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="xou79::"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="qplp_ei"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="8cby780"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="al2.j:s"
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
                                  data-oid="-wv8jo5"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="3b4r8kn"
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
        data-oid="z3dkltm"
      >
        <DialogContent className="sm:max-w-md" data-oid="fbv82w5">
          <DialogHeader data-oid="vj.vq:l">
            <DialogTitle data-oid="9l486o9">
              Rename {itemToRename?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="syt4u21">
            <div data-oid="6.dosw9">
              <Label htmlFor="newName" data-oid="hux-xaf">
                New Name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter new ${itemToRename?.type} name`}
                className="mt-2"
                data-oid="pujnnms"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="m79zw4y">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                data-oid="7dsyxfp"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRename}
                disabled={!newName.trim()}
                data-oid="5ixkrtr"
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
        data-oid="0b:su6p"
      >
        <DialogContent className="sm:max-w-md" data-oid="bjvmu0t">
          <DialogHeader data-oid="ag:yaky">
            <DialogTitle data-oid="h7a_hfx">
              Delete {itemToDelete?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="v15m1xu">
            <p className="text-slate-600" data-oid="5_04kqy">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2" data-oid="dn-fgr_">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                data-oid="bii4_5r"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                data-oid="8u1bwar"
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
        data-oid="qd6maj0"
      >
        <DialogContent className="sm:max-w-md" data-oid="0qc32bc">
          <DialogHeader data-oid=":2.hjco">
            <DialogTitle data-oid="6iaklm5">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="5_90go:">
            <div data-oid="aay00li">
              <Label htmlFor="newFolderName" data-oid="19nwe_d">
                Folder Name
              </Label>
              <Input
                id="newFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-2"
                data-oid="j5b.jf."
              />

              {newFolderName.trim() &&
                folders.includes(newFolderName.trim()) && (
                  <div
                    className="text-xs text-red-600 italic mt-1"
                    data-oid="p0fk6.f"
                  >
                    A folder with this name already exists. Please choose a
                    different name.
                  </div>
                )}
            </div>
            <div className="flex justify-end space-x-2" data-oid="btzf0ru">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderDialogOpen(false)}
                data-oid="3pvnd4s"
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
                data-oid="-y15g.t"
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
