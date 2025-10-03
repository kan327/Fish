import { Bell, FileText, MessageCircle, Pin, Share2, Trash2, User } from 'lucide-react'
import React from 'react'

const Navigation = () => {
  return (
    <aside className="w-60 border-r border-gray-200 flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Frama
        <div className="flex gap-1">
          <div className="bg-primary w-2 h-2 rounded-full" />
          <div className="bg-green-500 w-2 h-2 rounded-full" />
          <div className="bg-cyan-500 w-2 h-2 rounded-full" />
        </div>
      </h1>

      <nav className="flex-1 space-y-6 text-sm">
        <div>
          <h2 className="font-semibold text-gray-500 mb-2">General</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <FileText size={18} /> Storage
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Share2 size={18} /> Frame
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <MessageCircle size={18} /> Discover
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
              <Share2 size={18} /> Shared
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <FileText size={18} /> Draft
            </li>
            <li className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <Trash2 size={18} /> Deleted
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
      <div className="mt-auto bg-purple-100 p-3 rounded-xl text-center">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Get More Space ?<br />
          <span className="text-gray-500">
            Upgrade Your Storage Up To 200gb And Unlock Pro Features
          </span>
        </p>
        <button className="w-full bg-primary hover:bg-primary text-white text-sm py-1.5 rounded-lg">
          Upgrade
        </button>
      </div>
    </aside>
  )
}

export default Navigation