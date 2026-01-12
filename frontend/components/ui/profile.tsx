'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { getUserData } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function Profile() {
  const [userData, setUserData] = useState({ name: 'User Name', email: 'user@email.com' })
  const router = useRouter()

  useEffect(() => {
    // Only access localStorage on the client side
    const data = getUserData()
    if (data.name || data.email) {
      setUserData({
        name: data.name || 'User Name',
        email: data.email || 'user@email.com'
      })
    }
  }, [])

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <div className="flex items-center justify-between gap-3 p-2 -ml-2 mt-0 mb-6">
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleProfileClick}
      >
        <Image 
          src="/images/profile.png" 
          alt="profile picture"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-black"> Hi {userData.name}..!</h2>
          <p className="text-xs text-black/70">{userData.email}</p>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-black/70" />
    </div>
  )
}