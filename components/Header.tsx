"use client";

import { Bell, MessageCircle, Search } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const Header = () => {
  const [search, setSearch] = useState("");

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
      <div className="relative w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by folder or file name"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <MessageCircle className="text-gray-500 cursor-pointer hover:text-purple-500" />
        <Bell className="text-gray-500 cursor-pointer hover:text-purple-500" />
        <Image
          src="https://i.pravatar.cc/40"
          alt="avatar"
          width={36}
          height={36}
          className="w-9 h-9 rounded-full border-2 border-purple-500 cursor-pointer"
        />
      </div>
    </header>
  )
}

export default Header