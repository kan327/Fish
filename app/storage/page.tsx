"use client";

import SButton from "@/components/GenerateButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, CirclePlus, File, FileSpreadsheet, FileText, Folder, FolderSync, Headphones, Image as ImgLogo, LayoutGrid, LayoutList, RefreshCcw, SquareChevronLeft, SquareChevronRight, X } from "lucide-react";
import CardFs from "@/components/CardFs";
import UploadForm from "@/components/UploadForm";
import SideMenu from "@/components/SideMenu";
import { useEffect, useState } from "react";
import { DirectoryNode } from "@/lib/fs-utils";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";




export default function Dashboard() {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [menu, setMenu] = useState(true);
  const [path, setPath] = useState("/root");
  const [tree, setTree] = useState<DirectoryNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [openUploadForm, setOpenUploadForm] = useState(false);

  // 🧩 Convert "/root/folder1/folder2" → ["root", "folder1", "folder2"]
  const segments = path.split("/").filter(Boolean)

  // 🧠 helper: generate path untuk tiap breadcrumb segment
  const getSegmentPath = (index: number) => {
    const joined = "/" + segments.slice(0, index + 1).join("/")
    return joined
  }

  async function fetchDir(p: string) {
    setLoading(true);
    try {
      const res = await axios.get("/api/fs", {
        params: { p: encodeURIComponent(p) },
      });
      setTree(res.data);
      setPath(p);
      setSelectedNode(p);

      // 🧩 update URL agar bisa di-refresh langsung ke folder ini
      if (p !== "/root") {
        const newUrl = `?p=${encodeURIComponent(p)}`;
        window.history.replaceState(null, "", newUrl);
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }

    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 🧩 baca ?p= dari URL saat reload
    const params = new URLSearchParams(window.location.search);
    const initialPath = params.get("p") ? decodeURIComponent(params.get("p")!) : "/root";
    fetchDir(initialPath);
  }, []);


  return (
    <div className="p-6 w-full text-sm">
      <div className="flex gap-2">
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex justify-between mb-3">
            {/* Left */}
            <div>
              <h1 className="text-xl font-bold mb-1">Storage</h1>
              <div className="flex items-center gap-2 mb-1">
                <Button
                  className="!p-1 rounded-full h-fit border-0 bg-white hover:bg-primary/10"
                  onClick={() => fetchDir(path.split("/").slice(0, -1).join("/") || "/root")}
                >
                  <CircleArrowLeft className="stroke-primary" />
                </Button>
                {loading ? (
                  <Skeleton className="w-32 h-6 rounded-md" />
                ) : (
                  <Breadcrumb>
                    <BreadcrumbList>
                      {segments.map((seg, i) => (
                        <BreadcrumbItem key={i}>
                          <BreadcrumbLink
                            onClick={() => fetchDir(getSegmentPath(i))}
                            className={cn(
                              "font-mono text-sm cursor-pointer hover:text-primary",
                              i === segments.length - 1 && "text-primary font-semibold"
                            )}
                          >
                            {seg}
                          </BreadcrumbLink>
                          {i !== segments.length - 1 && <BreadcrumbSeparator />}
                        </BreadcrumbItem>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                )}
              </div>
              <div className="w-fit mt-2">
                <Dialog open={openUploadForm} onOpenChange={setOpenUploadForm}>
                  <DialogTrigger asChild>
                    <SButton>
                      <CirclePlus size={16} />
                      <span>Upload</span>
                    </SButton>
                  </DialogTrigger>
                  <UploadForm fetchDir={fetchDir} path={path} onOpenChange={setOpenUploadForm} />
                </Dialog>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-2">
              {/* Top */}
              <div className="flex items-center gap-1">
                <Button
                  className="!p-2 rounded-full h-fit border-0 bg-white hover:bg-primary/10 mr-2 group flex items-center gap-1"
                  onClick={() => fetchDir(path.split("/").slice(0, -1).join("/") || "/root")}
                >
                  {/* Span teks dengan animasi */}
                  <span
                    className={cn(
                      "text-[12px] text-primary hidden transition-all duration-300 transform opacity-0 translate-x-[12px]",
                      "group-hover:opacity-100 group-hover:block group-hover:translate-x-0"
                    )}
                  >
                    Reload Directory
                  </span>
                  <RefreshCcw className={cn("stroke-primary transition-transform duration-300 group-hover:rotate-180", loading && "animate-spin")} style={{ animationDuration: "500ms" }} />
                </Button>

                <Button
                  onClick={() => setLayout("grid")}
                  variant="outline"
                  className={cn(layout === "grid" && "text-primary hover:bg-white")}
                >
                  <LayoutGrid /> Grid
                </Button>
                <Button
                  onClick={() => setLayout("list")}
                  variant="outline"
                  className={cn(layout === "list" && "text-primary hover:bg-white")}
                >
                  <LayoutList /> List
                </Button>
                <Button
                  onClick={() => setMenu(!menu)}
                  variant={menu ? "default" : "outline"}
                >
                  {menu ? <SquareChevronRight /> : <SquareChevronLeft />}
                </Button>
              </div>

              {/* Bottom */}
              <div className="flex gap-1">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="folder"> <Folder /> Folder</SelectItem>
                    <SelectItem value="image"> <ImgLogo /> Image</SelectItem>
                    <SelectItem value="dokumen"> <File /> Dokumen</SelectItem>
                    <SelectItem value="pdf"> <FileText /> Pdf</SelectItem>
                    <SelectItem value="spreadsheet"> <FileSpreadsheet /> Spreadsheet</SelectItem>
                    <SelectItem value="audio"> <Headphones /> Audio</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setFilter("")} className="mr-3">
                  <X />
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nama">Nama</SelectItem>
                    <SelectItem value="tanggal">Tanggal</SelectItem>
                    <SelectItem value="ukuran">Ukuran</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSortBy("")}>
                  <X />
                </Button>
              </div>
            </div>
          </div>
          {/* Content */}
          <div
            className={cn(
              "overflow-y-scroll h-[calc(100vh-200px)] pb-2 transition-all duration-300",
              layout === "grid"
                ? menu
                  ? "grid grid-cols-3 gap-4"
                  : "grid grid-cols-4 gap-4"
                : "flex flex-col gap-2"
            )}
            onClick={(e) => {
              // hanya clear kalau klik di luar card
              if (e.target === e.currentTarget) {
                setSelectedNode(path);
              }
            }}
          >
            {/* 🌀 Loading State */}
            {loading ? (
              <>
                <Skeleton className="w-full h-52 rounded-xl" />
                <Skeleton className="w-full h-52 rounded-xl" />
                <Skeleton className="w-full h-52 rounded-xl" />
              </>
            ) : tree?.children?.length === 0 ? (
              // 🪶 Empty State
              <div className="col-span-full flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                <p className="text-sm">📂 Empty Folder</p>
                <p className="text-xs">Click upload to start adding new data</p>
                <SButton className="mt-3" onClick={() => setOpenUploadForm(true)}>
                  <CirclePlus size={16} />
                  <span>Upload</span>
                </SButton>
              </div>
            ) : (
              // 🧩 Normal Content
              tree?.children?.map((child, i) =>
                typeof child === "string" ? (
                  <CardFs
                    path={path}
                    key={i}
                    child={child}
                    fetchDir={fetchDir}
                    layout={layout}
                    isSelected={selectedNode === `${path}/${child}`}
                    onClick={() => setSelectedNode(`${path}/${child}`)}
                  />
                ) : (
                  <CardFs
                    path={path}
                    key={i}
                    child={child}
                    fetchDir={fetchDir}
                    layout={layout}
                    isSelected={selectedNode === `${path}/${child.name}`}
                    onClick={() => setSelectedNode(`${path}/${child.name}`)}
                    onDoubleClick={() => fetchDir(`${path}/${child.name}`)}
                  />
                )
              )
            )}
          </div>

        </div>

        {/* SideMenu */}
        {menu && (
          <SideMenu setMenu={setMenu} selectedNode={selectedNode} />
        )}
      </div>
    </div>
  );
}
