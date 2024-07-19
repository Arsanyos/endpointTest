import os
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

import pytz

from django.core.validators import validate_email

from django.utils import timezone
from datetime import datetime, timedelta
    
from django.contrib.auth.models import UserManager as BaseUserManager

from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField


phone_number_validator = RegexValidator(r"A", "Invalid phone number")

class Currency(models.TextChoices):        
    USD = "USD", "United States Dollars"
    ETB = "ETB", "Ethiopian Birr"
    EUR = "EUR", "Euro"
    GBP = "GBP", "United Kingdom Pounds"
    CAD = "CAD", "Canada Dollars"
    
# Create your models here.

# class CustomerContactType(models.IntegerChoices):
#     OWNER = 1, _("Owner")
#     CONTACT_PERSON = 2, _("ContactPerson")

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    `created_at` and `updated_at` fields.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-updated_at"]
        get_latest_by = "-updated_at"

        

def upload_to(instance, filename):
    now = datetime.now()
    base, extension = os.path.splitext(filename.lower())
    milliseconds = now.microsecond // 1000
    # return f"files/{now:%Y%m%d%H%M%S}{milliseconds}{extension}"
    return f"files/{instance.id}{extension}"


# new models


class Label(TimeStampedModel):
    tag = models.CharField(max_length=255)
    description = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        verbose_name = "label"
        verbose_name_plural = "labels"

class Address(models.Model):
    country = CountryField(default='ET')
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=100)



class Organization(TimeStampedModel):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "organization"
        verbose_name_plural = "organizations"


class Business(TimeStampedModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='businesses')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to='customer_profile/', blank=True, null=True )

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "business"
        verbose_name_plural = "businesses"


class UserManager(BaseUserManager):
    pass


class OrgAdmin(TimeStampedModel):
    
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE)
        
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    is_super_admin = models.BooleanField(default=False)
    
    # business allowed to manage (if not super admin)
    allowed_businesses = models.ManyToManyField(Business, related_name="org_admins")
    
    # permissions = models.JSONField(null=True, )
    phone_number = models.CharField(max_length=20)
    
    full_name = models.CharField(max_length=150)
    
    def __str__(self):
        return self.full_name

    
    class Meta:
        verbose_name = "organization admin"
        verbose_name_plural = "organization admins"
        
class Notification(TimeStampedModel):
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING)
    business = models.ForeignKey(Business, on_delete=models.DO_NOTHING)
    
    org_admin = models.ForeignKey(OrgAdmin, on_delete=models.CASCADE)
    
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    
    entity_type = models.CharField(max_length=255, choices=(
        ("invoice", "Invoice"),
        ("payment", "Payment"),
        ("customer", "Customer"),
        ("document", "Document"),
    ))
    entity_id = models.IntegerField()
    
    def __str__(self):
        return self.message
    
    class Meta:
        verbose_name = "notification"
        verbose_name_plural = "notifications"


