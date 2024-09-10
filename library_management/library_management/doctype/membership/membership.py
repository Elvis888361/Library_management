# Copyright (c) 2024, Library and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Membership(Document):
	pass
@frappe.whitelist()
def create_customer(name):
    try:
        membership = frappe.get_doc('Membership', name)
        existing_customer = frappe.db.exists('Customer', membership.name)
        if existing_customer:
            frappe.throw(f"Customer '{membership.first_name}' already exists.")
        customer = frappe.get_doc({
            'doctype': 'Customer',
            'customer_name': membership.name,
            'custom_membership':membership.name,
            'customer_group': 'Individual', 
            'territory': 'All Territories',
            'customer_type': 'Individual'
        })
        customer.insert()
        frappe.db.commit()
        
        return f"Customer '{membership.first_name}' created successfully."

    except Exception as e:
        frappe.log_error(message=str(e), title="Customer Creation Failed")
        frappe.throw(f"Failed to create customer: {str(e)}")

