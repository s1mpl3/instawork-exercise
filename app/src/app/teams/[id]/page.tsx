"use client";

import { useParams } from 'next/navigation';
import { Team, TeamMember, Role } from "@/types";
import { useEffect, useState, useCallback } from 'react';
import { getTeamDetails, getRoles } from "@/app/actions";
import Link from "next/link";
import TeamCard from "@/components/TeamCard";
import TeamMemberDetails from "@/components/TeamMemberDetails";

export default function TeamDetailsPage() {
    const { id } = useParams();
    const [member, setMember] = useState<TeamMember | null>(null);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [team, setTeam] = useState<Team | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTeamDetails = useCallback(async () => {
        try {
            const teamDetails = await getTeamDetails(id as string);
            setTeam(teamDetails);
            setError(null);
        } catch {
            setError('Failed to fetch team details');
        }
    }, [id]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setRoles(await getRoles());
            } catch {
                setError('Failed to fetch roles');
            }
        };
        
        fetchRoles();
        fetchTeamDetails();
    }, [id, fetchTeamDetails]);

    const handleCloseForm = async () => {
        console.log('Closing form');
        setMember(null);
        setIsAddingMember(false);
    };

    const handleMemberSave = async () => {
        await fetchTeamDetails();
        setMember(null);
        setIsAddingMember(false);
    };

    const handleAddMember = () => {
        setMember(null);
        setIsAddingMember(true);
    };

    const handleSelectMember = (selectedMember: TeamMember) => {
        setIsAddingMember(false);
        setMember(selectedMember);
    };

    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!team) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4 mx-auto">
            {!member && !isAddingMember ? (
                <div>
                    <TeamCard
                    team={team} 
                    onSelect={handleSelectMember}
                    onAdd={handleAddMember}
                />
                    <div className="mt-10"><Link href={'/teams'} className="link">All Teams </Link></div>
                </div>
            ) : (
                <TeamMemberDetails
                    member={member || undefined}
                    teamId={isAddingMember ? parseInt(id as string) : undefined}
                    roles={roles} 
                    onSave={handleMemberSave}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}