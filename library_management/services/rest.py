import frappe

@frappe.whitelist()
def send_email(name):
    the_doc=frappe.get_doc('Payment Entry', name)
    mem_the_doc=frappe.get_doc('Membership', the_doc.custom_membership)
    frappe.sendmail(
        recipients = mem_the_doc.email,
        cc = '',
        subject = "Payment entry processed",
        content = f"The payment entry {name} has been processed your amount paid is {the_doc.paid_amount}",
        reference_doctype = '',
        reference_name = '',
        now = True
    )

@frappe.whitelist()
def update_outstanding_debt(party):
    total_pay = frappe.db.sql(f""" Select SUM(paid_amount) as amount from `tabPayment Entry` where party='{party}';""", as_dict=1)[0]
    print(total_pay.amount)
    membership_outstanding_amount=frappe.get_doc('Membership', party)
    total_outstanding_amount=0
    if(membership_outstanding_amount.outstanding_debt==None):
        debt=0
        total_outstanding_amount=float(total_pay.amount)-float(debt)
    else:
        total_outstanding_amount=float(total_pay.amount)-float(membership_outstanding_amount.outstanding_debt)
    frappe.db.set_value('Membership',{'name':party},'outstanding_debt',total_outstanding_amount)