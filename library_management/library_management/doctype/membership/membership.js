// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Membership", {
	refresh(frm) {
	frm.add_custom_button(__('Make Payment for Subscription'), function(){
			frappe.set_route('form', "Payment Entry")
		});
		frm.page.set_indicator(frm.doc.status, 'blue')
	},
	validate(frm){
		frappe.call({
			method: 'library_management.library_management.doctype.membership.membership.create_customer',
			args: {
				'name': frm.doc.name
			},
			callback: function(r) {
				frappe.msgprint(r.message)
			}
	});
	}
});
