
import { useState, useEffect } from "react";
import { Task } from "@/components/TaskList";
import TaskTimer from "@/components/TaskTimer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Dummy active task data
const dummyActiveTask: Task = {
  id: "task1",
  title: "Create Landing Page Design",
  description: "Design the landing page mockup for the new marketing campaign.",
  priority: "high",
  dueDate: "2025-05-05",
  estimatedTime: 120, // 2 hours
  subtasks: [
    { id: "sub1-1", title: "Research design trends", completed: true },
    { id: "sub1-2", title: "Create wireframe", completed: true },
    { id: "sub1-3", title: "Design high fidelity mockup", completed: false },
    { id: "sub1-4", title: "Prepare for review", completed: false },
  ],
};

const ActiveTask = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(dummyActiveTask);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [subtasks, setSubtasks] = useState(activeTask?.subtasks || []);
  const { toast } = useToast();
  
  useEffect(() => {
    if (activeTask) {
      setSubtasks(activeTask.subtasks);
    }
  }, [activeTask]);
  
  const handleSubtaskToggle = (subtaskId: string) => {
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
    setActiveTask(null);
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
            <ScrollArea className="h-[calc(100%-40px)]">
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
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActiveTask;
