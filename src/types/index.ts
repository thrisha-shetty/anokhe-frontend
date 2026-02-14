export type UserRole = "admin" | "art_manager" | "employee";

export type RequestStatus = "pending" | "approved" | "declined";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  status: RequestStatus;
  email?: string;
  department?: string;
  teamId?: string;
  artId?: string;
}

export interface ART {
  id: string;
  name: string;
  department: string;
  createdBy: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  artId: string;
  members: string[]; // user IDs
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teamId: string;
}

export interface AwardCategory {
  id: string;
  name: string;
}

export interface Nomination {
  id: string;
  nominatorId: string;
  nomineeId: string;
  awardCategoryId: string;
  teamId: string;
}

export interface ActivityEvent {
  id: string;
  type: "team_created" | "sprint_created" | "award_added" | "member_joined" | "nomination";
  message: string;
  timestamp: string;
}
