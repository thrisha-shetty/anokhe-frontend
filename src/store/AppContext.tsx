import React, { createContext, useContext, useState, useCallback } from "react";
import type { User, ART, Team, Sprint, AwardCategory, Nomination, ActivityEvent, UserRole } from "@/types";

// Seed one approved admin so the app is bootstrappable
const seedAdmin: User = {
  id: "admin-1",
  firstName: "Super",
  lastName: "Admin",
  password: "admin123",
  role: "admin",
  status: "approved",
};

interface AppState {
  users: User[];
  arts: ART[];
  teams: Team[];
  sprints: Sprint[];
  awardCategories: AwardCategory[];
  nominations: Nomination[];
  activityFeed: ActivityEvent[];
  currentUser: User | null;
}

interface AppContextValue extends AppState {
  // Auth
  login: (firstName: string, lastName: string, password: string, role: UserRole) => User | null;
  register: (firstName: string, lastName: string, password: string, role: UserRole) => void;
  logout: () => void;

  // Approval
  approveUser: (userId: string) => void;
  declineUser: (userId: string) => void;

  // ART
  createART: (name: string, department: string) => void;

  // Teams
  createTeam: (name: string, description: string, artId: string) => void;
  deleteTeam: (teamId: string) => void;
  joinTeam: (teamId: string) => void;

  // Sprints
  createSprint: (name: string, startDate: string, endDate: string, teamId: string) => void;

  // Awards
  addAwardCategory: (name: string) => void;
  deleteAwardCategory: (id: string) => void;

  // Nominations
  nominate: (nomineeId: string, awardCategoryId: string) => void;

  // Art Manager management
  addArtManager: (firstName: string, lastName: string, email: string, department: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

let idCounter = 100;
const genId = () => String(++idCounter);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([seedAdmin]);
  const [arts, setArts] = useState<ART[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [awardCategories, setAwardCategories] = useState<AwardCategory[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addActivity = useCallback((type: ActivityEvent["type"], message: string) => {
    setActivityFeed((prev) => [
      { id: genId(), type, message, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const login = useCallback(
    (firstName: string, lastName: string, password: string, role: UserRole): User | null => {
      const found = users.find(
        (u) =>
          u.firstName.toLowerCase() === firstName.toLowerCase() &&
          u.lastName.toLowerCase() === lastName.toLowerCase() &&
          u.password === password &&
          u.role === role
      );
      if (found) {
        setCurrentUser(found);
        return found;
      }
      return null;
    },
    [users]
  );

  const register = useCallback(
    (firstName: string, lastName: string, password: string, role: UserRole) => {
      const newUser: User = {
        id: genId(),
        firstName,
        lastName,
        password,
        role,
        status: "pending",
      };
      setUsers((prev) => [...prev, newUser]);
    },
    []
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  const approveUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
    );
    addActivity("member_joined", `A new member has been approved and joined the organization.`);
  }, [addActivity]);

  const declineUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "declined" as const } : u))
    );
  }, []);

  const createART = useCallback(
    (name: string, department: string) => {
      if (!currentUser) return;
      setArts((prev) => [...prev, { id: genId(), name, department, createdBy: currentUser.id }]);
    },
    [currentUser]
  );

  const createTeam = useCallback(
    (name: string, description: string, artId: string) => {
      const newTeam: Team = { id: genId(), name, description, artId, members: [] };
      setTeams((prev) => [...prev, newTeam]);
      addActivity("team_created", `Team "${name}" has been created.`);
    },
    [addActivity]
  );

  const deleteTeam = useCallback((teamId: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
  }, []);

  const joinTeam = useCallback(
    (teamId: string) => {
      if (!currentUser) return;
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId ? { ...t, members: [...t.members, currentUser.id] } : t
        )
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, teamId } : u))
      );
      setCurrentUser((prev) => (prev ? { ...prev, teamId } : prev));
      addActivity("member_joined", `${currentUser.firstName} joined a team.`);
    },
    [currentUser, addActivity]
  );

  const createSprint = useCallback(
    (name: string, startDate: string, endDate: string, teamId: string) => {
      setSprints((prev) => [...prev, { id: genId(), name, startDate, endDate, teamId }]);
      addActivity("sprint_created", `Sprint "${name}" has been created.`);
    },
    [addActivity]
  );

  const addAwardCategory = useCallback(
    (name: string) => {
      setAwardCategories((prev) => [...prev, { id: genId(), name }]);
      addActivity("award_added", `Award category "${name}" has been added.`);
    },
    [addActivity]
  );

  const deleteAwardCategory = useCallback((id: string) => {
    setAwardCategories((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const nominate = useCallback(
    (nomineeId: string, awardCategoryId: string) => {
      if (!currentUser || !currentUser.teamId) return;
      setNominations((prev) => [
        ...prev,
        { id: genId(), nominatorId: currentUser.id, nomineeId, awardCategoryId, teamId: currentUser.teamId! },
      ]);
      addActivity("nomination", `A new nomination has been submitted.`);
    },
    [currentUser, addActivity]
  );

  const addArtManager = useCallback(
    (firstName: string, lastName: string, email: string, department: string) => {
      const newUser: User = {
        id: genId(),
        firstName,
        lastName,
        password: "manager123",
        role: "art_manager",
        status: "approved",
        email,
        department,
      };
      setUsers((prev) => [...prev, newUser]);
      addActivity("member_joined", `Art Manager ${firstName} ${lastName} has been added.`);
    },
    [addActivity]
  );

  return (
    <AppContext.Provider
      value={{
        users,
        arts,
        teams,
        sprints,
        awardCategories,
        nominations,
        activityFeed,
        currentUser,
        login,
        register,
        logout,
        approveUser,
        declineUser,
        createART,
        createTeam,
        deleteTeam,
        joinTeam,
        createSprint,
        addAwardCategory,
        deleteAwardCategory,
        nominate,
        addArtManager,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
