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
        data-oid="5rqmyhm"
      >
        <DropdownMenuTrigger asChild disabled={disabled} data-oid="li1j0v8">
          <Button
            size="sm"
            className={`h-8 md:h-9 gap-2 text-sm font-bold ${disabled ? "bg-[#999999] cursor-not-allowed" : "bg-[#B40101] hover:bg-[#9D0101]"}`}
            disabled={disabled}
            title={
              disabled
                ? "Maximum 3 properties reached"
                : "Add a new property to compare"
            }
            data-oid="qshbspp"
          >
            <Plus className="h-4 w-4" data-oid="c7pcjmh" />
            {disabled ? "Max Reached" : "Add Property"}
            <ChevronDown className="h-4 w-4" data-oid="jk__ljn" />
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
          data-oid="nuz_0pd"
        >
          {/* From Saved Folder */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleOpenSavedFolderDialog}
            data-oid="5.-nv:9"
          >
            <Folder className="mr-2 h-4 w-4" data-oid="syquy_o" />
            <span data-oid="re-_58o">From Saved Folder</span>
          </DropdownMenuItem>

          {/* Create New Entry with Submenu */}
          <div className="relative" data-oid="3qx9wq_">
            <DropdownMenuItem
              className="cursor-pointer relative"
              onMouseEnter={() => {
                setIsHoveringSub(true);
                setOpenSubmenu("new-entry");
              }}
              onMouseLeave={() => {
                // Don't immediately close submenu, let the submenu's own mouse events handle it
              }}
              data-oid="cf:_f5t"
            >
              <FileText className="mr-2 h-4 w-4" data-oid="448y.xn" />
              <span data-oid="y9etn47">Create New Entry</span>
              <ChevronRight className="ml-auto h-4 w-4" data-oid="m3-sfzp" />
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
                data-oid="elxqq.-"
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
                  data-oid="pgav8id"
                >
                  <img
                    src="/buc.png"
                    alt="BUC"
                    className="w-6 h-6"
                    data-oid="buc-icon"
                  />

                  <span className="text-sm" data-oid="21oql1i">
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
                  data-oid="29_w6m1"
                >
                  <img
                    src="/resale.png"
                    alt="Resale"
                    className="w-6 h-6"
                    data-oid="resale-icon"
                  />

                  <span className="text-sm" data-oid="h4udmnk">
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
        data-oid="bl6h5ll"
      >
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] overflow-hidden"
          data-oid="1laomfb"
        >
          <DialogHeader className="mb-0" data-oid="ls791:z">
            <DialogTitle className="flex items-center gap-2" data-oid="r47arax">
              <Folder className="h-5 w-5 text-emerald-600" data-oid="kkrlpym" />
              {selectedFolder ? selectedFolder : "Select Folder"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2" data-oid="k46z7nx">
            {!selectedFolder ? (
              // Show folders
              <div className="space-y-3" data-oid="pbuuedl">
                {folders.map((folder) => {
                  const folderProperties = savedProperties.filter(
                    (prop) => prop.folder === folder,
                  );
                  return (
                    <div
                      key={folder}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      data-oid="bndmh6f"
                    >
                      <div
                        className="flex items-center gap-3"
                        data-oid=".wtg3ck"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleFolderClick(folder)}
                          data-oid="sqf19-y"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="h3t.l50"
                          >
                            <Folder
                              className="h-5 w-5 text-slate-500"
                              data-oid="n54b-wi"
                            />

                            <div className="flex-1" data-oid="q6c8k7u">
                              <div
                                className="text-sm font-medium text-slate-900"
                                data-oid="7g_:c83"
                              >
                                {folder}
                              </div>
                              <div
                                className="text-xs text-slate-500"
                                data-oid="v54aueu"
                              >
                                {folderProperties.length} properties
                              </div>
                            </div>
                            <ChevronRight
                              className="h-4 w-4 text-slate-400"
                              data-oid="9a_aamh"
                            />
                          </div>
                        </div>
                        <DropdownMenu data-oid="a1c-20k">
                          <DropdownMenuTrigger asChild data-oid="hb8_-c_">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              data-oid="bkcyhas"
                            >
                              <MoreHorizontal
                                className="h-4 w-4"
                                data-oid="kvq_g_v"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" data-oid="2vfqtzf">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRename("folder", folder, folder)
                              }
                              data-oid="33t3m1b"
                            >
                              <Edit
                                className="mr-2 h-4 w-4"
                                data-oid="frpllsq"
                              />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete("folder", folder, folder)
                              }
                              className="text-red-600"
                              data-oid="p4vlni6"
                            >
                              <Trash2
                                className="mr-2 h-4 w-4"
                                data-oid="1el08co"
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
                  data-oid="kt3y:u7"
                >
                  <Plus
                    className="h-5 w-5 text-emerald-600 mx-auto mb-2"
                    data-oid="pdval29"
                  />

                  <span
                    className="text-sm text-emerald-600 font-medium"
                    data-oid=".pu:o.7"
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
                  data-oid="_dh6ezc"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToFolders}
                    className="text-slate-600 hover:text-slate-900"
                    data-oid="_tdtxkv"
                  >
                    <ChevronRight
                      className="h-4 w-4 rotate-180 mr-1"
                      data-oid="svjn6tu"
                    />
                    Back to Folders
                  </Button>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                  data-oid="qhupafq"
                >
                  <TabsList
                    className="grid w-full grid-cols-3"
                    data-oid="jwgm1.c"
                  >
                    <TabsTrigger value="all" data-oid="allt-m.">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="BUC" data-oid="6prys7x">
                      BUC
                    </TabsTrigger>
                    <TabsTrigger value="Resale" data-oid="i0f9114">
                      Resale
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4" data-oid="ggayc1z">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="n54655z"
                    >
                      {getFilteredProperties("all").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="jj3del6"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="jenxy8f"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="4ck5nvv"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="r6mhuuc"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="i-gp:dd"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="he0id-k"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="..u7djw"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="i2vxr2u">
                              <DropdownMenuTrigger asChild data-oid="1lt16ad">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="47w2_qq"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="5v8ba1-"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="sb::g4f"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="26iq5-i"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="hn6ujk1"
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
                                  data-oid="_10m27k"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="fzhfqdt"
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

                  <TabsContent value="BUC" className="mt-4" data-oid="yiz3.-y">
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="c6nfs01"
                    >
                      {getFilteredProperties("BUC").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="o-ejwjr"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="e.7lcdr"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="3pfkp:j"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="-583euf"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="9flmg9w"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="_3j91hd"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="qvcgpiv"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="5xtfoy3">
                              <DropdownMenuTrigger asChild data-oid="yo7urkb">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="6esb7zt"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="2qst5mt"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="73sjds_"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="y6o1d6u"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="fgt3nof"
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
                                  data-oid="-nneea_"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="t_rjcfm"
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
                    data-oid="j408cbj"
                  >
                    <div
                      className="space-y-2 max-h-96 overflow-y-auto"
                      data-oid="ht5:220"
                    >
                      {getFilteredProperties("Resale").map((property) => (
                        <div
                          key={property.id}
                          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          data-oid="0ur_3e8"
                        >
                          <div
                            className="flex items-center gap-3"
                            data-oid="jhrl0b7"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleFromSavedFolder(property)}
                              data-oid="73aud59"
                            >
                              <div
                                className="flex items-center gap-3"
                                data-oid="e7pgbn1"
                              >
                                {getPropertyIcon(property.type)}
                                <div
                                  className="flex-1 min-w-0"
                                  data-oid="ia:nc-k"
                                >
                                  <div
                                    className="text-sm font-medium text-slate-900"
                                    data-oid="83m5pmx"
                                  >
                                    {property.name}
                                  </div>
                                  <div
                                    className="text-xs text-slate-500"
                                    data-oid="2j7jgwn"
                                  >
                                    {property.type} -{" "}
                                    {formatPrice(property.price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu data-oid="b7.putr">
                              <DropdownMenuTrigger asChild data-oid="760dh_k">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  data-oid="lcp:wxi"
                                >
                                  <MoreHorizontal
                                    className="h-4 w-4"
                                    data-oid="vwm7wpk"
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                data-oid="2z0w7w0"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(
                                      "property",
                                      property.id,
                                      property.name,
                                    )
                                  }
                                  data-oid="forzqq5"
                                >
                                  <Edit
                                    className="mr-2 h-4 w-4"
                                    data-oid="17igoec"
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
                                  data-oid="y.g6nnp"
                                >
                                  <Trash2
                                    className="mr-2 h-4 w-4"
                                    data-oid="0vygayc"
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
        data-oid="3l-.zp1"
      >
        <DialogContent className="sm:max-w-md" data-oid="2wkxrf8">
          <DialogHeader data-oid="dzmkcyq">
            <DialogTitle data-oid="hk0imfd">
              Rename {itemToRename?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="1mzijub">
            <div data-oid="r6we:sq">
              <Label htmlFor="newName" data-oid="6r2j5bg">
                New Name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Enter new ${itemToRename?.type} name`}
                className="mt-2"
                data-oid="__xcdz:"
              />
            </div>
            <div className="flex justify-end space-x-2" data-oid="yyazi.4">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                data-oid="1s3.hf7"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRename}
                disabled={!newName.trim()}
                data-oid="aegk_ii"
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
        data-oid="gyjs1zs"
      >
        <DialogContent className="sm:max-w-md" data-oid="xuhold2">
          <DialogHeader data-oid="n_bguvs">
            <DialogTitle data-oid="owg08o8">
              Delete {itemToDelete?.type === "folder" ? "Folder" : "Property"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="gekmo84">
            <p className="text-slate-600" data-oid="_n5cxil">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2" data-oid="hji:v7k">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                data-oid="aeul.w9"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                data-oid="xreozs8"
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
        data-oid="kxrllm3"
      >
        <DialogContent className="sm:max-w-md" data-oid="6qe8s0h">
          <DialogHeader data-oid="7xjq345">
            <DialogTitle data-oid="fskj9nl">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-oid="pzoc38v">
            <div data-oid="0zafyd9">
              <Label htmlFor="newFolderName" data-oid="kf37mp2">
                Folder Name
              </Label>
              <Input
                id="newFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-2"
                data-oid=".n6eu_r"
              />

              {newFolderName.trim() &&
                folders.includes(newFolderName.trim()) && (
                  <div
                    className="text-xs text-red-600 italic mt-1"
                    data-oid="e3jgxhr"
                  >
                    A folder with this name already exists. Please choose a
                    different name.
                  </div>
                )}
            </div>
            <div className="flex justify-end space-x-2" data-oid="1wqj1e9">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderDialogOpen(false)}
                data-oid="_xq7fkx"
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
                data-oid="m0-:ptl"
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
