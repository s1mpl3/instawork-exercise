import { Team } from "@/types";
import Link from 'next/link';

interface TeamsCardProps {
    teams: Team[];
}

const TeamList =  function({ teams }: TeamsCardProps) {
    return (
        <div className="">
            {teams.map((team) => (
                <Link href={`/teams/${team.id}`} key={team.id}>
                    <div className="p-3 border rounded-lg cursor-pointer mb-4 hover:bg-blue-100">
                        <b className="text-xl font-semibold">{team.name}</b>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {team?.member_count} member{team?.member_count !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default TeamList;