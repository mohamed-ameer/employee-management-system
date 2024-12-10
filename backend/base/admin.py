from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Company, Department, Employee, WorkflowLog

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'username')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

class DepartmentInline(admin.TabularInline):
    model = Department
    extra = 0
    show_change_link = True

class EmployeeInline(admin.TabularInline):
    model = Employee
    extra = 0
    show_change_link = True
    readonly_fields = ('days_employed',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'departments_count', 'employees_count')
    search_fields = ('name',)
    inlines = [DepartmentInline]
    readonly_fields = ('departments_count', 'employees_count')

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'manager', 'employees_count')
    list_filter = ('company',)
    search_fields = ('name', 'company__name', 'manager__email')
    inlines = [EmployeeInline]
    readonly_fields = ('employees_count',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company', 'department', 'designation', 'status', 'workflow_state')
    list_filter = ('status', 'workflow_state', 'company', 'department')
    search_fields = ('name', 'email', 'designation')
    readonly_fields = ('days_employed',)
    fieldsets = (
        (None, {
            'fields': ('user', 'name', 'email', 'mobile_number', 'address')
        }),
        ('Employment Details', {
            'fields': ('company', 'department', 'designation', 'status', 'hired_on', 'days_employed')
        }),
        ('Workflow', {
            'fields': ('workflow_state', 'interview_date', 'interview_notes', 'rejection_reason')
        }),
    )

@admin.register(WorkflowLog)
class WorkflowLogAdmin(admin.ModelAdmin):
    list_display = ('employee', 'from_state', 'to_state', 'changed_by', 'changed_at')
    list_filter = ('from_state', 'to_state', 'changed_at')
    search_fields = ('employee__name', 'changed_by__email', 'notes')
    readonly_fields = ('employee', 'from_state', 'to_state', 'changed_by', 'changed_at')

# Register models
admin.site.register(User, CustomUserAdmin)
