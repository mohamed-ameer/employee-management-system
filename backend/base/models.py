from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator, RegexValidator
from datetime import date
from django.core.exceptions import ValidationError

class User(AbstractUser):
    ROLES = (
        ('admin', 'Admin'),
        ('hr', 'HR'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    role = models.CharField(max_length=10, choices=ROLES, default='employee')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    class Meta:
        permissions = [
            ("can_view_all_employees", "Can view all employees"),
            ("can_manage_workflow", "Can manage workflow states"),
            ("can_manage_departments", "Can manage departments"),
        ]

class Company(models.Model):
    name = models.CharField(max_length=200, unique=True)
    departments_count = models.PositiveIntegerField(default=0, editable=False)
    employees_count = models.PositiveIntegerField(default=0, editable=False)

    def update_counts(self):
        self.departments_count = self.department_set.count()
        self.employees_count = Employee.objects.filter(company=self).count()
        self.save()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"

class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    employees_count = models.PositiveIntegerField(default=0, editable=False)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')

    def update_counts(self):
        self.employees_count = self.employee_set.count()
        self.save()

    def __str__(self):
        return f"{self.company.name} - {self.name}"

    class Meta:
        unique_together = ('company', 'name')

class Employee(models.Model):
    WORKFLOW_STATES = (
        ('application_received', 'Application Received'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted')
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('onboarding', 'Onboarding'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    workflow_state = models.CharField(max_length=50, choices=WORKFLOW_STATES, default='application_received')
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    mobile_number = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Mobile number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )
    address = models.TextField()
    designation = models.CharField(max_length=200)
    hired_on = models.DateField(null=True, blank=True)
    days_employed = models.PositiveIntegerField(default=0, editable=False)
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Calculate days employed if hired
        if self.hired_on and self.status == 'active':
            self.days_employed = (date.today() - self.hired_on).days

        # Validate workflow transitions
        if self.pk:
            old_instance = Employee.objects.get(pk=self.pk)
            if old_instance.workflow_state != self.workflow_state:
                self.validate_workflow_transition(old_instance.workflow_state, self.workflow_state)

        super().save(*args, **kwargs)

        # Update counts for company and department
        self.company.update_counts()
        self.department.update_counts()

    def validate_workflow_transition(self, old_state, new_state):
        valid_transitions = {
            'application_received': ['interview_scheduled', 'not_accepted'],
            'interview_scheduled': ['hired', 'not_accepted'],
            'hired': [],  # No transitions allowed from hired state
            'not_accepted': [],  # No transitions allowed from not accepted state
        }

        if new_state not in valid_transitions.get(old_state, []):
            raise ValidationError(f'Invalid workflow transition from {old_state} to {new_state}')

        # Additional validations based on state
        if new_state == 'interview_scheduled' and not self.interview_date:
            raise ValidationError('Interview date is required when scheduling an interview')
        if new_state == 'not_accepted' and not self.rejection_reason:
            raise ValidationError('Rejection reason is required when rejecting an application')
        if new_state == 'hired' and not self.hired_on:
            raise ValidationError('Hire date is required when marking as hired')

    def clean(self):
        from django.core.exceptions import ValidationError
        # Ensure department belongs to selected company
        if self.department and self.company and self.department.company != self.company:
            raise ValidationError({
                'department': 'Selected department does not belong to the selected company.'
            })

    def __str__(self):
        return f"{self.name} - {self.designation} ({self.company.name})"

class WorkflowLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='workflow_logs')
    from_state = models.CharField(max_length=50, choices=Employee.WORKFLOW_STATES)
    to_state = models.CharField(max_length=50, choices=Employee.WORKFLOW_STATES)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.employee.name} - {self.from_state} to {self.to_state}"