class BusinessSetting(TimeStampedModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    business = models.OneToOneField(Business, related_name="business_setting", on_delete=models.CASCADE)

    remind_sms_before_days_enabled = models.BooleanField(default=False)
    remind_sms_before_days = models.IntegerField(default=0)
    remind_email_before_days = models.IntegerField(default=0)
    
    remind_sms_after_days_enabled = models.BooleanField(default=False)
    remind_sms_after_days = models.IntegerField(default=0)
    remind_email_after_days = models.IntegerField(default=0)
    
    enable_sms_for_invoice = models.BooleanField(default=False)
        
    def __str__(self):
        return 'Business Setting'
    
    class Meta:
        verbose_name = "business setting"
        verbose_name_plural = "business settings"

class OrgAdminRole(TimeStampedModel):
    class RoleType(models.TextChoices):        
        # activity-logs
        CAN_VIEW_ACTIVITY_LOGS = "activity_logs:view", "Can view activity logs"
        
        # business
        CAN_CREATE_BUSINESS = "business:create", "Can create business"
        CAN_UPDATE_BUSINESS = "business:update", "Can update business"
        CAN_VIEW_BUSINESS = "business:view", "Can view business"
        CAN_DELETE_BUSINESS = "business:delete", "Can delete business"
        
        # product
        CAN_CREATE_PRODUCT = "product:create", "Can create product"
        CAN_UPDATE_PRODUCT = "product:update", "Can update product"
        CAN_VIEW_PRODUCT = "product:view", "Can view product"
        CAN_DELETE_PRODUCT = "product:delete", "Can delete product"
        
        # admins
        CAN_CREATE_ORG_ADMIN = "org_admins:create", "Can create organization admin"
        CAN_UPDATE_ORG_ADMIN = "org_admins:update", "Can update organization admin"
        CAN_VIEW_ORG_ADMIN = "org_admins:view", "Can view organization admin"
        CAN_DELETE_ORG_ADMIN = "org_admins:delete", "Can delete organization admin"
    
        # roles
        CAN_CREATE_ROLE = "roles:create", "Can create role"
        CAN_UPDATE_ROLE = "roles:update", "Can update role"
        CAN_VIEW_ROLE = "roles:view", "Can view role"
        CAN_DELETE_ROLE = "roles:delete", "Can delete role"
        
        
        # customers
        CAN_CREATE_CUSTOMER = "customers:create", "Can create customer"
        CAN_UPDATE_CUSTOMER = "customers:update", "Can update customer"
        CAN_VIEW_CUSTOMER = "customers:view", "Can view customer"
        CAN_DELETE_CUSTOMER = "customers:delete", "Can delete customer"
        
        # customer contacts
        CAN_CREATE_CUSTOMER_CONTACT = "customer_contact:create", "Can create customer contact"
        CAN_UPDATE_CUSTOMER_CONTACT = "customer_contact:update", "Can update customer contact"
        CAN_VIEW_CUSTOMER_CONTACT = "customer_contact:view", "Can view customer contact"
        CAN_DELETE_CUSTOMER_CONTACT = "customer_contact:delete", "Can delete customer contact"
        
        # dashboard
        CAN_VIEW_DASHBOARD = "dashboard:view", "Can view dashboard"
        
        # documents
        CAN_CREATE_DOCUMENT = "documents:create", "Can create document"
        CAN_UPDATE_DOCUMENT = "documents:update", "Can update document"
        CAN_VIEW_DOCUMENT = "documents:view", "Can view document"
        CAN_DELETE_DOCUMENT = "documents:delete", "Can delete document"
        
        # invoices
        CAN_CREATE_INVOICE = "invoices:create", "Can create invoice"
        CAN_UPDATE_INVOICE = "invoices:update", "Can update invoice"
        CAN_VIEW_INVOICE = "invoices:view", "Can view invoice"
        CAN_DELETE_INVOICE = "invoices:delete", "Can delete invoice"
        
        # invoice notes
        CAN_CREATE_INVOICE_NOTE = "invoice_notes:create", "Can create invoice note"
        CAN_UPDATE_INVOICE_NOTE = "invoice_notes:update", "Can update invoice note"
        CAN_VIEW_INVOICE_NOTE = "invoice_notes:view", "Can view invoice note"
        CAN_DELETE_INVOICE_NOTE = "invoice_notes:delete", "Can delete invoice note"
        
        # payments
        CAN_CREATE_PAYMENT = "payments:create", "Can create payment"
        CAN_UPDATE_PAYMENT = "payments:update", "Can update payment"
        CAN_VIEW_PAYMENT = "payments:view", "Can view payment"
        CAN_DELETE_PAYMENT = "payments:delete", "Can delete payment"
        
        # payment methods
        CAN_CREATE_PAYMENT_METHOD = "payment_methods:create", "Can create payment method"
        CAN_UPDATE_PAYMENT_METHOD = "payment_methods:update", "Can update payment method"
        CAN_VIEW_PAYMENT_METHOD = "payment_methods:view", "Can view payment method"
        CAN_DELETE_PAYMENT_METHOD = "payment_methods:delete", "Can delete payment method"
        
        # notifications
        CAN_VIEW_NOTIFICATIONS = "notifications:view", "Can view notifications"
        
        # settings
        CAN_UPDATE_SETTINGS = "business_settings:update", "Can update settings"
        CAN_VIEW_SETTINGS = "business_settings:view", "Can view settings"
            

        
    org_admin = models.ForeignKey(OrgAdmin, on_delete=models.CASCADE, related_name='roles')
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    role = models.CharField(choices=RoleType.choices, max_length=50)

    def __str__(self):
        return self.org_admin.full_name + " - " + self.role
    
    class Meta:
        unique_together = ("org_admin", "business",'role')



class Document(TimeStampedModel):
    DOCUMENT_TYPES = [
        ('business_license', 'Business License'),
        ('coc', 'COC'),
        ('business_agreement', 'Business Agreement'),
        ('commercial_certificate', 'Commercial Certificate'),
        ('tin_certificate', 'TIN Certificate'),
        ('vat_certificate', 'VAT Certificate'),
        ('id_card', 'ID Card'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to=upload_to)
    document_type = models.CharField(
        max_length=50,
        choices=DOCUMENT_TYPES,
    )
    description = models.CharField(max_length=500, null=True, blank=True)
    uploaded_by = models.ForeignKey(OrgAdmin, on_delete=models.DO_NOTHING)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)
    labels = models.ManyToManyField(Label, null=True)
    
    def __str__(self):
        return self.document_type
    
    class Meta:
        verbose_name = "document"
        verbose_name_plural = "documents"

class CustomerContact(TimeStampedModel):

    title = models.CharField(max_length=100)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150, null=True)
    email = models.EmailField(validators=[validate_email])
    contact_phone = models.CharField(max_length=100)
    description = models.CharField(max_length=500, null=True, blank=True)
        
    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Customer(TimeStampedModel):
    CUSTOMER_TYPE = [
        ('INDIVIDUAL', 'INDIVIDUAL'),
        ('COMPANY', 'COMPANY'), 
    ]

    business = models.ForeignKey(Business, on_delete=models.DO_NOTHING)
    company_name = models.CharField(max_length=255)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='customer_profile/', blank=True, null=True )
    phone_number = PhoneNumberField(unique=True, null=True)
    email = models.EmailField( blank=True, null=True)
    note = models.CharField(max_length=255, null=True, blank=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE)
    documents = models.ManyToManyField(Document, blank=True)
    license_issue_date = models.DateTimeField(null=True)    
    license_expiry_date = models.DateTimeField(null=True)    
    operational_date = models.DateTimeField(null=True)    
    
    contact = models.ManyToManyField(CustomerContact, blank=True)
    is_active = models.BooleanField(default=True)
    creator = models.ForeignKey(OrgAdmin, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    
    """
    def __str__(self):
        return self.company_name + " - " + self.business.name 
    """

class ActivityLog(TimeStampedModel):
    org_admin = models.ForeignKey(OrgAdmin, on_delete=models.DO_NOTHING)
    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING, null=True)

    business = models.ForeignKey(Business, on_delete=models.DO_NOTHING, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING, null=True)

    activity_name = models.CharField(max_length=150)
    item_type = models.CharField(max_length=150, null=True)
    item_id = models.IntegerField(null=True)
    old_data = models.JSONField(null=True)
    data = models.JSONField(null=True)

    # unpaid_amount = models.FloatField(default=0)

