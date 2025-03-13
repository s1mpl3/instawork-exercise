from django.shortcuts import render
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Team, TeamMember, Role, Member
from .serializers import TeamSerializer, TeamMemberSerializer, TeamWithMembersSerializer, RoleSerializer, MemberSerializer
from django.db import models

# Create your views here.

@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return TeamWithMembersSerializer
        return TeamSerializer

    @action(detail=True, methods=['GET'])
    def members(self, request, pk=None):
        """List all members in a team"""
        team = self.get_object()
        team_members = TeamMember.objects.filter(team=team).select_related('member').order_by('member__last_name', 'member__first_name')
        serializer = TeamMemberSerializer(team_members, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        """Get teams with sorted team members"""
        return Team.objects.prefetch_related(
            models.Prefetch(
                'team_members',
                queryset=TeamMember.objects.select_related('member').order_by('member__last_name', 'member__first_name'),
                to_attr='sorted_team_members'
            )
        )

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

    def create(self, request, *args, **kwargs):
        """Add a member to a team"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Edit a team member's role and member information"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Update member information if provided
        if 'member' in request.data:
            member_data = request.data['member']
            member_serializer = MemberSerializer(instance.member, data=member_data, partial=True)
            member_serializer.is_valid(raise_exception=True)
            member_serializer.save()
        
        # Update role if provided
        if 'role_id' in request.data:
            serializer = self.get_serializer(instance, data={'role_id': request.data['role_id']}, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
        # Return updated data
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Remove a member from a team"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
