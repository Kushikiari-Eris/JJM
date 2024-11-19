import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Required for drag-and-drop
import axios from 'axios';

const FullCalendarWithSidebar = () => {
    const [tasks, setTasks] = useState([]); // Tasks for the sidebar
    const [events, setEvents] = useState([]); // Scheduled tasks for the calendar
    const [taskName, setTaskName] = useState('');
    const [loading, setLoading] = useState(false);
    const calendarRef = useRef();
  
    // Fetch tasks from backend
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:7684/api/tasks');
        const fetchedTasks = response.data.map((task) => ({
          id: task._id,
          title: task.taskName,
          
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    const fetchAutoSched = async () => {
        try {
          const response = await axios.get('http://localhost:7684/api/autoSched');
          const fetchedAutoSched = response.data.map((task) => ({
            title: task.taskName,
            start: task.scheduledDate,
          }));
          setEvents(fetchedAutoSched);
        } catch (error) {
          console.error('Error fetching tasks:', error.message);
        }finally {
          setLoading(false); // Stop loading after fetch
        }
      };
  
    // Add a new task
    const addTask = async () => {
      if (!taskName.trim()) {
        alert('Task name cannot be empty!');
        return;
      }
      try {
        const response = await axios.post('http://localhost:7684/api/tasks', { taskName });
        const newTask = response.data;
        setTasks([...tasks, { id: newTask._id, title: newTask.taskName }]);
        setTaskName('');
      } catch (error) {
        console.error('Error adding task:', error.message);
      }
    };
  
    // Edit a task
    const editTask = async (taskId) => {
      const updatedTaskName = prompt('Enter the new task name:');
      if (!updatedTaskName) return;
  
      try {
        const response = await axios.put(`http://localhost:7684/api/tasks/${taskId}`, {
          taskName: updatedTaskName,
        });
        const updatedTask = response.data;
  
        // Update the task in the sidebar
        setTasks(tasks.map((task) =>
          task.id === updatedTask._id ? { ...task, title: updatedTask.taskName } : task
        ));
      } catch (error) {
        console.error('Error editing task:', error.message);
      }
    };
  
    // Delete a task
    const deleteTask = async (taskId) => {
      try {
        await axios.delete(`http://localhost:7684/api/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error.message);
      }
    };
  
    // Auto-schedule tasks
    const handleAutoSchedule = async () => {
        setLoading(true);
      try {
        if (tasks.length === 0) {
          alert('No tasks available to auto-schedule!');
          return;
        }
  
        const tasksData = tasks.map((task) => ({ taskName: task.title }));
        const response = await axios.post('http://localhost:7684/api/autoSched', { tasks: tasksData });
  
        
        setTasks([]); // Clear tasks from the sidebar
        alert('Tasks have been auto-scheduled!');
        window.location.reload();
      } catch (error) {
        console.error('Error auto-scheduling tasks:', error.message);
        alert('Failed to auto-schedule tasks.');
      }
    };
  
    // Fetch tasks on component mount
    useEffect(() => {
      fetchTasks();
      fetchAutoSched()
    }, []);
  
  

  return (
        <div className="p-4">
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-900">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 1 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Home
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10" >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900"  >
                                Maintenance
                            </a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10" >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                Maintenance Scheduling
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
            <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">
            Maintenance Scheduling
            </h2>

            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div class="flex items-center justify-center h-screen">
                    <div class="relative">
                        <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                        <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                        </div>
                    </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-4">
              {/* Sidebar */}
              <div className="w-1/4 bg-white p-4 border-r flex flex-col justify-between border shadow-base rounded-lg">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-white  rounded-lg shadow flex items-center justify-between"
                        style={{ borderLeft: '4px solid #3b82f6' }}
                      >
                        <p className="text-sm font-medium text-gray-700">{task.title}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editTask(task.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input and Buttons */}
                <div className="mt-8">
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  />
                  <div className="space-y-2">
                    <button
                      onClick={addTask}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Add Task
                    </button>
                    <button
                      disabled={loading}
                      onClick={handleAutoSchedule}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      {loading ? "Generating..." : "Auto Scheduling"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="w-3/4 p-4 bg-white border shadow-base rounded-lg">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  editable={true}
                  droppable={true}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  events={events} // Display scheduled events in the calendar
                  height="auto"
                  dayMaxEventRows={true}
                  className="shadow-md rounded-lg"
                />
              </div>
            </div>
    </div>
  );
};

export default FullCalendarWithSidebar;
