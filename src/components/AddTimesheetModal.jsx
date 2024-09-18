import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const AddTimesheetModal = ({
  isOpen,
  onClose,
  onSubmit,
  newTaskNumber,
  setNewTaskNumber,
  newDescription,
  setNewDescription,
  newTimeStarted,
  setNewTimeStarted,
  newTimeEnded,
  setNewTimeEnded,
  newWithWhom,
  setNewWithWhom,
  newDeliverables,
  setNewDeliverables,
  selectedDate,
  setSelectedDate,
  newComment, // Original Comment prop
  setNewComment, // Setter for original Comment
  newComment1, // Comment 1 prop
  setNewComment1, // Setter for Comment 1
  newComment2, // Comment 2 prop
  setNewComment2 // Setter for Comment 2
}) => {
  const { theme } = useTheme(); // Get the current theme
  const [commentFieldsVisible, setCommentFieldsVisible] = useState(0); // State to track the number of comment fields shown

  if (!isOpen) return null;

  // Define dark mode and light mode styles
  const modalBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'; // Different background for inputs
  const inputTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900'; // Text color for inputs
  const buttonBgAdd = theme === 'dark' ? 'bg-green-500' : 'bg-green-600';
  const buttonBgCancel = theme === 'dark' ? 'bg-red-600' : 'bg-red-500';

  // Function to add more comment fields
  const handleAddCommentField = () => {
    if (commentFieldsVisible < 2) {
      setCommentFieldsVisible(commentFieldsVisible + 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className={`p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen ${modalBgColor}`}>
        {/* Scrollable content wrapper */}
        <div className="overflow-y-auto max-h-[80vh]">
          <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Add New Timesheet</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="task-number" className={`block text-sm font-medium mb-1 ${textColor}`}>Task Number</label>
              <input
                id="task-number"
                type="text"
                placeholder="Task Number"
                value={newTaskNumber}
                onChange={(e) => setNewTaskNumber(e.target.value)}
                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </div>
            <div>
              <label htmlFor="description" className={`block text-sm font-medium mb-1 ${textColor}`}>Description</label>
              <input
                id="description"
                type="text"
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </div>

            {/* Time Inputs with Labels in a Single Line */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="start-time" className={`block text-sm font-medium mb-1 ${textColor}`}>Start Time</label>
                <input
                  id="start-time"
                  type="time"
                  value={newTimeStarted}
                  onChange={(e) => setNewTimeStarted(e.target.value)}
                  className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="end-time" className={`block text-sm font-medium mb-1 ${textColor}`}>End Time</label>
                <input
                  id="end-time"
                  type="time"
                  value={newTimeEnded}
                  onChange={(e) => setNewTimeEnded(e.target.value)}
                  className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="with-whom" className={`block text-sm font-medium mb-1 ${textColor}`}>With Whom</label>
              <input
                id="with-whom"
                type="text"
                placeholder="With Whom"
                value={newWithWhom}
                onChange={(e) => setNewWithWhom(e.target.value)}
                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </div>
            <div>
              <label htmlFor="deliverables" className={`block text-sm font-medium mb-1 ${textColor}`}>Deliverables</label>
              <input
                id="deliverables"
                type="text"
                placeholder="Deliverables"
                value={newDeliverables}
                onChange={(e) => setNewDeliverables(e.target.value)}
                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </div>

            {/* Date Created Input */}
            <div>
              <label htmlFor="date-created" className={`block text-sm font-medium mb-1 ${textColor}`}>Date Created</label>
              <input
                id="date-created"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
              />
            </div>

            {/* Comment Input */}
            <div>
              <label htmlFor="comment" className={`block text-sm font-medium mb-1 ${textColor}`}>Comment</label>
              <textarea
                id="comment"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                rows="3"
              />
            </div>

            {/* Conditionally Render Comment 1 */}
            {commentFieldsVisible >= 1 && (
              <div>
                <label htmlFor="comment-1" className={`block text-sm font-medium mb-1 ${textColor}`}>Comment 1</label>
                <textarea
                  id="comment-1"
                  placeholder="Add comment 1"
                  value={newComment1}
                  onChange={(e) => setNewComment1(e.target.value)}
                  className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                  rows="3"
                />
              </div>
            )}

            {/* Conditionally Render Comment 2 */}
            {commentFieldsVisible >= 2 && (
              <div>
                <label htmlFor="comment-2" className={`block text-sm font-medium mb-1 ${textColor}`}>Comment 2</label>
                <textarea
                  id="comment-2"
                  placeholder="Add comment 2"
                  value={newComment2}
                  onChange={(e) => setNewComment2(e.target.value)}
                  className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                  rows="3"
                />
              </div>
            )}

            {/* Button to Add More Comment Fields */}
            {commentFieldsVisible < 2 && (
              <button
                onClick={handleAddCommentField}
                className="mt-2 text-blue-500 underline"
              >
                + Comment
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onSubmit}
            className={`py-2 px-4 rounded-lg text-white ${buttonBgAdd}`}
          >
            Add Timesheet
          </button>
          <button
            onClick={onClose}
            className={`py-2 px-4 rounded-lg text-white ${buttonBgCancel}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTimesheetModal;
