"use client";

import { useState, useEffect } from "react";
import { getAuthToken, getUserData, removeAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Activity {
  id: number;
  date: string;
  context: string;
  completed: boolean;
}

export default function TodayPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
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
        // Filter today's activities
        const today = new Date().toISOString().split('T')[0];
        const todayActivities = data.filter((activity: Activity) => 
          activity.date === today
        );
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

  const addActivity = async () => {
    if (!newTask.trim()) return;

    try {
      const token = getAuthToken();
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch("http://localhost:8080/api/v1/saveactivity", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: today,
          context: newTask,
          completed: false
        })
      });

      if (response.ok) {
        setNewTask("");
        fetchActivities();
      } else if (response.status === 401) {
        removeAuthToken();
        router.push("/login");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8080/api/v1/togglecompleted/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        fetchActivities();
      } else if (response.status === 401) {
        removeAuthToken();
        router.push("/login");
      }
    } catch (error) {
      console.error("Error toggling activity:", error);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Today's Tasks</h1>
            <p className="text-gray-600">Welcome back, {userData.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Add new task */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              placeholder="Add a new task for today..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={addActivity}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all font-semibold"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Tasks ({activities.length})
          </h2>
          
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No tasks for today. Add your first task above!
            </p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={activity.completed}
                    onChange={() => toggleComplete(activity.id)}
                    className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <span
                    className={`flex-1 ${
                      activity.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {activity.context}
                  </span>
                  {activity.completed && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      Completed
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
