from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'teams', views.TeamViewSet)
router.register(r'team-members', views.TeamMemberViewSet)
router.register(r'roles', views.RoleViewSet)
router.register(r'members', views.MemberViewSet)

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('', include(router.urls)),
] 