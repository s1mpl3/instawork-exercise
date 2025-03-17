"use client";

import { type Team } from "@/types";
import TeamList from "@/components/TeamList";
import { useEffect, useState } from "react";
import { getTeams } from "@/app/actions";

const delay:number = 2000
export default function PageTeams() {
    const [teams, setTeams] = useState<Team[]>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTeams() {
            console.log('call this teams')
            try {
                const fetchedTeams = await getTeams();
                setTeams(fetchedTeams);
                setError(null); // Clear any previous errors
            } catch {
                setError('Failed to fetch teams');
            }
        }
        setTimeout(fetchTeams, delay);
    }, []);

    if (!teams) return <div className="p-4">Loading... <span className="text-sm text-red-400">(with a fake delay of {delay} secs.)</span></div>;

    return (
        <div className="p-4">
            <h1>Teams</h1>
            {error && <div className="text-red-500">{error}</div>}
            <TeamList teams={teams} />
        </div>
    );
}