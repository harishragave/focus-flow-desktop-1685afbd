
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export interface Screenshot {
  id: string;
  taskId: string;
  taskTitle: string;
  timestamp: Date;
  imageUrl: string;
}

interface ScreenshotViewerProps {
  screenshots: Screenshot[];
}

const ScreenshotViewer = ({ screenshots }: ScreenshotViewerProps) => {
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);
  
  // Group screenshots by date
  const groupedScreenshots = screenshots.reduce((acc, screenshot) => {
    const dateStr = format(screenshot.timestamp, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(screenshot);
    return acc;
  }, {} as Record<string, Screenshot[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedScreenshots).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Screenshots</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-150px)]">
          {sortedDates.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No screenshots available</p>
          ) : (
            sortedDates.map(dateStr => (
              <div key={dateStr} className="mb-6">
                <h3 className="text-sm font-medium mb-3 sticky top-0 bg-background py-1">
                  {format(new Date(dateStr), "MMMM d, yyyy")}
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
                  {groupedScreenshots[dateStr].map((screenshot) => (
                    <div 
                      key={screenshot.id}
                      className="screenshot-card cursor-pointer"
                      onClick={() => setSelectedImage(screenshot)}
                    >
                      <div className="aspect-video bg-secondary relative">
                        <img
                          src={screenshot.imageUrl}
                          alt={`Screenshot for ${screenshot.taskTitle}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-2 text-xs">
                        <p className="font-medium truncate">{screenshot.taskTitle}</p>
                        <p className="text-muted-foreground">
                          {format(screenshot.timestamp, "h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImage?.taskTitle} - {selectedImage && format(selectedImage.timestamp, "MMM d, yyyy h:mm a")}
              </DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="mt-2 overflow-hidden rounded-md">
                <img
                  src={selectedImage.imageUrl}
                  alt={`Screenshot for ${selectedImage.taskTitle}`}
                  className="object-contain w-full"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ScreenshotViewer;
