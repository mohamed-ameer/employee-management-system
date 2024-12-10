from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, IsAdminUser, BasePermission, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import User, Company, Department, Employee, WorkflowLog
from .serializers import (
    UserSerializer, UserSerializerWithToken, CompanySerializer,
    DepartmentSerializer, EmployeeSerializer
)
import logging

# Get logger
logger = logging.getLogger('base')

# Custom permissions
class IsHR(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'hr'

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'manager'

class CanManageWorkflow(BasePermission):
    def has_permission(self, request, view):
        return request.user and (
            request.user.role in ['admin', 'hr'] or 
            request.user.has_perm('base.can_manage_workflow')
        )

# Authentication views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# User views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        logger.info(f"Attempting to register new user with email: {data.get('email')}")
        user = User.objects.create(
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            role=data.get('role', 'employee')
        )
        serializer = UserSerializerWithToken(user, many=False)
        logger.info(f"Successfully registered user: {user.email}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Failed to register user: {str(e)}")
        message = {'detail': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    data = request.data
    
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.username = user.email

    if data.get('password'):
        user.password = make_password(data['password'])

    user.save()
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    try:
        logger.info("Fetching all users")
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(id=pk)
        logger.info(f"Deleting user: {user.email}")
        user.delete()
        return Response({'detail': 'User deleted successfully'})
    except User.DoesNotExist:
        logger.error(f"User not found: {pk}")
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Company views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_companies(request):
    try:
        logger.info("Fetching all companies")
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching companies: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company(request, pk):
    company = get_object_or_404(Company, pk=pk)
    serializer = CompanySerializer(company)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR])
def create_company(request):
    try:
        logger.info(f"Creating new company: {request.data.get('name')}")
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            company = serializer.save()
            logger.info(f"Successfully created company: {company.name}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.warning(f"Invalid company data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error creating company: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR])
def update_company(request, pk):
    company = get_object_or_404(Company, pk=pk)
    try:
        logger.info(f"Updating company: {company.name} (ID: {pk})")
        serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Successfully updated company: {company.name}")
            return Response(serializer.data)
        logger.warning(f"Invalid update data for company {pk}: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error updating company {pk}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR])
def delete_company(request, pk):
    company = get_object_or_404(Company, pk=pk)
    if company.department_set.exists() or Employee.objects.filter(company=company).exists():
        logger.error(f"Cannot delete company with existing departments or employees: {pk}")
        return Response(
            {'detail': "Cannot delete company with existing departments or employees"},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        logger.info(f"Deleting company: {company.name} (ID: {pk})")
        company.delete()
        return Response({'detail': 'Company deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting company {pk}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Department views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_departments(request):
    # filter if ?company=1
    company_id = request.query_params.get('company')
    if company_id:
        departments = Department.objects.filter(company=company_id)
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)
    try:
        logger.info("Fetching all departments")
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching departments: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_department(request, pk):
    department = get_object_or_404(Department, pk=pk)
    serializer = DepartmentSerializer(department)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR|IsManager])
def create_department(request):
    try:
        logger.info(f"Creating new department: {request.data.get('name')}")
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            department = serializer.save()
            logger.info(f"Successfully created department: {department.name}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.warning(f"Invalid department data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error creating department: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR|IsManager])
