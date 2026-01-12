"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAuthToken, setAuthToken, getUserData } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    
    // Load current user data
    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8080/api/v1/auth/profile", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
      } else if (response.status === 401) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8080/api/v1/auth/profile", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update token and user data in localStorage
        setAuthToken(data.token);
        localStorage.setItem('user', JSON.stringify({ 
          name: data.name, 
          email: data.email 
        }));
        alert("Profile updated successfully!");
        // Refresh the page to show updated data everywhere
        window.location.reload();
      } else {
        const error = await response.text();
        alert(`Failed to update profile: ${error}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }
    
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8080/api/v1/auth/change-password", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.text();
        alert(`Failed to change password: ${error}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
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
              <form onSubmit={handlePasswordChange} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-slate-600 font-medium">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                    required
                  />
                </div>              <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-slate-600 font-medium">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                    required
                    minLength={6}
                  />
                </div>              <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-600 font-medium">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" 
                    className="bg-[#C1E8D5] border-none h-12 text-slate-700 placeholder:text-slate-500 rounded-xl focus-visible:ring-[#1ABC9C]"
                    required
                    minLength={6}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white w-40 h-11 rounded-xl text-md shadow-lg shadow-emerald-100">
                    Change Password
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
