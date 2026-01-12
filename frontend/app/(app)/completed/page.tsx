"use client";

import { useEffect, useState } from "react";
import Day from "../day/page";
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

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, ActivityDTO[]>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => b.localeCompare(a));

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Completed Tasks</h1>
          <p className="text-gray-600 mt-2">All your accomplished tasks</p>
        </div>

        {activities.length === 0 ? (
          <div className="bg-[#D9D9D9] p-12 rounded-3xl text-center">
            <p className="text-gray-600 text-lg">No completed tasks yet</p>
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return (
              <Day
                key={dateStr}
                date={date}
                activities={groupedActivities[dateStr]}
                onUpdate={fetchActivities}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