def update_department(request, pk):
    department = get_object_or_404(Department, pk=pk)
    try:
        logger.info(f"Updating department: {department.name} (ID: {pk})")
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Successfully updated department: {department.name}")
            return Response(serializer.data)
        logger.warning(f"Invalid update data for department {pk}: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error updating department {pk}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR|IsManager])
def delete_department(request, pk):
    department = get_object_or_404(Department, pk=pk)
    if department.employee_set.exists():
        logger.error(f"Cannot delete department with existing employees: {pk}")
        return Response(
            {'detail': "Cannot delete department with existing employees"},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        logger.info(f"Deleting department: {department.name} (ID: {pk})")
        department.delete()
        return Response({'detail': 'Department deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting department {pk}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Employee views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employees(request):
    try:
        logger.info("Fetching all employees")
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching employees: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    serializer = EmployeeSerializer(employee)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR|IsManager])
def create_employee(request):
    try:
        # Create a mutable copy of the request data
        data = request.data.copy()
        email = data.get('email')
        
        logger.info(f"Creating new employee with email: {email}")
        
        # Create user account for employee if email doesn't exist
        try:
            user = User.objects.get(email=email)
            logger.info(f"Found existing user for email: {email}")
        except User.DoesNotExist:
            logger.info(f"Creating new user account for email: {email}")
            user = User.objects.create(
                username=email,
                email=email,
                password=make_password('temp123'),  # Temporary password
                role='employee'
            )
            data['user'] = user.id
        
        # Create employee
        data['company'] = request.data.get('company')
        data['department'] = request.data.get('department')
        data['designation'] = request.data.get('designation')
        data['workflow_state'] = 'application_received'
        data['address'] = request.data.get('address')
        data['mobile_number'] = request.data.get('mobile_number')
        data['hired_on'] = request.data.get('hired_on')

        # Check if employee with the same email already exists
        existing_employee = Employee.objects.filter(email=email).first()
        if existing_employee:
            logger.warning(f"Employee with email {email} already exists")
            return Response({'detail': f"Employee with email {email} already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if employee with the same mobile number already exists
        existing_employee = Employee.objects.filter(mobile_number=data['mobile_number']).first()
        if existing_employee:
            logger.warning(f"Employee with mobile number {data['mobile_number']} already exists")
            return Response({'detail': f"Employee with mobile number {data['mobile_number']} already exists"}, status=status.HTTP_400_BAD_REQUEST)  
        
        serializer = EmployeeSerializer(data=data)
        if serializer.is_valid():
            employee = serializer.save()
            logger.info(f"Successfully created employee: {employee.name}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logger.warning(f"Invalid employee data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error creating employee: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR|IsManager])
def update_employee(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    try:
        logger.info(f"Updating employee: {employee.name} (ID: {pk})")
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Successfully updated employee: {employee.name}")
            return Response(serializer.data)
        logger.warning(f"Invalid update data for employee {pk}: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error updating employee {pk}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser|IsHR|IsManager])
def delete_employee(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    try:
        logger.info(f"Deleting employee: {employee.name} (ID: {pk})")
        employee.delete()
        return Response({'detail': 'Employee deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting employee {pk}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated, CanManageWorkflow])
def transition_employee_state(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    new_state = request.data.get('new_state')
    notes = request.data.get('notes', '')

    try:
        old_state = employee.workflow_state
        employee.workflow_state = new_state
        
        # Additional data based on state
        if new_state == 'interview_scheduled':
            employee.interview_date = request.data.get('interview_date')
        elif new_state == 'not_accepted':
            employee.rejection_reason = request.data.get('rejection_reason')
        elif new_state == 'hired':
            employee.hired_on = request.data.get('hired_on')
            employee.status = 'active'

        employee.save()

        # Create workflow log
        WorkflowLog.objects.create(
            employee=employee,
            from_state=old_state,
            to_state=new_state,
            changed_by=request.user,
            notes=notes
        )

        logger.info(f"Successfully transitioned employee {pk} to {new_state}")
        return Response({'detail': f'Successfully transitioned to {new_state}'})
    except Exception as e:
        logger.error(f"Error transitioning employee {pk} to {new_state}: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee_workflow_history(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    workflow_logs = employee.workflow_logs.all().order_by('-changed_at')
    history = [{
        'from_state': log.from_state,
        'to_state': log.to_state,
        'changed_by': log.changed_by.get_full_name() if log.changed_by else 'System',
        'changed_at': log.changed_at,
        'notes': log.notes
    } for log in workflow_logs]
    return Response(history)
