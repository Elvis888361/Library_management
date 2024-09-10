import frappe

# def send_email():
# 	doc = frappe.get_doc("Email Sending Tool", docname)

#     for row in doc.salary_slips:
#         receiver = frappe.db.get_value("Employee", row.employee, "prefered_email")
#         payroll_settings = frappe.get_single("Payroll Settings")
#         message = "Please see attachment"
#         password = None
#         if payroll_settings.encrypt_salary_slips_in_emails:
#             password = generate_password_for_pdf(payroll_settings.password_policy, row.employee)
#             message += """<br>Note: Your salary slip is password protected,
#                 the password to unlock the PDF is of the format {0}. """.format(payroll_settings.password_policy)

#         if receiver:
#             email_args = {
#                 "recipients": [receiver],
#                 "message": _(message),
#                 "subject": 'Salary Slip',
#                 "attachments": [frappe.attach_print("Salary Slip", row.salary_slip, file_name=row.salary_slip, password=password)],
#                 "reference_doctype": "Salary Slip",
#                 "reference_name": row.salary_slip
#             }
#             if not frappe.flags.in_test:
#                 frappe.enqueue(method=frappe.sendmail, queue='short', timeout=10000, is_async=True, **email_args)
#                 return "Emails have been sent with flags."
#             else:
#                 frappe.sendmail(**email_args)
#                 return "Emails have been sent."
#         else:
#             frappe.msgprint(_("{0}: Employee ema"))

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