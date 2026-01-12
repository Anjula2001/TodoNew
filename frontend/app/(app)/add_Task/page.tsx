'use client';
import { Button } from "@/components/ui/button"
import * as React from 'react'
import { Calendar } from "@/components/ui/calendar"
import "tailwindcss"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

const AddTask = () => {
  const router = useRouter();
  // 1. Introduce State for the task text
  const [taskText, setTaskText] = useState('');
  
  // State for the date (already present)
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // 3. Create a Submit Handler function
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default link behavior
    
    // Check if taskText and date are present
    if (!taskText.trim() || !date) {
        alert('Please write a task and select a date.');
        return;
    }

    // Data to be sent to the backend
    // Format date properly to avoid timezone issues
    // Normalize to midnight local time to avoid any time component issues
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    const taskData = {
      date: formattedDate, // Gets YYYY-MM-DD in local timezone
      context: taskText,
      completed: false
    };

    console.log('Data to send:', taskData);

    
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:8080/api/v1/saveactivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Task added successfully:', result);

      // Redirect to today page after successful submission
      alert('Task added successfully!');
      // Use window.location for a full page refresh to ensure data is fetched
      window.location.href = '/today';
      
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task. Check the console for details.');
    }
    // ------------------------------------------------
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#D9D9D9] flex flex-col gap-6 p-8 rounded-3xl shadow-md">
          {/* 2. Add onChange handler and connect textarea value to state */}
          <textarea 
            name="task" 
            id="task" 
            className="w-full p-4 min-h-[120px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-2xl rounded-lg bg-white" 
            placeholder="Write Your Task Here..."
            value={taskText} // Connect value to state
            onChange={(e) => setTaskText(e.target.value)} // Update state on change
          ></textarea>
          
          <div className="flex flex-col gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto text-base py-6">
                {/* Display the selected date */}
                {date ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date) : "Pick a Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="border-b-2 border-black"></div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        
        <Link href="/today" passHref>
          <button className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150">Cancel</button>
        </Link>
        <button 
          onClick={handleSubmit}
          className="px-6 py-3 text-base font-medium text-white bg-[#34A353] rounded-lg hover:bg-green-700 transition duration-150"
        >
          Add Task
        </button>
      </div>
    </div>
      </div>
    </div>
  )
}

export default AddTask