"use client";

import { type Team } from "@/types";
import TeamList from "@/components/TeamList";
import { useEffect, useState } from "react";
import { getTeams } from "@/app/actions";

export default function PageTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const fetchedTeams = await getTeams();
                setTeams(fetchedTeams);
                setError(null); // Clear any previous errors
            } catch {
                setError('Failed to fetch teams');
            }
        }
        fetchTeams();
    }, []);

    return (
        <div className="p-4">
            <h1>Teams</h1>
            {error && <div className="text-red-500">{error}</div>}
            <TeamList teams={teams} />
        </div>
    );
}