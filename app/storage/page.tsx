"use client";

import SButton from "@/components/GenerateButton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CirclePlus, EllipsisVertical, File, FileSpreadsheet, FileText, Folder, Frame, Headphones, Image as ImgLogo, InspectionPanel, LayoutGrid, LayoutList, Maximize2, Maximize2Icon, MessageCircle, Minimize2, Minimize2Icon, SquareChevronLeft, SquareChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [menu, setMenu] = useState(true);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("contain");


  return (
    <div className="p-6 w-full text-sm">

      <div className="flex">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold mb-1">Storage</h1>
              <span className="font-mono text-sm bg-primary/25">root / coba aja / mygames / minecraft</span>
              <div className="w-fit mt-2">
                <SButton>
                  <CirclePlus size={16} />
                  <span>Upload</span>
                </SButton>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
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

          {/* <div className={cn("mt-6", layout === "grid" ? "grid grid-cols-4 gap-4" : "flex flex-col gap-2")}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <div key={item} className={cn("p-4 border rounded-md hover:shadow-md transition-shadow", layout === "grid" ? "flex flex-col items-center" : "flex items-center gap-4")}>
                <div className={cn("bg-gray-200 rounded-md mb-2", layout === "grid" ? "p-6" : "p-4")}>
                  <Folder className="size-8 text-yellow-500" />
                </div>
                <span className="font-medium text-center">Folder {item}</span>
              </div>
            ))}
          </div> */}

          <div className={cn(menu ? "grid grid-cols-3 gap-4" : "grid grid-cols-4 gap-4")}>
            <div className="flex flex-col">
              <div className="flex justify-between items-center rounded-xl rounded-b-none border border-black py-3 px-5 bg-secondary">
                <div className="flex gap-2 items-center">
                  <Folder style={{
                    stroke: "none",
                    fill: "var(--primary)", // jika icon support fill
                  }} />
                  <span className="font-medium truncate w-40">Folder Name</span>
                </div>

                <EllipsisVertical size={20} />
              </div>

              <div className="relative h-32 w-full overflow-hidden border-x border-black group">
                <Image
                  src="https://placehold.co/40x40.jpg"
                  alt="placeholder"
                  fill
                  className={`transition-all duration-300 object-${fitMode} object-center`}
                />

                {/* Toggle button, only visible on hover */}
                <button
                  onClick={() => setFitMode(fitMode === "contain" ? "cover" : "contain")}
                  className="absolute bottom-2 right-2 z-10 text-xs bg-primary/25 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {fitMode === "contain" ? <Maximize2Icon size={15} /> : <Minimize2Icon size={15} />}
                </button>
              </div>
              <div className="flex justify-between items-center rounded-xl rounded-t-none border border-black py-3 px-5 bg-secondary">
                <div className="flex gap-2 items-center">
                  <Image
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    width={20}
                    height={20}
                    className="w-6 h-6 rounded-full border border-primary cursor-pointer"
                  />
                  <span className="font-medium truncate w-40">Shiroko sunaookami</span>
                </div>

                <div className="flex">
                  <Frame size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {menu && (
          <div className="w-64 bg-gray-50 border-l p-4 ml-6">
            <h2 className="font-bold mb-4">Menu</h2>
            <ul className="space-y-2">
              <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">All Files</li>
              <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">Recent</li>
              <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">Starred</li>
              <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">Trash</li>
            </ul>
          </div>
        )}
      </div>
    </div>

  );
}
