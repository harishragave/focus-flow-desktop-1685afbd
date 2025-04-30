
import { useState, useEffect } from "react";
import { Task } from "@/components/TaskList";
import TaskTimer from "@/components/TaskTimer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

const ActiveTask = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const { toast } = useToast();
  
  // Load active task data from localStorage
  useEffect(() => {
    const activeTaskId = localStorage.getItem('activeTaskId');
    const isPausedState = localStorage.getItem('isPaused') === 'true';
    const isOnBreakState = localStorage.getItem('isOnBreak') === 'true';
    
    if (activeTaskId) {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          const foundTask = parsedTasks.find((task: Task) => task.id === activeTaskId);
          
          if (foundTask) {
            setActiveTask(foundTask);
            setSubtasks(foundTask.subtasks);
            setIsPaused(isPausedState);
            setIsOnBreak(isOnBreakState);
          }
        } catch (error) {
          console.error('Error parsing saved tasks:', error);
        }
      }
    }
  }, []);
  
  // Save active task state to localStorage whenever it changes
  useEffect(() => {
    if (activeTask) {
      localStorage.setItem('activeTaskId', activeTask.id);
      localStorage.setItem('isPaused', String(isPaused));
      localStorage.setItem('isOnBreak', String(isOnBreak));
      
      // Update the task in localStorage with new subtasks
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          const updatedTasks = parsedTasks.map((task: Task) => 
            task.id === activeTask.id ? { ...task, subtasks } : task
          );
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        } catch (error) {
          console.error('Error updating tasks in localStorage:', error);
        }
      }
    }
  }, [activeTask, subtasks, isPaused, isOnBreak]);
  
  const handleSubtaskToggle = (subtaskId: string) => {
    if (!activeTask) return;
    
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    
    setSubtasks(updatedSubtasks);
    
    if (activeTask) {
      setActiveTask({
        ...activeTask,
        subtasks: updatedSubtasks,
      });
    }
  };

  const handleAddSubtask = () => {
    if (!activeTask || newSubtaskTitle.trim() === "") return;
    
    const newSubtask = {
      id: uuidv4(),
      title: newSubtaskTitle,
      completed: false,
    };
    
    const updatedSubtasks = [...subtasks, newSubtask];
    setSubtasks(updatedSubtasks);
    setNewSubtaskTitle("");
    
    if (activeTask) {
      setActiveTask({
        ...activeTask,
        subtasks: updatedSubtasks,
      });
    }
    
    toast({
      title: "Subtask Added",
      description: `Added "${newSubtaskTitle}" to subtasks`,
    });
  };
  
  const handlePauseTask = () => {
    setIsPaused(true);
    toast({
      title: "Task Paused",
      description: "Timer has been paused",
    });
  };
  
  const handleResumeTask = () => {
    setIsPaused(false);
    toast({
      title: "Task Resumed",
      description: "Timer has been resumed",
    });
  };
  
  const handleCompleteTask = () => {
    // Mark all subtasks as completed
    if (activeTask) {
      const completedSubtasks = subtasks.map(subtask => ({ ...subtask, completed: true }));
      
      // Update localStorage
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          const updatedTasks = parsedTasks.map((task: Task) => 
            task.id === activeTask.id ? { ...task, subtasks: completedSubtasks } : task
          );
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        } catch (error) {
          console.error('Error updating tasks in localStorage:', error);
        }
      }
    }
    
    // Clear active task
    setActiveTask(null);
    localStorage.removeItem('activeTaskId');
    localStorage.removeItem('isPaused');
    localStorage.removeItem('isOnBreak');
    
    toast({
      title: "Task Completed",
      description: "Great job! Task has been completed",
    });
  };
  
  const handleTakeBreak = () => {
    setIsOnBreak(true);
    toast({
      title: "Break Started",
      description: "Enjoy your 5 minute break",
    });
  };
  
  const handleEndBreak = () => {
    setIsOnBreak(false);
    toast({
      title: "Break Ended",
      description: "Break time is over, returning to task",
    });
  };
  
  if (!activeTask) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-muted-foreground">No active task</p>
            <p className="text-sm text-muted-foreground mt-2">
              Select a task from the Tasks page to start working
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      <div className="h-1/2">
        <TaskTimer
          taskTitle={activeTask.title}
          isRunning={true}
          isPaused={isPaused}
          isOnBreak={isOnBreak}
          onPause={handlePauseTask}
          onResume={handleResumeTask}
          onComplete={handleCompleteTask}
          onBreak={handleTakeBreak}
          onEndBreak={handleEndBreak}
        />
      </div>
      
      <div className="h-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{activeTask.title}</CardTitle>
            <CardDescription>{activeTask.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-sm font-medium mb-2">Subtasks</h3>
            <div className="flex items-center space-x-2 mb-4">
              <Input 
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a new subtask"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleAddSubtask} size="sm">
                <PlusCircle size={16} />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-100px)]">
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={subtask.id}
                      checked={subtask.completed}
                      onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                    />
                    <label
                      htmlFor={subtask.id}
                      className={`text-sm ${
                        subtask.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <p className="text-sm text-muted-foreground">No subtasks</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActiveTask;
