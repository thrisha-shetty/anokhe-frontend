import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { toast } from "@/hooks/use-toast";
import { Users, Award, Activity } from "lucide-react";

const navItems = [
  { title: "My Team", url: "/employee", icon: Users },
  { title: "Nomination Board", url: "/employee/nominations", icon: Award },
  { title: "Org Pulse", url: "/employee/pulse", icon: Activity },
];

function MyTeam() {
  const { currentUser, arts, teams, joinTeam } = useApp();
  const userTeam = teams.find((t) => t.id === currentUser?.teamId);

  if (userTeam) {
    const art = arts.find((a) => a.id === userTeam.artId);
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Team: {userTeam.name}</CardTitle>
          <CardDescription>ART: {art?.name || "Unknown"} · {userTeam.members.length} members</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{userTeam.description || "No description"}</p>
        </CardContent>
      </Card>
    );
  }

  // Show available ARTs and teams to join
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Select a Team to Join</h3>
      {arts.length === 0 ? (
        <p className="text-muted-foreground">No ARTs available yet. Please wait for an Art Manager to create one.</p>
      ) : (
        arts.map((art) => {
          const artTeams = teams.filter((t) => t.artId === art.id);
          return (
            <Card key={art.id}>
              <CardHeader>
                <CardTitle>{art.name}</CardTitle>
                <CardDescription>Department: {art.department}</CardDescription>
              </CardHeader>
              <CardContent>
                {artTeams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No teams in this ART yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {artTeams.map((t) => (
                      <li key={t.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-sm text-muted-foreground">{t.description} · {t.members.length} members</p>
                        </div>
                        <Button size="sm" onClick={() => { joinTeam(t.id); toast({ title: "Joined!", description: `You joined ${t.name}.` }); }}>
                          Join
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

function NominationBoard() {
  const { currentUser, users, teams, awardCategories, nominations, nominate } = useApp();
  const myTeam = teams.find((t) => t.id === currentUser?.teamId);

  if (!myTeam) {
    return <p className="text-muted-foreground">Join a team first to nominate teammates.</p>;
  }

  const teammates = users.filter((u) => myTeam.members.includes(u.id) && u.id !== currentUser?.id);

  const handleNominate = (nomineeId: string, categoryId: string) => {
    // Check if already nominated this person for this category
    const existing = nominations.find(
      (n) => n.nominatorId === currentUser?.id && n.nomineeId === nomineeId && n.awardCategoryId === categoryId
    );
    if (existing) {
      toast({ title: "Already nominated", description: "You already nominated this person for this award.", variant: "destructive" });
      return;
    }
    nominate(nomineeId, categoryId);
    toast({ title: "Nominated!", description: "Your nomination has been recorded." });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Nomination Board</h3>
      {awardCategories.length === 0 ? (
        <p className="text-muted-foreground">No award categories available yet.</p>
      ) : teammates.length === 0 ? (
        <p className="text-muted-foreground">No teammates to nominate yet.</p>
      ) : (
        awardCategories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader><CardTitle className="text-base">{cat.name}</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teammates.map((u) => {
                  const count = nominations.filter((n) => n.nomineeId === u.id && n.awardCategoryId === cat.id).length;
                  return (
                    <li key={u.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <span className="font-medium">{u.firstName} {u.lastName}</span>
                        <span className="ml-2 text-sm text-muted-foreground">({count} nominations)</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleNominate(u.id, cat.id)}>
                        Nominate
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function OrgPulse() {
  const { activityFeed } = useApp();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Organization Pulse</h3>
      {activityFeed.length === 0 ? (
        <p className="text-muted-foreground">No activity yet.</p>
      ) : (
        activityFeed.map((event) => (
          <Card key={event.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Activity className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

const EmployeeDashboard = () => (
  <DashboardLayout navItems={navItems} roleLabel="Employee" roleColorClass="bg-role-employee text-role-employee-foreground">
    <Routes>
      <Route index element={<MyTeam />} />
      <Route path="nominations" element={<NominationBoard />} />
      <Route path="pulse" element={<OrgPulse />} />
      <Route path="*" element={<Navigate to="/employee" replace />} />
    </Routes>
  </DashboardLayout>
);

export default EmployeeDashboard;
