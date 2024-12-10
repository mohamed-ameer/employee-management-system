from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Company, Department, Employee

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['departments_count', 'employees_count']

class DepartmentSerializer(serializers.ModelSerializer):
    employees_count = serializers.IntegerField(read_only=True)
    company_details = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ['employees_count']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Include nested data
        representation['company_data'] = CompanySerializer(instance.company, context={'request': self.context.get('request')}).data
        return representation

    def validate(self, data):
        # This validation will run on both create and update
        request = self.context.get('request')
        if request and request.method == 'POST':
            company = data.get('company')
            name = data.get('name')
            if Department.objects.filter(company=company, name=name).exists():
                raise serializers.ValidationError({
                    'name': 'Department with this name already exists in the company.'
                })
        return data

class EmployeeSerializer(serializers.ModelSerializer):
    days_employed = serializers.IntegerField(read_only=True)
    # Nested serializers for read operations
    company_details = CompanySerializer(source='company', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Include nested data
        representation['company_data'] = CompanySerializer(instance.company, context={'request': self.context.get('request')}).data
        representation['department_data'] = DepartmentSerializer(instance.department, context={'request': self.context.get('request')}).data
        return representation

    def validate(self, data):
        # Validate department belongs to company
        if 'department' in data and 'company' in data:
            if data['department'].company != data['company']:
                raise serializers.ValidationError({
                    'department': 'Selected department does not belong to the selected company.'
                })

        # Validate email format
        if 'email' in data:
            email = data['email']
            if Employee.objects.exclude(pk=self.instance.pk if self.instance else None).filter(email=email).exists():
                raise serializers.ValidationError({
                    'email': 'Employee with this email already exists.'
                })

        # Validate mobile number format
        if 'mobile_number' in data:
            mobile_number = data['mobile_number']
            if not mobile_number.startswith('+'):
                raise serializers.ValidationError({
                    'mobile_number': 'Mobile number must start with "+" followed by country code.'
                })

        # Validate hired_on date based on status
        if data.get('status') == 'active' and not data.get('hired_on'):
            raise serializers.ValidationError({
                'hired_on': 'Hired date is required for active employees.'
            })

        return data
