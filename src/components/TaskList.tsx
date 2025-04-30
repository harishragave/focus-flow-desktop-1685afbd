
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  estimatedTime: number; // in minutes
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  selectedTaskId: string | null;
}

const TaskList = ({ tasks, onSelectTask, selectedTaskId }: TaskListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-amber-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-210px)]">
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No tasks available</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card cursor-pointer ${
                    selectedTaskId === task.id ? "border-primary ring-1 ring-primary" : ""
                  }`}
                  onClick={() => onSelectTask(task)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatTime(task.estimatedTime)}
                    </div>
                    <div>
                      {task.subtasks.filter((st) => st.completed).length} / {task.subtasks.length} subtasks
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TaskList;