"""
class InvoiceNote(TimeStampedModel):
    note = models.TextField()    # valid business license
    org_admin = models.ForeignKey(OrgAdmin, on_delete=models.DO_NOTHING)
    invoice = models.ForeignKey(Invoice, on_delete=models.DO_NOTHING)
"""

class PaymentMethod(models.Model):
    ACCOUNT_TYPES = [
        ('individual', 'Individual'),
        ('company', 'Company'),
    ]

    business = models.ForeignKey('Business', on_delete=models.CASCADE, related_name='payment_methods')
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    method = models.CharField(max_length=100, verbose_name=_("Payment Method"))
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)

    def __str__(self):
        return f"{self.method} - {self.account_number}"

class Product(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, verbose_name=_("Business"))
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey('OrgAdmin', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('fully_paid', 'Fully Paid'),
        ('partially_paid', 'Partially Paid'),
        ('pending', 'Pending'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    currency = models.CharField(max_length=5, choices=Currency.choices, default=Currency.ETB)
    due_date = models.DateField(null=True, blank=True)
    note = models.TextField( null=True, blank=True)

    def __str__(self):
        return f"Invoice #{self.id} - {self.customer.company_name}"


class CancelledInvoice(models.Model):
    cancelled_by = models.ForeignKey(OrgAdmin, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, verbose_name=_("Cancellation Date"))
    reason = models.TextField(verbose_name=_("Reason"))
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name='cancellation')

    def __str__(self):
        return f"Cancelled Invoice #{self.invoice.id}"


class Receipt(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='receipts', verbose_name=_("Customer"))
    business = models.ForeignKey(Business, on_delete=models.CASCADE, verbose_name=_("Business"))
    #product = models.ForeignKey(Product, on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, verbose_name=_("Invoice"))
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name=_("Amount"))
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE, null=True, blank=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True, verbose_name=_("Document"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))

    def __str__(self):
        return f"Receipt #{self.id} - {self.customer.company_name}"


