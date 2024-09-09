// Copyright (c) 2024, Library and contributors
// For license information, please see license.txt

frappe.ui.form.on("Library", {
	refresh: function(frm) {
	  frm.set_query("book_name", function() {
		return {
		  "filters": {
		  "item_group": "Book",
		  }
		};
		});
	},
  
	book_name: function(frm){
	  let qty = '0'
	  frm.set_value("quantity_available", qty)
	}
  });
