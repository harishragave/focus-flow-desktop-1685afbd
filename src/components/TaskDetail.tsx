
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";
import { Task } from "@/components/TaskList";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskDetailProps {
  task: Task | null;
  onStartTask: (taskId: string) => void;
  onPauseTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onTakeBreak: (taskId: string) => void;
  currentTaskId: string | null;
  isPaused: boolean;
  isOnBreak: boolean;
}

const TaskDetail = ({
  task,
  onStartTask,
  onPauseTask,
  onCompleteTask,
  onTakeBreak,
  currentTaskId,
  isPaused,
  isOnBreak,
}: TaskDetailProps) => {
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  // Update subtasks when task changes
  if (task && task.subtasks !== subtasks) {
    setSubtasks(task.subtasks);
  }

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    setSubtasks(updatedSubtasks);
  };

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

  const isTaskActive = currentTaskId === task?.id;

  if (!task) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-center text-muted-foreground">
            Select a task to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription className="mt-1">
              {task.description}
            </CardDescription>
          </div>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">
              Estimated: {formatTime(task.estimatedTime)}
            </span>
          </div>
        </div>

        <h3 className="text-sm font-medium mb-2">Subtasks</h3>
        <ScrollArea className="h-[200px] mb-4">
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

        <div className="flex flex-wrap gap-2 mt-6">
          {isTaskActive ? (
            <>
              {isPaused ? (
                <Button
                  className="flex-1"
                  onClick={() => onStartTask(task.id)}
                >
                  Resume
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => onPauseTask(task.id)}
                >
                  Pause
                </Button>
              )}
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => onCompleteTask(task.id)}
              >
                Complete
              </Button>
              {!isOnBreak ? (
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => onTakeBreak(task.id)}
                >
                  Take Break
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => onStartTask(task.id)}
                >
                  End Break
                </Button>
              )}
            </>
          ) : (
            <Button
              className="flex-1 bg-brand-red hover:bg-brand-red/90"
              onClick={() => onStartTask(task.id)}
            >
              Start Task
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDetail;
