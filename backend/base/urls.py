from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication URLs
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/register/', views.register_user, name='register'),
    
    # User Management URLs
    path('users/profile/', views.get_user_profile, name='user-profile'),
    path('users/profile/update/', views.update_user_profile, name='user-profile-update'),
    path('users/', views.get_users, name='users'),
    path('users/<str:pk>/', views.delete_user, name='user-delete'),
    
    # Company URLs
    path('companies/create/', views.create_company, name='company-create'),
    path('companies/<str:pk>/update/', views.update_company, name='company-update'),
    path('companies/<str:pk>/delete/', views.delete_company, name='company-delete'),
    path('companies/<str:pk>/', views.get_company, name='company-detail'),
    path('companies/', views.list_companies, name='companies'),
    
    # Department URLs
    path('departments/create/', views.create_department, name='department-create'),
    path('departments/<str:pk>/update/', views.update_department, name='department-update'),
    path('departments/<str:pk>/delete/', views.delete_department, name='department-delete'),
    path('departments/<str:pk>/', views.get_department, name='department-detail'),
    path('departments/', views.list_departments, name='departments'),
    
    # Employee URLs
    path('employees/create/', views.create_employee, name='employee-create'),
    path('employees/<str:pk>/update/', views.update_employee, name='employee-update'),
    path('employees/<str:pk>/delete/', views.delete_employee, name='employee-delete'),
    path('employees/<str:pk>/transition/', views.transition_employee_state, name='employee-transition'),
    path('employees/<str:pk>/workflow-history/', views.get_employee_workflow_history, name='employee-workflow-history'),
    path('employees/<str:pk>/', views.get_employee, name='employee-detail'),
    path('employees/', views.get_employees, name='employees'),
]