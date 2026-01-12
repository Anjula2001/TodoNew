"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User,
  Camera,
  Upload
} from "lucide-react"

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>("/placeholder-user.jpg")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your API call here
    console.log("Updating account:", { name, email, profileImage })
    alert("Account updated successfully!")
  }

  return (
    <div>
      <div className="min-h-screen w-full bg-white font-sans">
        <main className="p-12 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            
            <h1 className="text-3xl font-bold text-[#1e293b] mb-10">Profile Settings</h1>

          <Tabs defaultValue="account" className="w-full">
            
            <TabsList className="bg-transparent p-0 gap-4 h-auto flex justify-start mb-10 w-full">
              <TabsTrigger 
                value="account" 
                className="w-40 py-2.5 rounded-xl text-base shadow-sm border border-slate-100
                data-[state=active]:bg-[#9EE2CE] data-[state=active]:text-slate-800 data-[state=active]:shadow-md
                data-[state=inactive]:bg-white data-[state=inactive]:text-slate-600"
              >
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-40 py-2.5 rounded-xl text-base shadow-sm border border-slate-100
                data-[state=active]:bg-[#9EE2CE] data-[state=active]:text-slate-800 data-[state=active]:shadow-md
                data-[state=inactive]:bg-white data-[state=inactive]:text-slate-600"
              >
                Security
              </TabsTrigger>
            </TabsList>            <TabsContent value="account" className="space-y-8 mt-0">
              <form onSubmit={handleAccountUpdate} className="space-y-8">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-200">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-[#1ABC9C]">
                      <AvatarImage src={profileImage} alt="Profile" />
                      <AvatarFallback className="bg-[#C1E8D5] text-[#1ABC9C] text-4xl">
                        <User size={48} />
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-[#1ABC9C] hover:bg-[#16a085] text-white p-2.5 rounded-full shadow-lg transition-all group-hover:scale-110"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="gap-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C]/10"
                    >
                      <Upload size={16} />
                      Upload Photo
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setProfileImage("/placeholder-user.jpg")}
                      variant="outline"
                      className="text-slate-600 hover:bg-slate-100"
                    >
                      Remove
                    </Button>
                  </div>
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-600 font-medium">Name</Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="User Name" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-600 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white w-40 h-11 rounded-xl text-md shadow-lg shadow-emerald-100">
                    Update
                  </Button>
                </div>
              </form>
            </TabsContent>            <TabsContent value="security" className="space-y-8 mt-0">
              <form onSubmit={(e) => {
                e.preventDefault()
                // Add password change logic here
                alert("Password changed successfully!")
              }} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-slate-600 font-medium">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    placeholder="Enter current password" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                  />
                </div>              <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-slate-600 font-medium">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    placeholder="Enter new password" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                  />
                </div>              <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-600 font-medium">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    placeholder="Confirm new password" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white w-40 h-11 rounded-xl text-md shadow-lg shadow-emerald-100">
                    Save
                  </Button>
                </div>
              </form>
            </TabsContent>          </Tabs>
        </div>
      </main>
      </div>
    </div>
  )
}
