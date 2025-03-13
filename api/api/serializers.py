from rest_framework import serializers
from .models import Team, Member, Role, TeamMember

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number']

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'code', 'name']

class TeamMemberSerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    member_id = serializers.IntegerField(write_only=True)
    role_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'member', 'role', 'member_id', 'role_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TeamSerializer(serializers.ModelSerializer):
    team_members = TeamMemberSerializer(source='team_members.all', many=True, read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'created_at', 'team_members']

class TeamWithMembersSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'created_at', 'member_count']

    def get_member_count(self, obj):
        return obj.team_members.count()