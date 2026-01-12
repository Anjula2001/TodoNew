"use client";

import { useMemo, useState } from "react";
import Task from "../task/page";
import { getAuthToken } from "@/lib/auth";

type ActivityDTO = {
  id: number;
  date: string;   // "YYYY-MM-DD"
  context: string;
  completed?: boolean;
};

interface DayProps {
  date: Date;
  activities: ActivityDTO[]; // already filtered for this day
  onUpdate?: () => void; // callback to refresh data
}

const Day = ({ date, activities, onUpdate }: DayProps) => {
  
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>("");

  const handleTaskSelect = (taskId: number) => {
    setSelectedTaskId((currentId) => (currentId === taskId ? null : taskId));
  };

  const handleTaskComplete = async (taskId: number) => {
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
      
      // Call the parent's refresh function if provided
      if (onUpdate) {
        onUpdate();
      }
      setSelectedTaskId(null);
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/deleteactivity/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete activity");
      
      // Refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleTaskEdit = async (taskId: number, newName: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("Not authenticated");
        return;
      }

      const activity = activities.find(a => a.id === taskId);
      if (!activity) return;

      const response = await fetch(`http://localhost:8080/api/v1/updateactivity/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          date: activity.date,
          context: newName,
          completed: activity.completed || false,
        }),
      });

      if (!response.ok) throw new Error("Failed to update activity");
      
      // Refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const handleAddTask = () => {
    if (newTaskName.trim() === "") return;

    // NOTE: this only updates UI inside this Day component.
    // If you want it to affect the dashboard global list, we’ll lift this up later.
    // For now, keep it simple.
    setNewTaskName("");
  };

  const currentDay = date.getDate();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentYear = date.getFullYear();

  return (
    <div className="bg-[#D9D9D9] flex flex-col gap-4 py-6 px-8 mx-6 my-4 rounded-3xl">
      <div className="flex flex-row justify-between items-end w-full">
        <div className="flex flex-row gap-6 items-end">
          <h1 className="text-5xl font-bold text-black">{currentDay}</h1>
          <h2 className="text-3xl font-semibold text-black">{currentMonth}</h2>
        </div>
        <h2 className="text-4xl font-semibold text-black">{currentYear}</h2>
      </div>

      <div className="w-full border-b-2 border-black" />

      <div className="space-y-3 w-full">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg">No tasks for this day</p>
          </div>
        ) : (
          activities.map((activity) => (
          <Task
            key={activity.id}
            taskId={activity.id}
            taskName={activity.context}
            isSelected={selectedTaskId === activity.id}
            isCompleted={activity.completed || false}
            onSelect={handleTaskSelect}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
            onEdit={handleTaskEdit}
            showCompleteButton={true}
          />
          ))
        )}
      </div>
    </div>
  );
};

export default Day;
