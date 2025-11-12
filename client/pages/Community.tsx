import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Community() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground max-w-sm">
          Join our community to connect with other learners, share resources, and collaborate.
        </p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
