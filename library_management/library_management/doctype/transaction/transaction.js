// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Transaction", {
    refresh(frm) {
        // Fetch books by publisher
        if (frm.doc.publisher) {
            frappe.call({
                method: "library_management.library_management.doctype.transaction.transaction.get_book",
                args: {
                    publisher: frm.doc.publisher
                },
                callback: function(response) {
                    if (response.message) {
                        let book_description_list = response.message;
                        frm.set_query('book', function() {
                            return {
                                filters: [['name', 'in', book_description_list]]
                            };
                        });
                    } else {
                        frappe.msgprint(__('No books found for the selected publisher.'));
                    }
                },
                error: function(err) {
                    console.error(err);
                }
            });
        }

        if (frm.doc.book) {
            frappe.call({
                method: "library_management.library_management.doctype.transaction.transaction.get_publisher",
                args: {
                    book: frm.doc.book
                },
                callback: function(response) {
                    if (response.message) {
                        let publisher_list = response.message;
                        frm.set_query('publisher', function() {
                            return {
                                filters: [['name', 'in', publisher_list]]
                            };
                        });
                    } else {
                        frappe.msgprint(__('No publisher found for the selected book.'));
                    }
                },
                error: function(err) {
                    console.error(err);
                }
            });
        }
    },

    on_submit(frm) {
        frappe.call({
            method: "library_management.library_management.doctype.transaction.transaction.update_transaction_status",
            args: {
                name: frm.doc.name
            }
        });
		frappe.call({
			method: "library_management.library_management.doctype.transaction.transaction.update_library_deduction",
			args: {
				name: frm.doc.name
			}
		});
        
    },
	transaction_type(frm){
		if(frm.doc.transaction_type==="Returned"){
				frappe.call({
					method: "library_management.library_management.doctype.transaction.transaction.update_outstanding_amount",
					args: {
						name: frm.doc.name,
						member: frm.doc.member
					},
					callback: function(r) {
						if (r.message) {
							frm.set_df_property("book", "read_only", 1);
							frm.set_df_property("member", "read_only", 1);
						}
					}
				});
	
				frappe.call({
					method: "library_management.library_management.doctype.transaction.transaction.update_library_addition",
					args: {
						name: frm.doc.name
					}
				});
		}
	},
    before_save(frm) {
        frappe.call({
            method: "library_management.library_management.doctype.transaction.transaction.check_library",
            args: {
                book: frm.doc.book
            },
            callback: function(r) {
                if (r.message !== "Success") {
                    frappe.validated = false;
                    console.log("The book is not in the library");
                }
            }
        });
        frappe.call({
            method: "library_management.library_management.doctype.transaction.transaction.check_outstanding_debt",
            args: {
                member: frm.doc.member
            },
            callback: function(r) {
                console.log(r.message);
            }
        });
    },

    book(frm) {
        frappe.call({
            method: "library_management.library_management.doctype.transaction.transaction.get_item_price",
            args: {
                book: frm.doc.book
            },
            callback: function(r) {
                frm.set_value('rent_fee', r.message);
            }
        });
        if (frm.doc.book) {
            frappe.call({
                method: "library_management.library_management.doctype.transaction.transaction.get_publisher",
                args: {
                    book: frm.doc.book
                },
                callback: function(response) {
                    if (response.message) {
                        let book_description_list = response.message;
                        frm.set_query('publisher', function() {
                            return {
                                filters: [['name', 'in', book_description_list]]
                            };
                        });
                        frm.refresh_field('publisher');
                    } else {
                        frappe.msgprint(__('No books found for the selected publisher.'));
                    }
                },
                error: function(err) {
                    console.error(err);
                }
            });
        }
    },

    publisher(frm) {
        if (frm.doc.publisher) {
            frappe.call({
                method: "library_management.library_management.doctype.transaction.transaction.get_book",
                args: {
                    publisher: frm.doc.publisher
                },
                callback: function(response) {
                    if (response.message) {
                        let book_description_list = response.message;
                        frm.set_query('book', function() {
                            return {
                                filters: [['name', 'in', book_description_list]]
                            };
                        });
                        frm.refresh_field('book');
                    } else {
                        frappe.msgprint(__('No books found for the selected publisher.'));
                    }
                },
                error: function(err) {
                    console.error(err);
                }
            });
        }
    }
});
