"use client";

import { useEffect, useState } from "react";
import Task from "../task/page";
import { getAuthToken } from "@/lib/auth";

type ActivityDTO = {
  id: number;
  date: string;   // "YYYY-MM-DD"
  context: string;
  completed?: boolean;
};

export default function CompletedPage() {
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = () => {
    const token = getAuthToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/v1/getactivity", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch activities");
        return res.json();
      })
      .then((data: ActivityDTO[]) => {
        // Filter for completed tasks
        const completedActivities = data.filter(
          (activity) => activity.completed === true
        );
        setActivities(completedActivities);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleTaskSelect = (taskId: number) => {
    setSelectedTaskId((currentId) => (currentId === taskId ? null : taskId));
  };

  const handleTaskUncomplete = async (taskId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/togglecompleted/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("Failed to update activity");
      
      // Refresh the activities list
      fetchActivities();
      setSelectedTaskId(null);
    } catch (err) {
      console.error("Error uncompleting task:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Completed Tasks</h1>
        <p className="text-gray-600 mt-2">All your accomplished tasks</p>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="bg-[#D9D9D9] p-8 rounded-[20px] text-center">
            <p className="text-gray-600 text-lg">No completed tasks yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="bg-[#D9D9D9] p-4 rounded-[20px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <input 
                    className="cursor-pointer size-[20px]" 
                    type="checkbox"
                    checked={true}
                    onChange={() => handleTaskUncomplete(activity.id)}
                  />
                  <span className="text-gray-500 line-through text-lg">
                    {activity.context}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {activity.date}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
