from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from ..models import Company, Department, Employee, WorkflowLog
from datetime import datetime, timezone

User = get_user_model()

class UserModelTests(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'employee'
        }

    def test_create_user(self):
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.role, 'employee')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        admin_user.role = 'admin'  # Set role after creation
        admin_user.save()
        self.assertEqual(admin_user.role, 'admin')
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

class CompanyModelTests(TestCase):
    def setUp(self):
        self.company_data = {
            'name': 'Test Company'
        }

    def test_create_company(self):
        company = Company.objects.create(**self.company_data)
        self.assertEqual(company.name, self.company_data['name'])
        self.assertEqual(company.departments_count, 0)
        self.assertEqual(company.employees_count, 0)

    def test_company_str_representation(self):
        company = Company.objects.create(**self.company_data)
        self.assertEqual(str(company), self.company_data['name'])

class DepartmentModelTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.manager = User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.department_data = {
            'name': 'Test Department',
            'company': self.company,
            'manager': self.manager
        }

    def test_create_department(self):
        department = Department.objects.create(**self.department_data)
        self.assertEqual(department.name, self.department_data['name'])
        self.assertEqual(department.employees_count, 0)
        # Update company counts manually since signals might not work in tests
        self.company.update_counts()
        self.assertEqual(self.company.departments_count, 1)

    def test_department_str_representation(self):
        department = Department.objects.create(**self.department_data)
        expected_str = f"Test Department - Test Company"
        self.assertEqual(str(department), expected_str)

class EmployeeModelTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.user = User.objects.create_user(
            username='employee',
            email='employee@example.com',
            password='employee123'
        )
        self.employee_data = {
            'user': self.user,
            'name': 'Test Employee',
            'email': 'employee@example.com',
            'company': self.company,
            'department': self.department,
            'designation': 'Test Role',
            'workflow_state': 'application_received',
            'mobile_number': '+1234567890',
            'address': 'Test Address'
        }

    def test_create_employee(self):
        employee = Employee.objects.create(**self.employee_data)
        self.assertEqual(employee.name, self.employee_data['name'])
        self.assertEqual(employee.workflow_state, 'application_received')
        # Update counts manually since signals might not work in tests
        self.company.update_counts()
        self.department.update_counts()
        self.assertEqual(self.company.employees_count, 1)
        self.assertEqual(self.department.employees_count, 1)

    def test_invalid_workflow_transition(self):
        employee = Employee.objects.create(**self.employee_data)
        
        # Try to transition from application_received directly to hired
        employee.workflow_state = 'hired'
        with self.assertRaises(ValidationError):
            employee.save()

    def test_valid_workflow_transition(self):
        employee = Employee.objects.create(**self.employee_data)
        
        # Valid transition: application_received -> interview_scheduled
        employee.workflow_state = 'interview_scheduled'
        employee.interview_date = datetime.now(timezone.utc)  # Add required interview date
        employee.save()
        self.assertEqual(employee.workflow_state, 'interview_scheduled')

    def test_employee_str_representation(self):
        employee = Employee.objects.create(**self.employee_data)
        expected_str = f"Test Employee - Test Role (Test Company)"
        self.assertEqual(str(employee), expected_str)

class WorkflowLogModelTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.user = User.objects.create_user(
            username='employee',
            email='employee@example.com',
            password='employee123'
        )
        self.employee = Employee.objects.create(
            user=self.user,
            name='Test Employee',
            email='employee@example.com',
            company=self.company,
            department=self.department,
            workflow_state='application_received',
            mobile_number='+1234567890',
            address='Test Address',
            designation='Test Role'
        )
        self.changed_by = User.objects.create_user(
            username='hr',
            email='hr@example.com',
            password='hr123',
            role='hr'
        )

    def test_create_workflow_log(self):
        log = WorkflowLog.objects.create(
            employee=self.employee,
            from_state='application_received',
            to_state='interview_scheduled',
            changed_by=self.changed_by,
            notes='Scheduled interview'
        )
        self.assertEqual(log.from_state, 'application_received')
        self.assertEqual(log.to_state, 'interview_scheduled')
        self.assertEqual(log.changed_by, self.changed_by)

    def test_workflow_log_str_representation(self):
        log = WorkflowLog.objects.create(
            employee=self.employee,
            from_state='application_received',
            to_state='interview_scheduled',
            changed_by=self.changed_by
        )
        expected_str = f"Test Employee - application_received to interview_scheduled"
        self.assertEqual(str(log), expected_str)
