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
    const taskData = {
      date: date.toISOString().split('T')[0],
      context: taskText, // Gets YYYY-MM-DD
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
      router.push('/today');
      
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task. Check the console for details.');
    }
    // ------------------------------------------------
  };

  return (
    <div className="bg-[#D9D9D9] flex flex-col gap-2 p-6 m-10 rounded-[50px] w-250 mx-auto">
      {/* 2. Add onChange handler and connect textarea value to state */}
      <textarea 
        name="task" 
        id="task" 
        className="w-full p-2 size-auto placeholder-gray-500 focus:outline-none text-black text-[32px]" 
        placeholder="Write Your Task Here..."
        value={taskText} // Connect value to state
        onChange={(e) => setTaskText(e.target.value)} // Update state on change
      ></textarea>
      
      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
                {/* Display the selected date */}
                {date ? new Intl.DateTimeFormat('en-US').format(date) : "Pick a Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
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
      
      <div className=" border-b border-black m-2"></div>
      
      <div className="flex flex-column gap-4 sm:flex-row sm:justify-end">
        
        <Link href="/today" passHref>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-150">Cancel</button>
        </Link>
        <button 
          onClick={handleSubmit}
          className="pd-2 px-4 py-2 text-sm font-medium text-white bg-[#34A353] rounded-md hover:bg-blue-700 transition duration-150"
        >
          Add Task
        </button>
      </div>
    </div>
  )
}

export default AddTask