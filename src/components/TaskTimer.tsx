
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Timer, Keyboard, MousePointer, PauseCircle, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TaskTimerProps {
  taskTitle: string;
  isRunning: boolean;
  isPaused: boolean;
  isOnBreak: boolean;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onBreak: () => void;
  onEndBreak: () => void;
}

const TaskTimer = ({
  taskTitle,
  isRunning,
  isPaused,
  isOnBreak,
  onPause,
  onResume,
  onComplete,
  onBreak,
  onEndBreak,
}: TaskTimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [keyboardCount, setKeyboardCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [breakProgress, setBreakProgress] = useState(0);

  // Simulates keyboard activity and mouse movement counts
  useEffect(() => {
    if (isRunning && !isPaused && !isOnBreak) {
      const keyboardInterval = setInterval(() => {
        setKeyboardCount((prev) => prev + Math.floor(Math.random() * 3));
      }, 5000);

      const mouseInterval = setInterval(() => {
        setMouseCount((prev) => prev + Math.floor(Math.random() * 5));
      }, 3000);

      return () => {
        clearInterval(keyboardInterval);
        clearInterval(mouseInterval);
      };
    }
  }, [isRunning, isPaused, isOnBreak]);

  // Timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isRunning && !isPaused && !isOnBreak) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (isOnBreak) {
      // Break timer - assuming 5 minute break (300 seconds)
      const breakLength = 300;
      
      timer = setInterval(() => {
        setBreakSeconds((prev) => {
          const newValue = prev + 1;
          setBreakProgress(Math.min((newValue / breakLength) * 100, 100));
          
          if (newValue >= breakLength) {
            onEndBreak();
            return 0;
          }
          
          return newValue;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isPaused, isOnBreak, onEndBreak]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatBreakTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const remainingMinutes = 4 - minutes;
    const remainingSeconds = 60 - secs;
    
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!isRunning && !isPaused) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isOnBreak ? (
            <span className="flex items-center text-muted-foreground">
              <PauseCircle className="mr-2 h-5 w-5" />
              Break Time
            </span>
          ) : (
            <span className="flex items-center">
              {isPaused ? (
                <PauseCircle className="mr-2 h-5 w-5" />
              ) : (
                <PlayCircle className="mr-2 h-5 w-5 text-brand-red" />
              )}
              {taskTitle}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isOnBreak ? (
          <div className="space-y-6 text-center">
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Break ends in:</p>
              <div className="timer-value">{formatBreakTime(breakSeconds)}</div>
            </div>
            <Progress value={breakProgress} className="h-2 mt-2" />
            <Button onClick={onEndBreak} className="mt-4">
              End Break Early
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center items-center">
              <Timer className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="timer-value">{formatTime(seconds)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="activity-counter">
                <Keyboard className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono text-sm">{keyboardCount} keystrokes</span>
              </div>
              
              <div className="activity-counter">
                <MousePointer className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono text-sm">{mouseCount} movements</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              {isPaused ? (
                <Button className="flex-1" onClick={onResume}>
                  Resume
                </Button>
              ) : (
                <Button className="flex-1" variant="outline" onClick={onPause}>
                  Pause
                </Button>
              )}
              <Button
                className="flex-1"
                variant="outline"
                onClick={onComplete}
              >
                Complete
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={onBreak}
              >
                Take Break
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskTimer;
