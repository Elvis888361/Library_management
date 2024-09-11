// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Transaction", {
	refresh(frm) {

	},
	after_save(frm){
		frappe.call({
			method: 'library_management.library_management.doctype.transaction.transaction.update_transaction_status',
			args: {
				'name': frm.doc.name
			},
			callback: function(r) {
			}
		})
		frappe.call({
			method: 'library_management.library_management.doctype.transaction.transaction.update_outstanding_amount',
			args: {
				'name': frm.doc.name,
				'member':frm.doc.member
			},
			callback: function(r) {
				if(r.message){
					frm.set_df_property("book","read_only",1)
					frm.set_df_property("member","read_only",1)
				}
			}
		})

	},
	before_save(frm){
		frappe.call({
			method: 'library_management.library_management.doctype.transaction.transaction.check_library',
			args: {
				'book': frm.doc.book
			},
			callback: function(r) {
				console.log(r.message)
				if(r.message != 'Success'){
					console.log("The book is not in the library");
					frappe.validated = false;
				}
			}
		})
	},
	book(frm){
	    frappe.call({
            method: "library_management.library_management.doctype.transaction.transaction.get_item_price",
            args: {
                "book": frm.doc.book
            },
            callback: function (r) {
                frm.set_value('rent_fee', r.message);
            },
        });
	},
	rent_fee(frm){
		frappe.call({
			method: 'library_management.library_management.doctype.transaction.transaction.update_outstanding_amount',
			args: {
				'name': frm.doc.name,
				'member':frm.doc.member
			},
			callback: function(r) {
				if(r.message){
					
				}
			}
		})
	}
});
