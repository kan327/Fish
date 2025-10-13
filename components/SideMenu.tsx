"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Folder, Grid, MessageSquare, X, FileText, FishSymbol, MessageCircle, Send, Forward, ArrowBigUp, Info, SquareArrowOutUpRight, Ship, ArrowBigDown, Eye, Container, Maximize2Icon, Minimize2Icon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // ← shadcn UI
import { cn, getFileType } from "@/lib/utils"; // opsional jika kamu pakai helper cn()
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Link from "next/link";
import axios from "axios";
import { FSNode } from "@/lib/fs-utils";
import { FileIcon, FilePreview } from "./FilePreview";
import { Skeleton } from "./ui/skeleton";

export type FsDetail = {
  url: string;            // URL untuk akses file via browser
  name: string;           // Nama file/folder (tanpa path)
  ext: string;            // Ekstensi file, atau "" jika folder
  size: string;           // Sudah diformat (contoh: "1.2 MB")
  createdAt: string;      // ISO string tanggal (nanti bisa di-parse ke Date)
  modifiedAt: string;     // ISO string juga
  isDirectory: boolean;   // true jika folder
  isFile: boolean;        // true jika file
}


export default function SideMenu({
  setMenu,
  selectedNode
}: {
  setMenu: (value: boolean) => void,
  selectedNode: string | null
}) {
  const [activeTab, setActiveTab] = useState<"files" | "ocean" | "chat">("files");
  const [detail, setDetail] = useState<FsDetail | null>(null);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("contain");
  const [loadingDetail, setLoadingDetail] = useState(false);

  const FetchDetail = async () => {
    if (!selectedNode) return;
    try {
      setLoadingDetail(true);
      const res = await axios.get("/api/fs/details", {
        params: { p: selectedNode }
      });
      setDetail(res.data);
      setLoadingDetail(false);
    } catch (err) {
      console.error("Failed to fetch details:", err);
      setDetail(null);
    }
    setLoadingDetail(false);
  };


  useEffect(() => {
    FetchDetail();
  }, [selectedNode]);


  return (
    <div className="sticky top-5 w-[320px] h-[560px] bg-white shadow-xl rounded-2xl border border-secondary flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{loadingDetail ? "loading..." : detail ? detail.name : "Fish"}</h2>
        <button className="text-muted-foreground hover:text-gray-600 transition cursor-pointer" onClick={() => setMenu(false)}>
          <X size={20} />
        </button>
      </div>

      {/* Folder Icon */}
      <div className="flex flex-col h-32 items-center justify-center border-b border-gray-100">
        {detail ? (
          loadingDetail ? (
            <div className="w-full h-full flex flex-col space-y-2 p-2">
              <Skeleton className="h-32 p-2 w-full rounded-lg" />
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden group">
              <FilePreview className="fill-accent stroke-white" url={detail.url} fileName={detail.name} fitMode={fitMode} isFolder={detail.isDirectory} />
              {(getFileType(detail.name) === "image" || getFileType(detail.name) === "video") && (
                <button
                  onClick={() => setFitMode(fitMode === "contain" ? "cover" : "contain")}
                  className="cursor-pointer absolute bottom-2 right-2 z-10 text-xs bg-primary/25 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {fitMode === "contain" ? <Maximize2Icon size={15} /> : <Minimize2Icon size={15} />}
                </button>
              )}
            </div>
          )
        ) : (
          <>
            <Ship size={80} style={{
              stroke: "var(--primary)",
            }} />
            <p>Select Your Fish!</p>
          </>
        )}
      </div>

      {/* Toggle Group Navigation */}
      <ToggleGroup
        type="single"
        value={activeTab}
        onValueChange={(val) => val && setActiveTab(val as typeof activeTab)}
        className="grid grid-cols-3 border-b border-gray-100 w-full"
      >
        <ToggleGroupItem
          value="files"
          className={cn(
            "flex justify-center py-5 cursor-pointer !rounded-none data-[state=on]:border-b-2 data-[state=on]:border-primary"
          )}
        >
          <Folder size={25} />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="ocean"
          className={cn(
            "flex justify-center py-5 cursor-pointer !rounded-none data-[state=on]:border-b-2 data-[state=on]:border-primary"
          )}
        >
          <Ship size={35} />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="chat"
          className={cn(
            "flex justify-center py-5 cursor-pointer !rounded-none data-[state=on]:border-b-2 data-[state=on]:border-primary"
          )}
        >
          <MessageCircle size={25} />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {activeTab === "files" && (
          loadingDetail ? (
            <div className="flex flex-col space-y-3 px-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ) : detail ? (
            <div className="flex flex-col space-y-3 px-2">
              <h3 className="font-bold text-base mb-5 flex gap-1 items-center">
                {detail?.isDirectory ? (
                  <Folder size={20} />
                ) : (
                  <FileIcon fileName={detail.name} isFolder={false} className="stroke-gray-800" />
                )}
                Detail {detail?.isDirectory ? "Folder" : "File"}
              </h3>

              <div>
                <p className="font-semibold">Name</p>
                <p className="w-full break-words overflow-hidden">{detail.name}</p>
              </div>

              <div>
                <p className="font-semibold">Path</p>
                <p className="w-full break-words overflow-hidden">{detail.url.startsWith('/storage') ? detail.url.slice(8) : detail.url}</p>
              </div>

              <div>
                <p className="font-semibold">Size</p>
                <p>{detail.size}</p>
              </div>

              <div>
                <p className="font-semibold">Type</p>
                <p>{detail.isDirectory ? "Fish Folder" : `${detail.ext || "Unknown"} File`}</p>
              </div>

              <div>
                <p className="font-semibold">Owner</p>
                <div className="flex items-center gap-2 mt-1">
                  <Image
                    src="https://i.pravatar.cc/40"
                    alt="user"
                    width={25}
                    height={25}
                    className="rounded-full border border-primary"
                  />
                  <p>You</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Status</p>
                <p className="flex items-center gap-2">
                  Not released Yet / Private Access <Info size={15} />
                </p>
              </div>

              <div>
                <p className="font-semibold">Created At</p>
                <p className="flex items-center gap-2">
                  {new Date(detail.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}{" "}
                  | By You.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No file or folder selected.
            </p>
          )
        )}

        {activeTab === "ocean" && (
          <div className="flex flex-col space-y-3 px-2">
            <h3 className="font-bold text-base mb-5 flex items-center gap-1"><Ship /> Ocean</h3>
            <div>
              <p className="font-semibold">Fish Status</p>
              <p>Released</p>
            </div>
            <div>
              <p className="font-semibold">Detail</p>
              <Link href="#" className="text-primary underline flex items-center gap-1"><SquareArrowOutUpRight size={16} /> Open In View Mode</Link>
            </div>
            <div>
              <p className="font-semibold">Engangement</p>
              <div className="flex items-center gap-1">
                <ArrowBigUp size={16} style={{
                  stroke: "var(--primary)",
                  // fill: "var(--primary)", // jika icon support fill
                }} />
                <span>12 Likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} style={{
                  stroke: "var(--primary)",
                  // fill: "var(--primary)", // jika icon support fill
                }} />
                <span>200 Views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} style={{
                  stroke: "var(--primary)",
                  // fill: "var(--primary)", // jika icon support fill
                }} />
                <span>20 Comments</span>
              </div>
            </div>
            <div>
              <p className="font-semibold">Team</p>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src="https://i.pravatar.cc/40"
                  alt="user"
                  width={25}
                  height={25}
                  className="rounded-full border border-primary"
                />
                <p>You (Owner)</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src="https://i.pravatar.cc/40"
                  alt="user"
                  width={25}
                  height={25}
                  className="rounded-full border border-primary"
                />
                <p>Shiroko Sunaookami (Editor)</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src="https://i.pravatar.cc/40"
                  alt="user"
                  width={25}
                  height={25}
                  className="rounded-full border border-primary"
                />
                <p>Kanade Silver (Member)</p>
              </div>
              <p className="text-primary mt-1">See All Team...</p>
            </div>
            <div>
              <p className="font-semibold">Release At</p>
              <p className="flex items-center gap-2">Jan 28, 2025 | By You.</p>
            </div>
            <div>
              <p className="font-semibold">Settings</p>
              <p className="flex items-center gap-1 text-primary underline cursor-pointer">Open In Studio <Container size={15} /></p>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="text-base font-bold flex items-center gap-1"><MessageCircle size={23} /> Chat</h3>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-3 text-sm">
              {/* Chat 1 */}
              <div>
                <div className="flex items-start gap-2 rounded-lg py-1 px-2">
                  <Image
                    src="https://i.pravatar.cc/40"
                    alt="user"
                    width={35}
                    height={35}
                    className="rounded-full border border-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Shiroko Sunaokami{" "}
                      <span className="text-muted-foreground text-xs">(Owner)</span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      hii guys, welcome to our new project!
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <ArrowBigUp size={16} style={{
                        stroke: "var(--primary)",
                        fill: "var(--primary)", // jika icon support fill
                      }} /> <span className="text-primary">12 Like</span> • 12d ago •
                      <Forward size={16} style={{
                        stroke: "var(--primary)",
                        fill: "var(--primary)", // jika icon support fill
                      }} />
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat 2 */}
              <div className="">
                <div className="flex items-start gap-2 bg-secondary rounded-lg py-1 px-2">
                  <Image
                    src="https://i.pravatar.cc/40"
                    alt="user"
                    width={35}
                    height={35}
                    className="rounded-full border border-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Kanade Silver{" "}
                      <span className="text-muted-foreground text-xs">(Member)</span>
                    </p>
                    <p className="text-gray-700 text-sm">zzz...</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowBigUp size={16} /> 2 Like • 1d ago •
                      <Forward size={16} style={{
                        stroke: "var(--primary)",
                        fill: "var(--primary)", // jika icon support fill
                      }} />
                    </p>
                  </div>
                </div>
                {/* Chat 3 */}
                <div className="ml-8">
                  <div className="flex items-start gap-2 rounded-lg py-1 px-2">
                    <Image
                      src="https://i.pravatar.cc/40"
                      alt="user"
                      width={35}
                      height={35}
                      className="rounded-full border border-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        You{" "}
                        <span className="text-muted-foreground text-xs">(Editor)</span>
                      </p>
                      <p className="text-gray-700 text-sm">here we go again</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowBigUp size={16} /> 0 Like • 12s ago •
                        <Forward size={16} style={{
                          stroke: "var(--primary)",
                          fill: "var(--primary)", // jika icon support fill
                        }} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      {activeTab === "chat" && (
        <div className="flex flex-col border-t border-secondary p-2 gap-1.5">
          <span className="text-[12px] text-muted-foreground ml-2 flex gap-1"> <Forward size={12} /> Reply On <span className="text-primary">Kanade Silver</span></span>
          <div className="flex">
            <Input
              type="text"
              placeholder="type here ..."
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <Button className="ml-2 rounded-full p-2">
              <Send />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
