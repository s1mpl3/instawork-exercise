"use server";

import {Team, TeamMember, UpdateMemberData, Role} from "@/types";

const base_url = 'http://localhost:8000/api';

const routes = {
    teams: '/teams',
    roles: '/roles',
    teamMembers: '/team-members',
    members: '/members'
} as const;

type RouteName = keyof typeof routes;
type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const remoteApi = (
    name: RouteName,
    method: Method,
    params: Record<string, unknown>,
    id?: string | number
): Promise<Response> => {
    let endpoint = `${base_url}${routes[name]}`;
    
    // Append ID to the endpoint if provided
    if (id !== undefined) {
        endpoint += `/${id}/`;
    } else if (method !== 'POST' && method !== 'GET') {
        // For non-collection endpoints, ensure trailing slash
        endpoint += '/';
    }

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
    };

    if (method !== 'GET') options.body = JSON.stringify(params);

    return fetch(endpoint, options);
};

export async function getTeams(): Promise<Team[]> {
    const response = await remoteApi('teams', 'GET', {});
    if (!response.ok) {
        throw new Error('Failed to fetch teams');
    }
    return response.json();
}

export async function getTeamDetails(id: string): Promise<Team> {
    const response = await fetch(`${base_url}${routes.teams}/${id}/`);
    return response.json();
}

export async function getRoles(): Promise<Role[]> {
    const response = await remoteApi('roles', 'GET', {});
    return response.json();
}
/* TODO move to use remoteApi  */
export async function saveMember(id: string, data: UpdateMemberData): Promise<TeamMember> {
    const response = await fetch(`${base_url}${routes.teamMembers}/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            role_id: data.role,
            member: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone_number: data.phone_number
            }
        }),
    });
    return response.json();
}

export async function deleteTeamMember(id: string): Promise<void> {
    await fetch(`${base_url}${routes.teamMembers}/${id}/`, {
        method: 'DELETE',
    });
}

export async function createTeamMember(teamId: number, data: UpdateMemberData): Promise<TeamMember> {

    const memberResponse = await fetch(`${base_url}${routes.members}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number
        }),
    });
    
    if (!memberResponse.ok) {
        const errorData = await memberResponse.json();
        if (memberResponse.status === 400 && 'email' in errorData) {
            throw new Error('Email already in use');
        }
        throw new Error('Failed to create member');
    }
    
    const member = await memberResponse.json();

    const teamMemberResponse = await fetch(`${base_url}${routes.teamMembers}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            team: teamId,
            member_id: member.id,
            role_id: data.role
        }),
    });
    
    if (!teamMemberResponse.ok) {
        // If team member creation fails, we should probably delete the member we just created
        await fetch(`${base_url}${routes.members}/${member.id}/`, {
            method: 'DELETE',
        });
        throw new Error('Failed to create team member');
    }
    
    return teamMemberResponse.json();
}

