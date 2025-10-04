"use client";

import { useState } from "react";
import { Folder, Grid, MessageSquare, X } from "lucide-react";
import Image from "next/image";

export default function SideMenu() {
  const [activeTab, setActiveTab] = useState<"files" | "grid" | "chat">("chat");

  return (
    <aside className="w-[320px] h-[520px] bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Our Folder</h2>
        <button className="text-gray-400 hover:text-gray-600 transition">
          <X size={20} />
        </button>
      </div>

      {/* Folder icon */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100">
        <Folder size={80} className="text-purple-300" />
      </div>

      {/* Navigation icons */}
      <div className="grid grid-cols-3 border-b border-gray-100">
        {[
          { key: "files", icon: <Folder size={20} />, label: "Files" },
          { key: "grid", icon: <Grid size={20} />, label: "Grid" },
          { key: "chat", icon: <MessageSquare size={20} />, label: "Chat" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex justify-center items-center py-3 transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-purple-400 text-purple-600 bg-purple-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {activeTab === "files" && (
          <div className="text-center text-gray-500 text-sm py-12">
            📂 No files uploaded yet.
          </div>
        )}

        {activeTab === "grid" && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs"
              >
                Item {i}
              </div>
            ))}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Chat - On</h3>
              <select className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none">
                <option>All File</option>
                <option>Images</option>
                <option>Docs</option>
              </select>
            </div>

            <div className="flex flex-col space-y-3 text-sm">
              {/* Chat 1 */}
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="https://placehold.co/32x32"
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Shiroko Sunaokami{" "}
                      <span className="text-gray-400 text-xs">(Owner)</span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      hii guys, welcome to our new project!
                    </p>
                    <p className="text-xs text-gray-400">
                      On Our Folder • 5s ago •{" "}
                      <span className="text-purple-500 cursor-pointer">
                        Reply
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat 2 */}
              <div className="bg-purple-50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Image
                    src="https://placehold.co/32x32"
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Kanade Silver{" "}
                      <span className="text-gray-400 text-xs">(Member)</span>
                    </p>
                    <p className="text-gray-700 text-sm">zzz...</p>
                    <p className="text-xs text-gray-400">
                      On Nested Fo • 5s ago •{" "}
                      <span className="text-purple-500 cursor-pointer">
                        Reply
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat 3 */}
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="https://placehold.co/32x32"
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      You{" "}
                      <span className="text-gray-400 text-xs">(Editor)</span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      here we go again
                    </p>
                    <p className="text-xs text-gray-400">
                      On Nested Fo • 5s ago •{" "}
                      <span className="text-purple-500 cursor-pointer">
                        Reply
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Chat (hanya saat tab chat aktif) */}
      {activeTab === "chat" && (
        <div className="border-t border-gray-200 p-2">
          <input
            type="text"
            placeholder="type here ..."
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      )}
    </aside>
  );
}
