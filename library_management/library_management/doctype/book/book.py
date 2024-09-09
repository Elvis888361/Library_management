# Copyright (c) 2024, Library and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Book(Document):
	pass
@frappe.whitelist()
def get_qty_from_library(book_description):
    qty_from_library = frappe.db.get_value('Library', {'name': book_description}, 'quantity_available')
    return qty_from_library
@frappe.whitelist()
def update_number_of_books(name):
    # Retrieve book information from the 'Book Items' table
    book_information = frappe.get_all(
        'Book Items',
        filters={'parent': name},
        fields=[
            'book_description',
            'quantity_received',
            ]
    )

    for book_inform in book_information:
        book_name = book_inform.get('book_description')
        quantity_available = book_inform.get('quantity_received')
        library_information = frappe.get_all(
            'Library',
            filters={
                'name':book_name,
            },
            fields=[
                'book_name',
                'quantity_available']
        )
        for library_info in library_information:
            library_name = library_info.get('book_name')
            actual_qty = library_info.get('quantity_available')
            new_actual_qty = int(actual_qty) + int(quantity_available)

            print(new_actual_qty)
            print(library_name)
            frappe.db.set_value(
                'Library',
                {'book_name':library_name},
                'quantity_available',
                new_actual_qty
            )
