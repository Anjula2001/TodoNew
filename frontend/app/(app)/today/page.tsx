"use client";

import { useState, useEffect } from "react";
import { getAuthToken, getUserData, removeAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Day from "../day/page";

interface Activity {
  id: number;
  date: string;
  context: string;
  completed: boolean;
}

export default function TodayPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userData = getUserData();

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8080/api/v1/getactivity", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter today's activities only
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        const todayActivities = data.filter((activity: Activity) => {
          return activity.date === todayStr;
        });
        setActivities(todayActivities);
      } else if (response.status === 401) {
        // Unauthorized - redirect to login
        removeAuthToken();
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Create a Date object for today
  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Today's Tasks</h1>
          <p className="text-gray-600">Welcome back, {userData.name}!</p>
        </div>

        {activities.length === 0 ? (
          <div className="bg-[#D9D9D9] p-12 rounded-3xl text-center">
            <p className="text-gray-600 text-lg">No tasks for today. Add your first task!</p>
          </div>
        ) : (
          <Day date={todayDate} activities={activities} onUpdate={fetchActivities} />
        )}
      </div>
    </div>
  );
}
