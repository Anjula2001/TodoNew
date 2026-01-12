import React from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export function Profile() {
  return (
    <div className="flex items-center justify-between gap-3 p-2 -ml-2 mt-0 mb-6">
      <div className="flex items-center gap-3">
        <Image 
          src="/images/profile.png" 
          alt="profile picture"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-black">User Name</h2>
          <p className="text-xs text-black/70">user@email.com</p>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-black/70" />
    </div>
  )
}