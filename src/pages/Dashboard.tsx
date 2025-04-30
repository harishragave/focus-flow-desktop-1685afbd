
import { useState, useEffect } from "react";
import TaskList, { Task } from "@/components/TaskList";
import TaskDetail from "@/components/TaskDetail";
import TaskTimer from "@/components/TaskTimer";
import TaskForm from "@/components/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Initial dummy data for tasks
const initialTasks: Task[] = [
  {
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
    projectId: "project1"
  },
  {
    id: "task2",
    title: "Implement API Integration",
    description: "Connect the frontend to the new payment API endpoints.",
    priority: "medium",
    dueDate: "2025-05-10",
    estimatedTime: 180, // 3 hours
    subtasks: [
      { id: "sub2-1", title: "Review API documentation", completed: true },
      { id: "sub2-2", title: "Create API service", completed: false },
      { id: "sub2-3", title: "Implement error handling", completed: false },
      { id: "sub2-4", title: "Write tests", completed: false },
    ],
    projectId: "project2"
  }
];

// Initial projects
const initialProjects = [
  { id: "project1", name: "Marketing Website" },
  { id: "project2", name: "Payment System" },
];

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState(initialProjects);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const { toast } = useToast();
  
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;
  const activeTask = tasks.find((task) => task.id === activeTaskId) || null;
  
  // Load tasks from local storage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
      }
    }
    
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error('Error parsing saved projects:', error);
      }
    }
  }, []);
  
  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save projects to local storage when they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  
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
  
  const handleResumeTask = (taskId: string) => {
    setIsPaused(false);
    toast({
      title: "Task Resumed",
      description: "Timer has been resumed",
    });
  };
  
  const handleCompleteTask = (taskId: string) => {
    setActiveTaskId(null);
    setIsPaused(false);
    setIsOnBreak(false);
    
    // Mark the task as completed by updating all subtasks to completed
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
  
  const handleEndBreak = () => {
    setIsOnBreak(false);
    toast({
      title: "Break Ended",
      description: "Break time is over, returning to task",
    });
  };
  
  const handleAddTask = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };
  
  const getUnassignedTasks = () => {
    return tasks.filter(task => !task.projectId);
  };
  
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <TaskForm onAddTask={handleAddTask} />
      </div>
      
      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          {projects.map(project => (
            <TabsTrigger key={project.id} value={project.id}>
              {project.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <TaskList
              tasks={tasks}
              onSelectTask={handleSelectTask}
              selectedTaskId={selectedTaskId}
              onAddTask={handleAddTask}
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
            />
          </div>
        </TabsContent>
        
        {projects.map(project => (
          <TabsContent key={project.id} value={project.id} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <TaskList
                tasks={getProjectTasks(project.id)}
                onSelectTask={handleSelectTask}
                selectedTaskId={selectedTaskId}
                onAddTask={handleAddTask}
                projectId={project.id}
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
              />
            </div>
          </TabsContent>
        ))}
        
        <TabsContent value="unassigned" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <TaskList
              tasks={getUnassignedTasks()}
              onSelectTask={handleSelectTask}
              selectedTaskId={selectedTaskId}
              onAddTask={handleAddTask}
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
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {activeTask && (
        <div className="flex-none h-80">
          <TaskTimer
            taskTitle={activeTask.title}
            isRunning={activeTaskId !== null}
            isPaused={isPaused}
            isOnBreak={isOnBreak}
            onPause={() => handlePauseTask(activeTask.id)}
            onResume={() => handleResumeTask(activeTask.id)}
            onComplete={() => handleCompleteTask(activeTask.id)}
            onBreak={() => handleTakeBreak(activeTask.id)}
            onEndBreak={handleEndBreak}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
