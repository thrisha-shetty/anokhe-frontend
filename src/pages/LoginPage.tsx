import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { toast } from "@/hooks/use-toast";
import type { UserRole } from "@/types";
import { Shield, Palette, User } from "lucide-react";

const roles: { role: UserRole; label: string; icon: React.ElementType; colorClass: string }[] = [
  { role: "admin", label: "Admin", icon: Shield, colorClass: "border-role-admin" },
  { role: "art_manager", label: "Art Manager", icon: Palette, colorClass: "border-role-manager" },
  { role: "employee", label: "Employee", icon: User, colorClass: "border-role-employee" },
];

const LoginPage = () => {
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [forms, setForms] = useState(
    Object.fromEntries(roles.map((r) => [r.role, { firstName: "", lastName: "", password: "" }]))
  );

  const handleChange = (role: UserRole, field: string, value: string) => {
    setForms((prev) => ({ ...prev, [role]: { ...prev[role], [field]: value } }));
  };

  const handleSubmit = (role: UserRole) => {
    const { firstName, lastName, password } = forms[role];
    if (!firstName || !lastName || !password) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    const user = login(firstName, lastName, password, role);
    if (user) {
      if (user.status === "approved") {
        navigate(`/${role === "art_manager" ? "manager" : role}`);
      } else if (user.status === "pending") {
        navigate("/pending");
      } else {
        toast({ title: "Declined", description: "Your request has been declined.", variant: "destructive" });
      }
    } else {
      // Register new user
      register(firstName, lastName, password, role);
      toast({ title: "Request Sent", description: "Your registration request has been sent for approval." });
      navigate("/pending");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6">
      <h1 className="text-3xl font-bold mb-2">ART Management Portal</h1>
      <p className="text-muted-foreground mb-8">Select your role and log in or register</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map(({ role, label, icon: Icon, colorClass }) => (
          <Card key={role} className={`border-t-4 ${colorClass}`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle>{label}</CardTitle>
              <CardDescription>Login or register as {label.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>First Name</Label>
                <Input
                  placeholder="First name"
                  value={forms[role].firstName}
                  onChange={(e) => handleChange(role, "firstName", e.target.value)}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  placeholder="Last name"
                  value={forms[role].lastName}
                  onChange={(e) => handleChange(role, "lastName", e.target.value)}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={forms[role].password}
                  onChange={(e) => handleChange(role, "password", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleSubmit(role)}>
                Login / Register
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Seed admin: Super Admin / admin123
      </p>
    </div>
  );
};

export default LoginPage;
