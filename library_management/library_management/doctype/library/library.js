// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Library", {
    refresh: function(frm) {
        frm.set_query("book_name", function() {
            return {
                filters: {
                    "item_group": "Book"
                }
            };
        });
        frappe.call({
            method: "library_management.library_management.doctype.library.library.get_book",
            callback: function(response) {
                if (response.message) {
                    let items_not_in_library = response.message.map(item => item.name);
                    frm.set_query("book_name", function() {
                        return {
                            filters: [['name', 'in', items_not_in_library]]
                        };
                    });
                } else {
                    frappe.msgprint(__('All Items are in the Library'));
                }
            },
            error: function(err) {
                frappe.msgprint(__('An error occurred while fetching books.'));
                console.error(err);
            }
        });
    },
    book_name: function(frm) {
        frm.set_value("quantity_available", '0');
    },
    onload: function(frm) {
        frappe.call({
            method: "library_management.library_management.doctype.library.library.get_book",
            callback: function(response) {
                if (response.message) {
                    let items_not_in_library = response.message.map(item => item.name);
                    frm.set_query("book_name", function() {
                        return {
                            filters: [['name', 'in', items_not_in_library]]
                        };
                    });
                } else {
                    frappe.msgprint(__('All Items are in the Library'));
                }
            },
            error: function(err) {
                frappe.msgprint(__('An error occurred while fetching books.'));
                console.error(err);
            }
        });
    }
});
