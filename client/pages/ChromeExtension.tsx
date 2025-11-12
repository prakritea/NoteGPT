import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ChromeExtension() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Add to Chrome</h1>
        <p className="text-muted-foreground max-w-sm">
          Install our Chrome extension to access study tools directly from your browser.
        </p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
