"use client";

import { useState, useMemo } from 'react';
import { type TeamMember, type Role } from "@/types/index";
import { saveMember, deleteTeamMember, createTeamMember } from "@/app/actions";


interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: number;
}

interface TeamMemberDetailsProps {
    member?: TeamMember;
    teamId?: number;
    roles: Role[];
    onSave?: () => void;
    onClose?: () => void;
}

const TeamMemberDetails = ({ member, teamId, roles, onSave, onClose }: TeamMemberDetailsProps) => {
    const isNewMember = !member;

    const initialData: FormData = useMemo(() => ({
        first_name: member?.member.first_name ?? '',
        last_name: member?.member.last_name ?? '',
        email: member?.member.email ?? '',
        phone_number: member?.member.phone_number ?? '',
        role: member?.role.id ?? roles?.find(r=>r.code =='REGULAR').id ?? 2,
    }), [member, roles]);

    const [data, setData] = useState<FormData>(initialData);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasChanges = useMemo(() => {
        return Object.keys(initialData).some(key => initialData[key as keyof FormData] !== data[key as keyof FormData]);
    }, [initialData, data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: name === 'role' ? Number(value) : value,
        }));
    };

    const handleRoleChange = (roleId: number) => {
        setData((prev) => ({
            ...prev,
            role: roleId,
        }));
    };

    const handleReset = () => {
        setData(initialData);
        setError(null);
    };

    const handleDelete = async () => {
        if (!member || !window.confirm('Are you sure you want to remove this member from the team?')) {
            return;
        }
        
        setError(null);
        setDeleting(true);
        try {
            await deleteTeamMember(member.id.toString());
            if (onSave) {
                onSave();
            }
        } catch (error) {
            console.error('Error deleting team member:', error);
            setError('Failed to delete team member. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isNewMember && !teamId) {
            setError('Team ID is required to create a new member');
            return;
        }

        setError(null);
        setSaving(true);
        try {
            if (isNewMember) {
                await createTeamMember(teamId!, data);
            } else {
                await saveMember(member!.id.toString(), data);
            }
            if (onSave) {
                onSave();
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 border-1 rounded-lg min-w-[320px] max-w-[800px]">
            <div className="flex_row_between">
                <h1>{isNewMember ? 'Add New Member' : 'Edit Member'}</h1>
                <div onClick={onClose} className="link">
                    Back
                </div>
            </div>

            <div className="grid gap-4 border-t-1 border-gray-300 mt-4 pt-4 ">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <b>Info</b>
                            <input 
                                type="text" 
                                className="field-border" 
                                name="first_name" 
                                value={data.first_name} 
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                            <input 
                                type="text" 
                                className="field-border" 
                                name="last_name" 
                                value={data.last_name} 
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                            <input 
                                type="email" 
                                className="field-border" 
                                name="email" 
                                value={data.email} 
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                            <input 
                                type="tel" 
                                className="field-border" 
                                name="phone_number" 
                                value={data.phone_number} 
                                onChange={handleChange}
                                placeholder="Phone Number"
                                required
                            />
                            <b>Role</b>
                            <div className="mb-4">
                                {roles.map((role) => (
                                    <div 
                                        className={`border field-border flex_row_between cursor-pointer hover:bg-blue-50 ${data.role === role.id ? ' bg-blue-100 ' : ''}`} 
                                        key={role.id} 
                                        onClick={() => handleRoleChange(role.id)}
                                    >
                                        <div>{role.name}</div>
                                        <div>
                                            <input 
                                                type="radio" 
                                                name="role" 
                                                value={role.id} 
                                                checked={data.role === role.id} 
                                                onChange={handleChange}
                                            /> 
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-500 mb-4">{error}</div>
                    )}
                    <div className="flex flex-row justify-between items-center">
                        {!isNewMember && (
                            <button 
                                type="button" 
                                className="button_delete bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Removing Member from the Team...' : 'Delete'}
                            </button>
                        )}
                        <div className={`flex flex-row gap-4 ${isNewMember ? 'ml-auto' : ''}`}>
                            {hasChanges && (
                                <button type="button" className="button_reset" onClick={handleReset}>Reset</button>
                            )}

                            <button
                                type="submit" 
                                className="button"
                                disabled={saving || (!hasChanges && !isNewMember)}
                            >
                                {saving ? 'Saving...' : isNewMember ? 'Add Member' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamMemberDetails;