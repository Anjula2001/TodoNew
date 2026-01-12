"use client";

import { useEffect, useMemo, useState } from "react";
import Day from "../day/page";
import { getAuthToken } from "@/lib/auth";

type ActivityDTO = {
  id: number;
  date: string;   // "YYYY-MM-DD"
  context: string;
  completed?: boolean;
};

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

export default function Dashboard() {
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
      .then((data: ActivityDTO[]) => setActivities(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Show upcoming days (tomorrow onwards for the next 30 days)
  const days = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1); // Start from tomorrow (+1)
      // Format date using local timezone components
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      return { date: d, dateStr };
    });
  }, []);

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, ActivityDTO[]>();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Format today's date using local timezone components
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    // Show all upcoming activities (including completed ones) but exclude today's activities
    const upcomingActivities = activities.filter(a => 
      a.date > todayStr
    );
    
    for (const a of upcomingActivities) {
      const key = a.date; // already "YYYY-MM-DD"
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return map;
  }, [activities]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Upcoming Tasks</h1>
        <p className="text-gray-600 mb-6">Your scheduled tasks for the coming days</p>
      </div>
      {days.map(({ date, dateStr }) => {
        const dayActivities = activitiesByDate.get(dateStr) ?? [];
        // Only show days that have activities
        if (dayActivities.length === 0) return null;
        return <Day key={dateStr} date={date} activities={dayActivities} onUpdate={fetchActivities} />;
      })}
    </div>
  );
}
