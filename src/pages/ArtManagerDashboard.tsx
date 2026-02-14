import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { toast } from "@/hooks/use-toast";
import { ClipboardList, Layers, Users, CalendarDays, Award, Trophy, Trash2 } from "lucide-react";

const navItems = [
  { title: "Employee Requests", url: "/manager", icon: ClipboardList },
  { title: "Manage ARTs", url: "/manager/arts", icon: Layers },
  { title: "Manage Teams", url: "/manager/teams", icon: Users },
  { title: "Create Sprint", url: "/manager/sprints", icon: CalendarDays },
  { title: "Manage Awards", url: "/manager/awards", icon: Award },
  { title: "Leaderboard", url: "/manager/leaderboard", icon: Trophy },
];

function EmployeeRequests() {
  const { users, approveUser, declineUser } = useApp();
  const pending = users.filter((u) => u.role === "employee" && u.status === "pending");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Requests</CardTitle>
        <CardDescription>{pending.length} pending</CardDescription>
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((u) => (
              <li key={u.id} className="flex items-center justify-between rounded-md border p-3">
                <span className="font-medium">{u.firstName} {u.lastName}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { approveUser(u.id); toast({ title: "Approved" }); }}>Accept</Button>
                  <Button size="sm" variant="destructive" onClick={() => { declineUser(u.id); toast({ title: "Declined" }); }}>Decline</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ManageARTs() {
  const { arts, teams, createART, createTeam, deleteTeam, currentUser } = useApp();
  const [artForm, setArtForm] = useState({ name: "", department: "" });
  const [teamForms, setTeamForms] = useState<Record<string, { name: string; description: string }>>({});

  const handleCreateART = () => {
    if (!artForm.name || !artForm.department) { toast({ title: "Error", description: "Fill all fields.", variant: "destructive" }); return; }
    createART(artForm.name, artForm.department);
    setArtForm({ name: "", department: "" });
    toast({ title: "ART Created" });
  };

  const handleCreateTeam = (artId: string) => {
    const f = teamForms[artId];
    if (!f?.name) { toast({ title: "Error", description: "Team name required.", variant: "destructive" }); return; }
    createTeam(f.name, f.description || "", artId);
    setTeamForms((prev) => ({ ...prev, [artId]: { name: "", description: "" } }));
    toast({ title: "Team Created" });
  };

  const myArts = arts.filter((a) => a.createdBy === currentUser?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Create New ART</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>ART Name</Label><Input value={artForm.name} onChange={(e) => setArtForm((p) => ({ ...p, name: e.target.value }))} /></div>
          <div><Label>Department</Label><Input value={artForm.department} onChange={(e) => setArtForm((p) => ({ ...p, department: e.target.value }))} /></div>
          <Button onClick={handleCreateART}>Create ART</Button>
        </CardContent>
      </Card>

      {myArts.map((art) => {
        const artTeams = teams.filter((t) => t.artId === art.id);
        const tf = teamForms[art.id] || { name: "", description: "" };
        return (
          <Card key={art.id}>
            <CardHeader>
              <CardTitle>{art.name}</CardTitle>
              <CardDescription>Department: {art.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {artTeams.length > 0 && (
                <div className="space-y-2">
                  {artTeams.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.description} · {t.members.length} members</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => { deleteTeam(t.id); toast({ title: "Team Deleted" }); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm font-medium">Add Team to {art.name}</p>
                <Input placeholder="Team name" value={tf.name} onChange={(e) => setTeamForms((p) => ({ ...p, [art.id]: { ...tf, name: e.target.value } }))} />
                <Input placeholder="Description" value={tf.description} onChange={(e) => setTeamForms((p) => ({ ...p, [art.id]: { ...tf, description: e.target.value } }))} />
                <Button size="sm" onClick={() => handleCreateTeam(art.id)}>Add Team</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ManageTeams() {
  const { teams, arts } = useApp();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">All Teams</h3>
      {teams.length === 0 ? (
        <p className="text-muted-foreground">No teams yet. Create them under Manage ARTs.</p>
      ) : (
        teams.map((t) => {
          const art = arts.find((a) => a.id === t.artId);
          return (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription>ART: {art?.name || "Unknown"} · {t.members.length} members</CardDescription>
              </CardHeader>
              <CardContent><p className="text-sm">{t.description || "No description"}</p></CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

function CreateSprint() {
  const { teams, createSprint } = useApp();
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "", teamId: "" });

  const handleSubmit = () => {
    if (!form.name || !form.startDate || !form.endDate || !form.teamId) {
      toast({ title: "Error", description: "Fill all fields.", variant: "destructive" }); return;
    }
    createSprint(form.name, form.startDate, form.endDate, form.teamId);
    setForm({ name: "", startDate: "", endDate: "", teamId: "" });
    toast({ title: "Sprint Created" });
  };

  return (
    <Card className="max-w-md">
      <CardHeader><CardTitle>Create Sprint</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div><Label>Sprint Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
        <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} /></div>
        <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} /></div>
        <div>
          <Label>Team</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.teamId} onChange={(e) => setForm((p) => ({ ...p, teamId: e.target.value }))}>
            <option value="">Select team</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <Button className="w-full" onClick={handleSubmit}>Create Sprint</Button>
      </CardContent>
    </Card>
  );
}

function ManageAwards() {
  const { awardCategories, addAwardCategory, deleteAwardCategory } = useApp();
  const [name, setName] = useState("");
  return (
    <Card className="max-w-md">
      <CardHeader><CardTitle>Manage Awards</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Award category name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={() => { if (name) { addAwardCategory(name); setName(""); toast({ title: "Award Added" }); } }}>Add</Button>
        </div>
        {awardCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No award categories yet.</p>
        ) : (
          <ul className="space-y-2">
            {awardCategories.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-md border p-3">
                <span>{a.name}</span>
                <Button size="icon" variant="ghost" onClick={() => { deleteAwardCategory(a.id); toast({ title: "Deleted" }); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Leaderboard() {
  const { awardCategories, nominations, users } = useApp();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Nomination Leaderboard</h3>
      {awardCategories.length === 0 ? (
        <p className="text-muted-foreground">No award categories yet.</p>
      ) : (
        awardCategories.map((cat) => {
          const catNoms = nominations.filter((n) => n.awardCategoryId === cat.id);
          const counts: Record<string, number> = {};
          catNoms.forEach((n) => { counts[n.nomineeId] = (counts[n.nomineeId] || 0) + 1; });
          const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
          const leader = sorted[0];
          const leaderUser = leader ? users.find((u) => u.id === leader[0]) : null;
          return (
            <Card key={cat.id}>
              <CardHeader>
                <CardTitle className="text-base">{cat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderUser ? (
                  <p className="font-medium">{leaderUser.firstName} {leaderUser.lastName} — {leader[1]} nomination(s)</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No nominations yet.</p>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

const ArtManagerDashboard = () => (
  <DashboardLayout navItems={navItems} roleLabel="Art Manager" roleColorClass="bg-role-manager text-role-manager-foreground">
    <Routes>
      <Route index element={<EmployeeRequests />} />
      <Route path="arts" element={<ManageARTs />} />
      <Route path="teams" element={<ManageTeams />} />
      <Route path="sprints" element={<CreateSprint />} />
      <Route path="awards" element={<ManageAwards />} />
      <Route path="leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  </DashboardLayout>
);

export default ArtManagerDashboard;
