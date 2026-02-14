import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { toast } from "@/hooks/use-toast";
import { ClipboardList, UserPlus } from "lucide-react";

const navItems = [
  { title: "Pending Requests", url: "/admin", icon: ClipboardList },
  { title: "Add Art Manager", url: "/admin/add-manager", icon: UserPlus },
];

function PendingRequests() {
  const { users, approveUser, declineUser } = useApp();
  const pendingAdmins = users.filter((u) => u.role === "admin" && u.status === "pending");
  const pendingManagers = users.filter((u) => u.role === "art_manager" && u.status === "pending");

  const handleApprove = (id: string) => {
    approveUser(id);
    toast({ title: "Approved", description: "User has been approved." });
  };
  const handleDecline = (id: string) => {
    declineUser(id);
    toast({ title: "Declined", description: "User has been declined.", variant: "destructive" });
  };

  const renderList = (title: string, list: typeof pendingAdmins) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{list.length} pending request(s)</CardDescription>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((u) => (
              <li key={u.id} className="flex items-center justify-between rounded-md border p-3">
                <span className="font-medium">{u.firstName} {u.lastName}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(u.id)}>Accept</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDecline(u.id)}>Decline</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
      {renderList("Admin Requests", pendingAdmins)}
      {renderList("Art Manager Requests", pendingManagers)}
    </div>
  );
}

function AddArtManager() {
  const { addArtManager } = useApp();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", department: "" });

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.department) {
      toast({ title: "Error", description: "Fill all fields.", variant: "destructive" });
      return;
    }
    addArtManager(form.firstName, form.lastName, form.email, form.department);
    toast({ title: "Added", description: "Art Manager has been added." });
    setForm({ firstName: "", lastName: "", email: "", department: "" });
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Add New Art Manager</CardTitle>
        <CardDescription>Create a pre-approved Art Manager account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div><Label>First Name</Label><Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} /></div>
        <div><Label>Last Name</Label><Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} /></div>
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
        <div><Label>Department</Label><Input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} /></div>
        <Button className="w-full" onClick={handleSubmit}>Add Art Manager</Button>
      </CardContent>
    </Card>
  );
}

const AdminDashboard = () => (
  <DashboardLayout navItems={navItems} roleLabel="Admin" roleColorClass="bg-role-admin text-role-admin-foreground">
    <Routes>
      <Route index element={<PendingRequests />} />
      <Route path="add-manager" element={<AddArtManager />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
