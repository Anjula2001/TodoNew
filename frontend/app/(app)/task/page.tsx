"use client";
import React, { FC, useState } from 'react';

interface TaskProps {
    taskId: number;
    taskName: string;
    isSelected: boolean;
    isCompleted?: boolean;
    onSelect: (taskId: number) => void;
    onComplete?: (taskId: number) => void;
    onDelete?: (taskId: number) => void;
    onEdit?: (taskId: number, newName: string) => void;
    showCompleteButton?: boolean;
}

const Task: FC<TaskProps> = ({ taskId, taskName, isSelected, isCompleted = false, onSelect, onComplete, onDelete, onEdit, showCompleteButton = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(taskName);
    const [showMenu, setShowMenu] = useState(false);

    const handleRadioClick = () => {
        // Mark as complete immediately when radio button is clicked
        if (onComplete) {
            onComplete(taskId);
        }
    };

    const handleDelete = () => {
        if (onDelete && confirm('Are you sure you want to delete this task?')) {
            onDelete(taskId);
        }
        setShowMenu(false);
    };

    const handleRename = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSaveEdit = () => {
        if (onEdit && editedName.trim()) {
            onEdit(taskId, editedName);
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedName(taskName);
        setIsEditing(false);
    };

    const baseClasses = 
        "flex items-center gap-4 px-6 py-4 rounded-3xl transition-colors duration-300 shadow-md cursor-pointer";

    const selectedClasses = isSelected 
        ? "bg-green-100 border-2 border-green-500 shadow-lg" 
        : "bg-[#D9D9D9] hover:bg-gray-300 border-2 border-transparent";

    return (
        
        <div className={`${baseClasses} ${selectedClasses}`}
            onClick={() => onSelect(taskId)}
        >
            <div className="flex-shrink-0">
               
                <input 
                    className="cursor-pointer w-5 h-5" 
                    type="checkbox"
                    checked={isCompleted}
                    onChange={handleRadioClick}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {/* Conditional text color/style for completed state */}
            {isEditing ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none text-base"
                    autoFocus
                />
            ) : (
                <div className="flex-1 flex items-center gap-3">
                    <span className={`text-base ${isCompleted ? "text-gray-500 line-through" : (isSelected ? "text-green-700 font-semibold" : "text-gray-800")}`}>
                        {taskName}
                    </span>
                    {isCompleted && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                            ✓ Completed
                        </span>
                    )}
                </div>
            )}
            <div className="flex gap-2 items-center relative flex-shrink-0">
                {isEditing ? (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Save
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Edit
                        </button>
                        
                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRename(); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 rounded-t-lg"
                                >
                                    Rename
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 rounded-b-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Task;
