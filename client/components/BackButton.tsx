import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  return (
    <div className="container pt-6">
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link to="/dashboard" aria-label="Back to dashboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="-ml-1"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
