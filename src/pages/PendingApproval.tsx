import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const PendingApproval = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6 text-center">
      <Clock className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Pending Approval</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Your registration request has been submitted. You'll be able to access your dashboard once approved by the appropriate authority.
      </p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Back to Login
      </Button>
    </div>
  );
};

export default PendingApproval;
