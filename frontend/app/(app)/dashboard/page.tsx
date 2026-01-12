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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(tomorrow);
      d.setDate(tomorrow.getDate() + i);
      return d;
    });
  }, []);

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, ActivityDTO[]>();
    // Filter out completed activities for the dashboard
    const activeActivities = activities.filter(a => !a.completed);
    
    for (const a of activeActivities) {
      const key = a.date; // already "YYYY-MM-DD"
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return map;
  }, [activities]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Upcoming Tasks</h1>
        <p className="text-gray-600 mb-6">Your scheduled tasks for the coming days</p>
      </div>
      {days.map((d) => {
        const key = toYMD(d);
        const dayActivities = activitiesByDate.get(key) ?? [];
        // Only show days that have activities
        if (dayActivities.length === 0) return null;
        return <Day key={key} date={d} activities={dayActivities} onUpdate={fetchActivities} />;
      })}
    </div>
  );
}
