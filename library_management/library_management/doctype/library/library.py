# Copyright (c) 2024, Library and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Library(Document):
	pass

@frappe.whitelist()
def get_book():
    items_not_in_library = frappe.db.sql(""" Select name from `tabItem` where name not in (Select book_name from `tabLibrary`);""", as_dict=1)
    return items_not_in_library
