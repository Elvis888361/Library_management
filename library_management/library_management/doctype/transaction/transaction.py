# Copyright (c) 2024, Library and contributors
# For license information, please see license.txt

from pickle import FALSE
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
def check_outstanding_debt(member):
    membership = frappe.get_doc('Membership', member)
    transaction=frappe.get_doc('Transaction', {"member":member})
    Total_amount=float(membership.outstanding_debt)+float(transaction.rent_fee)
    if Total_amount< 500:
        frappe.throw("The member has an outstanding debt of more than ksh. 500")
    return "The member has an outstanding debt of less than ksh. 500"

@frappe.whitelist()
def check_library(book):
	print(book)
	library=frappe.db.sql(f""" Select quantity_available from `tabLibrary` where book_name='{book}';""", as_dict=1)
	print(library)
	if library:
		return "Success"
	else:
		frappe.throw("The book is not in the library")
		frappe.validated = FALSE

@frappe.whitelist()
def update_library_addition(name):
	transaction = frappe.get_doc('Transaction', name)
	library = frappe.get_doc('Library', {"book_name":transaction.book})
	library.quantity_available = int(library.quantity_available) + 1
	library.save()
	return "Library Addition Updated"

@frappe.whitelist()
def update_library_deduction(name):
	transaction = frappe.get_doc('Transaction', name)
	library = frappe.get_doc('Library', {"book_name":transaction.book})
	library.quantity_available = int(library.quantity_available) - 1
	library.save()
	return "Library Deduction Updated"

@frappe.whitelist()
def get_book(publisher):
    book_names = frappe.get_all("Book", filters={'publisher': publisher}, fields=['name'])
    library_list = []
    for book in book_names:
        descriptions = frappe.get_all("Book Items", filters={'parent': book.name}, fields=['book_description'])
        for description in descriptions:
            library_doc = frappe.get_all("Library", filters={'name': description['book_description']}, fields=['book_name'])
            library_list.append(library_doc)
    print(library_list)
    if library_list and library_list[0]:
        return library_list[0][0].book_name
    else:
        frappe.throw("No books found for the given publisher.")

@frappe.whitelist()
def get_publisher(book):
    parent_names = frappe.get_all("Library", filters={'book_name': book}, fields=['name'])
    print(parent_names)
    publisher_list = []
    for publisher in parent_names:
        publisher_name = frappe.get_all("Book Items", filters={'book_description': publisher.name}, fields=['parent'])
        for pub in publisher_name:
            publish_doc = frappe.get_all("Book", filters={'name': pub['parent']}, fields=['publisher'])
            publisher_list.append(publish_doc)
    print(publisher_list[0][0].publisher)
    return publisher_list[0][0].publisher