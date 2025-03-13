"use client";
import { Smile, Plus } from 'lucide-react';
import { Team, TeamMember } from "../types";

export default function TeamCard({ team, onSelect, onAdd }: { 
    team: Team, 
    onSelect: (member: TeamMember) => void,
    onAdd: () => void 
}) {
    return (
        <div className="p-4 border-1 rounded-lg">
            <div className="flex_row_between">
                <div>
                    <h1>Team: {team.name}</h1>
                    <div className="text-gray-600">
                        You have {team.team_members.length} members
                    </div>
                </div>
                <button 
                    onClick={onAdd}
                    className="button flex items-center gap-2"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="grid gap-4 border-t-1 border-gray-300 mt-4 pt-4">
                {team?.team_members.map((e: TeamMember) => (
                    <div onClick={() => onSelect(e)} key={e.id} className="px-4 cursor-pointer rounded-2xl py-2 hover:bg-blue-100 flex flex-row">
                        <div>
                            <Smile size={40} className={'text-green-300'} />
                        </div>
                        <div className="ml-4 flex flex-col">
                            <b className="font-semibold">{e.member.first_name} {e.member.last_name}</b>
                            <p className="text-gray-600">{e.member.email}</p>
                            <div className="flex_row text-sm">Role: <span className="text-gray-500">{e.role.name}</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
