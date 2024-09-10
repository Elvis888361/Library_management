# Copyright (c) 2024, Library and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Transaction(Document):
	pass
@frappe.whitelist()
def update_transaction_status(name):
	transaction = frappe.get_doc('Transaction', name)
	frappe.db.set_value(
        'Membership',
        {'name':transaction.member},
        'status',
        transaction.transaction_type
    )

@frappe.whitelist()
def get_item_price(book):
    unit_price = frappe.db.get_value("Item Price", {"item_code": book, "price_list": "Standard Selling"}, "price_list_rate")
    return unit_price

@frappe.whitelist()
def update_outstanding_amount(name,member):

	transaction = frappe.get_doc('Transaction', name)
	membership_outstanding_amount=frappe.get_doc('Membership', member)
	total_outstanding_amount=0
	if(membership_outstanding_amount.outstanding_debt==None):
		debt=0
		total_outstanding_amount=float(debt)+float(transaction.rent_fee)
	else:
		total_outstanding_amount=float(membership_outstanding_amount.outstanding_debt)+float(transaction.rent_fee)
	frappe.db.set_value('Membership',{'name':transaction.member},'outstanding_debt',total_outstanding_amount)
	return "Member Outstanding debt Updated"

@frappe.whitelist()
def check_library(book):
	print(book)
	library=frappe.db.sql(f""" Select quantity_available from `tabLibrary` where book_name='{book}';""", as_dict=1)
	print(library)
	if library:
		return "Success"
	else:
		frappe.throw("The book is not in the library")
		frappe.validated = false