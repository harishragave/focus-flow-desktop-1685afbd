
import { useState, useEffect } from "react";
import TaskList, { Task } from "@/components/TaskList";
import TaskDetail from "@/components/TaskDetail";
import TaskForm from "@/components/TaskForm";
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const { toast } = useToast();
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
      }
    }
    
    // Check for active task in localStorage
    const savedActiveTaskId = localStorage.getItem('activeTaskId');
    if (savedActiveTaskId) {
      setActiveTaskId(savedActiveTaskId);
      setIsPaused(localStorage.getItem('isPaused') === 'true');
      setIsOnBreak(localStorage.getItem('isOnBreak') === 'true');
    }
  }, []);
  
  // Save active task state to localStorage
  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('activeTaskId', activeTaskId);
      localStorage.setItem('isPaused', String(isPaused));
      localStorage.setItem('isOnBreak', String(isOnBreak));
    } else {
      localStorage.removeItem('activeTaskId');
      localStorage.removeItem('isPaused');
      localStorage.removeItem('isOnBreak');
    }
  }, [activeTaskId, isPaused, isOnBreak]);
  
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;
  
  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
  };
  
  const handleStartTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setIsPaused(false);
    setIsOnBreak(false);
    toast({
      title: "Task Started",
      description: "Timer is now running for this task",
    });
  };
  
  const handlePauseTask = (taskId: string) => {
    setIsPaused(true);
    toast({
      title: "Task Paused",
      description: "Timer has been paused",
    });
  };
  
  const handleCompleteTask = (taskId: string) => {
    setActiveTaskId(null);
    setIsPaused(false);
    setIsOnBreak(false);
    
    // Update tasks to mark all subtasks as completed
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? {
              ...task, 
              subtasks: task.subtasks.map(subtask => ({ ...subtask, completed: true }))
            }
          : task
      )
    );
    
    // Update localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const updatedTasks = parsedTasks.map((task: Task) => 
          task.id === taskId 
            ? {
                ...task, 
                subtasks: task.subtasks.map(subtask => ({ ...subtask, completed: true }))
              }
            : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      } catch (error) {
        console.error('Error updating tasks in localStorage:', error);
      }
    }
    
    toast({
      title: "Task Completed",
      description: "Great job! Task has been completed",
    });
  };
  
  const handleTakeBreak = (taskId: string) => {
    setIsOnBreak(true);
    toast({
      title: "Break Started",
      description: "Enjoy your 5 minute break",
    });
  };
  
  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast({
      title: "Task Added",
      description: "New task has been added",
    });
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };
  
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskForm onAddTask={handleAddTask} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <TaskList
          tasks={tasks}
          onSelectTask={handleSelectTask}
          selectedTaskId={selectedTaskId}
        />
        <TaskDetail
          task={selectedTask}
          onStartTask={handleStartTask}
          onPauseTask={handlePauseTask}
          onCompleteTask={handleCompleteTask}
          onTakeBreak={handleTakeBreak}
          currentTaskId={activeTaskId}
          isPaused={isPaused}
          isOnBreak={isOnBreak}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </div>
  );
};

export default Tasks;
