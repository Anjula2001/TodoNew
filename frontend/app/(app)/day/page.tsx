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
    <div className="bg-[#D9D9D9] flex flex-col gap-2 py-2 px-4 m-10 rounded-[20px] items-end">
      <div className="flex flex-row justify-between w-full item-end">
        <div className="flex flex-row gap-8 items-end">
          <h1 className="text-[42px] text-black">{currentDay}</h1>
          <h2 className="text-[36px] text-black">{currentMonth}</h2>
        </div>
        <h2 className="text-[48px] text-black">{currentYear}</h2>
      </div>

      <div className="w-full border-b border-black my-2" />

      <div className="p-4 m-4 w-full">
        {activities.map((activity) => (
          <Task
            key={activity.id}
            taskId={activity.id}
            taskName={activity.context}
            isSelected={selectedTaskId === activity.id}
            onSelect={handleTaskSelect}
            onComplete={handleTaskComplete}
            showCompleteButton={true}
          />
        ))}
      </div>

      <div className="w-full flex flex-row-reverse gap-2 px-4 pb-4">
        <button
          onClick={handleAddTask}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default Day;
