// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Book", {
	refresh(frm) {

	},
	on_submit: function(frm) {
		frappe.call({
			method: 'library_management.library_management.doctype.book.book.update_number_of_books',
			args: {
				'name': frm.doc.name
			},
			callback: function(r) {
			}
	});
	}
});
frappe.ui.form.on("Book Items", {
	book_description: function(frm, cdt, cdn) {
		let Item = locals[cdt][cdn];
		let book_description = Item.book_description;
		frappe.call({
			method: 'library_management.library_management.doctype.book.book.get_qty_from_library',
			args: {
				'book_description': book_description
			},
			callback: function(r) {
			  let qty= r.message
			  frappe.model.set_value(cdt, cdn, {
				'quantity_in_library':qty
			});  
			},
		});
	},
	quantity_received: function(frm, cdt, cdn) {
		let Item = locals[cdt][cdn];
		let quantity = parseInt(Item.quantity_received);
		let quantity_in_library = parseInt(Item.quantity_in_library);
		let new_quantity = quantity + quantity_in_library;
		frappe.model.set_value(cdt, cdn, {
			'new_quantity':new_quantity
		});  
		update_qty_received(frm)
	  },
	items_remove: function(frm, cdt, cdn){
		update_qty_received(frm)
	}
  })


  function update_qty_received(frm) {
    let total= 0;
    for (let item of frm.doc.items) {
		total+= parseInt(item.quantity_received)
    }
    frm.set_value({
          'qty_received':total
        })  
}


