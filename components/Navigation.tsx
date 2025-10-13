"use client";

import axios from 'axios';
import { Bell, Compass, Container, File, FileText, FishSymbol, FolderSymlink, MessageCircle, Pin, Server, Share2, Ship, Trash, Trash2, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FsDetail } from './SideMenu';
import { StorageInfo } from './StorageInfo';

const Navigation = () => {
  const [detail, setDetail] = useState<FsDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const FetchDetail = async () => {
    try {
      setLoadingDetail(true);
      const res = await axios.get("/api/fs/details", {
        params: { p: '/root' }
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
  }, []);

  return (
    <aside className="w-60 border-r border-gray-200 flex flex-col p-4">
      <div className="flex flex-col mb-6 w-fit">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Fi
          <Ship style={{
            stroke: "var(--primary)",
            // fill: "var(--primary)", // jika icon support fill
          }} />
          Sh
        </h1>
        <span className='text-sm font-semibold text-primary flex justify-between'>
          <span>File</span>
          <span>Sharing</span>
        </span>
      </div>
      <nav className="flex-1 space-y-6 text-sm">
        <div>
          <h2 className="font-semibold text-gray-500 mb-2">General</h2>
          <ul className="space-y-2">
            {/* <li className="flex items-center gap-2 hover:text-primary cursor-pointer"> */}
            <li className="flex items-center justify-between text-primary font-bold rounded-md cursor-pointer">
              <div className="flex items-center gap-2">
                <Server size={18} /> Storage
              </div>
              <div className="rounded-full w-3 h-3 bg-primary" />
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Ship size={18} /> Ocean
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Container size={18} /> Studio
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-500 mb-2">Folder</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Pin size={18} /> Pinned
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <FolderSymlink size={18} /> Team
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <File size={18} /> Draft
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Trash size={18} /> Deleted
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-500 mb-2">Account</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <User size={18} /> Profile
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <MessageCircle size={18} /> Message
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Bell size={18} /> Notification
            </li>
          </ul>
        </div>
      </nav>

      {/* Upgrade Box */}
      <StorageInfo refetch={FetchDetail} isLoading={loadingDetail} used={detail && detail.size ? detail.size : '0 KB'} />
    </aside>
  )
}

export default Navigation