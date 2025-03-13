
export interface Role {
  id: number;
  code:string;
  name: 'admin' | 'regular';
}

export interface Team {
  id: string;
  name: string;
  description: string;
  member_count?: number;
  team_members: TeamMember[];
  created_at: string;
}

export interface TeamMember {
  id: number;
  team: number;
  member: Member;
  name: string;
  email: string;
  role: Role;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface UpdateMemberData {
  role: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}