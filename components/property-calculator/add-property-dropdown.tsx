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
        data-oid="wltwvjx"
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
        data-oid=".0csq3o"
      >
        <DropdownMenuTrigger asChild disabled={disabled} data-oid="e49xlkm">
          <Button
            size="sm"
            className={`h-8 md:h-9 gap-2 text-sm ${disabled ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            disabled={disabled}
            title={
              disabled
                ? "Maximum 3 properties reached"
                : "Add a new property to compare"
            }
            data-oid="_8ce410"
          >
            <Plus className="h-4 w-4" data-oid="a-kgsc:" />
            {disabled ? "Max Reached" : "Add Property"}
            <ChevronDown className="h-4 w-4" data-oid="82m9iqq" />
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
          data-oid="_369-fp"
        >
          {/* From Saved Folder */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleOpenSavedFolderDialog}
            data-oid="ue-se.:"
          >
            <Folder className="mr-2 h-4 w-4" data-oid="jugo8v." />
            <span data-oid="-xzkip4">From Saved Folder</span>
          </DropdownMenuItem>

          {/* Create New Entry with Submenu */}
          <div className="relative" data-oid="1yb5l4a">
            <DropdownMenuItem
              className="cursor-pointer relative"
              onMouseEnter={() => {
                setIsHoveringSub(true);
                setOpenSubmenu("new-entry");
              }}
              onMouseLeave={() => {
                // Don't immediately close submenu, let the submenu's own mouse events handle it
              }}
              data-oid="7z.9szp"
            >
              <FileText className="mr-2 h-4 w-4" data-oid="ew176c." />
              <span data-oid="91yqpc2">Create New Entry</span>
              <ChevronRight className="ml-auto h-4 w-4" data-oid="qh7i.hv" />
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
                data-oid="omn0ndt"
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
                  data-oid="updut3n"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-orange-500"
                    data-oid="m6.c.k1"
                  />

                  <span className="text-sm" data-oid="h7ec5l-">
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
                  data-oid="js:ayeb"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-green-500"
                    data-oid="_kmnb_k"
                  />

                  <span className="text-sm" data-oid="z8g9-a9">
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
        data-oid="z-y.z-s"
      >
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-hidden"
          data-oid="n0sdlnd"
        >
          <DialogHeader className="mb-0" data-oid="2boj73z">
            <DialogTitle className="flex items-center gap-2" data-oid="pvco0s7">
              <Folder className="h-5 w-5 text-emerald-600" data-oid="6mvgl_4" />
              {selectedFolder ? selectedFolder : "Select Folder"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2" data-oid="urpk-ti">
            {!selectedFolder ? (
              // Show folders
              <div className="space-y-3" data-oid=".j375ap">
                {folders.map((folder) => {
                  const folderProperties = savedProperties.filter(
                    (prop) => prop.folder === folder,
                  );
                  return (
                    <div
                      key={folder}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      data-oid="0ymgcex"
                    >
                      <div
                        className="flex items-center gap-3"
                        data-oid="igq2wxx"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleFolderClick(folder)}
                          data-oid="w2a9vk1"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid=":wh63of"
                          >
                            <Folder
                              className="h-5 w-5 text-slate-500"
                              data-oid="lc2rep4"
                            />

                            <div className="flex-1" data-oid="09d4ux4">
                              <div
                                className="text-sm font-medium text-slate-900"
                                data-oid="emtdehw"
                              >
                                {folder}
                              </div>
                              <div
                                className="text-xs text-slate-500"
                                data-oid="4fu5aj-"
                              >
                                {folderProperties.length} properties
                              </div>
                            </div>
                            <ChevronRight
                              className="h-4 w-4 text-slate-400"
                              data-oid="i6fpk3c"
                            />
                          </div>
                        </div>
                        <DropdownMenu data-oid="trkshbu">
                          <DropdownMenuTrigger asChild data-oid="lyijege">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              data-oid="s7m1zs6"
                            >
                              <MoreHorizontal
                                className="h-4 w-4"
                                data-oid="ofl93l7"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" data-oid="y6-kyh5">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRename("folder", folder, folder)
                              }
                              data-oid="06eo7_r"
                            >
                              <Edit
                                className="mr-2 h-4 w-4"
                                data-oid="h853ra4"
                              />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete("folder", folder, folder)
                              }
                              className="text-red-600"
                              data-oid="mw2t_qj"
                            >
                              <Trash2
                                className="mr-2 h-4 w-4"
                                data-oid="7tlzhmh"
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
                  data-oid="pn:hwp3"
                >
                  <Plus
                    className="h-5 w-5 text-emerald-600 mx-auto mb-2"
                    data-oid="z6po-jm"
                  />

                  <span
                    className="text-sm text-emerald-600 font-medium"
                    data-oid="5:_gnxv"
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
                  data-oid="hef3ql5"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToFolders}
                    className="text-slate-600 hover:text-slate-900"
                    data-oid="j31b63d"
                  >
                    <ChevronRight
                      className="h-4 w-4 rotate-180 mr-1"
                      data-oid="1s2q0.y"
                    />
                    Back to Folders
                  </Button>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                  data-oid="1ml5mdm"
                >
                  <TabsList
                    className="grid w-full grid-cols-3"
                    data-oid="mug3ifh"
                  >
                    <TabsTrigger value="all" data-oid="frq4exf">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="BUC" data-oid="6u.c971">
                      BUC
                    </TabsTrigger>
                    <TabsTrigger value="Resale" data-oid="6ps3zrf">
                      Resale
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4" data-oid="dr11mld">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="v37x-r1"
                    >
                      {getFilteredProperties("all").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="6kd0-.3"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="xkkb5.."
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="948l_7x"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="f97-_me"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="d.o907a"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="ns2:rmd"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="awx0:87"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="lctt24f">
                              <DropdownMenuTrigger asChild data-oid="8u56tmr">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="tg9zs0:"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="4ojxd6p"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="kxjjtc2"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="809a_ih"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="07jl5ud"
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
                                  data-oid="31sgm35"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="r5zqzfh"
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

                  <TabsContent value="BUC" className="mt-4" data-oid="cwh631j">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="jlag412"
                    >
                      {getFilteredProperties("BUC").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="n7kg3:c"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="qye8803"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="x5m7kuc"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="8_-5tgw"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="_c4dmkg"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="z3gu-89"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="5ynrvs3"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="vksgpc-">
                              <DropdownMenuTrigger asChild data-oid="v6z40md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="blmqbx3"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="j7c8w6j"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="r32wp0k"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="ctq6z4j"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="3s_jdy0"
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
                                  data-oid="8y-_85q"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="gd2wvpw"
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
                    data-oid="v7nj.wc"
                  >
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="5ys.4qx"
                    >
                      {getFilteredProperties("Resale").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="ytj6yrf"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="sowa-w2"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="4t1ig1c"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="rl51io3"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="572ysps"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="nk0u5.n"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="anp.97t"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="d79zmt0">
                              <DropdownMenuTrigger asChild data-oid="iol-gfa">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="gt5m_6_"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="730.ncu"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="evldydl"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="3z1zvzr"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="da-8vrf"
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
                                  data-oid="d:2:5.c"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="w9t80l0"
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
        data-oid="zrs-fxg"
      >
        <DialogContent className="sm:max-w-md" data-oid="gm81qsk">
          <DialogHeader data-oid="5e5czrm">
            <DialogTitle data-oid="fsoubde">
              Rename {itemToRename?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid=":quico8">
            <div data-oid=":f9zrpe">
              <Label htmlFor="newName" data-oid="2z9nifo">
                New Name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter new ${itemToRename?.type} name`}
                className="mt-2"
                data-oid=".0hc_3r"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="z_zimbs">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                data-oid="7e5nlm0"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRename}
                disabled={!newName.trim()}
                data-oid="19jf6gg"
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
        data-oid="0j_b4zm"
      >
        <DialogContent className="sm:max-w-md" data-oid="npxwono">
          <DialogHeader data-oid="_gz-5v1">
            <DialogTitle data-oid="dsaw.5u">
              Delete {itemToDelete?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="z51aqbe">
            <p className="text-slate-600" data-oid="hjfldt8">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2" data-oid="worib8u">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                data-oid="a:-tk8w"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                data-oid="wgix7x2"
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
        data-oid="lf9kble"
      >
        <DialogContent className="sm:max-w-md" data-oid="bz6iy0k">
          <DialogHeader data-oid="0cb343f">
            <DialogTitle data-oid="9r7:c2n">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="0q6ao91">
            <div data-oid="vvn-0..">
              <Label htmlFor="newFolderName" data-oid=":s-dqbj">
                Folder Name
              </Label>
              <Input
                id="newFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-2"
                data-oid="vuj8kl_"
              />

              {newFolderName.trim() &&
                folders.includes(newFolderName.trim()) && (
                  <div
                    className="text-xs text-red-600 italic mt-1"
                    data-oid="vvl:xli"
                  >
                    A folder with this name already exists. Please choose a
                    different name.
                  </div>
                )}
            </div>
            <div className="flex justify-end space-x-2" data-oid="u82o00_">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderDialogOpen(false)}
                data-oid="hn_3lye"
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
                data-oid="qc3_wi5"
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
