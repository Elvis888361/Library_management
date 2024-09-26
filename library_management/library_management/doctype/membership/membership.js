// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Membership", {
	refresh(frm) {
		if(!frm.is_new()){


	frm.add_custom_button(__('Make Payment for Subscription'), function(){
			frappe.set_route('form', "Payment Entry")
		});
		frm.page.set_indicator(frm.doc.status, 'blue')
	}
	},
	after_save(frm){
		frappe.call({
			method: 'library_management.library_management.doctype.membership.membership.create_customer',
			args: {
				'name': frm.doc.name
			},
			callback: function(r) {
				frappe.msgprint(r.message)
			}
	});
	},
	date_of_birth(frm) {
        const today = new Date();
        const birth = new Date(frm.doc.date_of_birth);
        
        if (isNaN(birth)) {
            frappe.msgprint(__('Invalid date of birth'));
            return;
        }

        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        frm.set_value("age", age); 
        frm.refresh_field("age");
    },
	before_save(frm){
		const full_name = frm.doc.last_name ? frm.doc.first_name + " " + frm.doc.last_name : frm.doc.first_name;
		frm.set_value("full_name", full_name);
	}

});
