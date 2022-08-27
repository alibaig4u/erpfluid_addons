from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import date, datetime
from frappe.utils import get_url_to_form, get_site_path
import json
from frappe.utils.background_jobs import enqueue
from numpy import size

@frappe.whitelist()
def get_dt(offset=None, limit=None, filters=None):
    filters = json.loads(filters)
    conditions = "tdt.status = 'Pending' and "
    conditions += "tdt.van = '{van}' and ".format(van=getWarehouse())
    
    if filters.get('client') is not None:
        conditions += "tdt.client_title = '{}' and ".format(filters.get('client'))
    if filters.get('client_type') is not None:
        conditions += "tdt.client_type = '{}' and ".format(filters.get('client_type'))
    if filters.get('mop') is not None:
        conditions += "tdt.mode_of_payments = '{}' and ".format(filters.get('mop'))
    
    if filters.get('date') is not None:
        conditions += "tdt.delivery_date between '{}' and '{}' and ".format(filters.get('date')[0], filters.get('date')[1])
    conditions = conditions.strip("and ")
    if conditions != "":
        conditions = "where " + conditions
  
    sql = """select DISTINCT
            tdt.name as ticket_no,
            tdt.client_type,
            tdt.client_title,
            tdt.phone_fax,
            tdt.address,
            tdt.rate_unit,
            tdt.reg_qty,
            tdt.mode_of_payments,
            tdt.delivery_date,
            tdt.account_no,
            (select Distinct total_bottles from `tabAgreement Form` taf where taf.name=tdt.account_no) as reg_qty,
            (select Distinct new_customer from `tabAgreement Form` taf where taf.name=tdt.account_no) as new_customer
        from
            `tabDelivery Ticket` tdt
            
            {conditions}
            """.format(conditions=conditions)
    dt_list = frappe.db.sql(sql, as_dict=True)


    return dt_list


@frappe.whitelist()
def getWarehouse():
    warehouse =  frappe.get_list("Warehouse", fields="name")[0].name if len(frappe.get_list("Warehouse", fields="name")) > 0 else ""
    return warehouse



@frappe.whitelist()
def create_dispatch(data=None):
    
    data = json.loads(data)
    dispatch_doc = frappe.new_doc("Dispatch")
    dispatch_doc.date = data.get('delivery_date')
    delivery_day = datetime.strptime(data.get('delivery_date'), '%Y-%m-%d'). strftime("%A")
    dispatch_doc.day = delivery_day
    dispatch_doc.ticket_no = data.get('ticket_no')
    dispatch_doc.customer = data.get('client_title')
    dispatch_doc.address = data.get('address')
    dispatch_doc.quantity = data.get('qty')
    dispatch_doc.empty_bottles = data.get('empty_bottles')
    dispatch_doc.accessories_sales = data.get('accessories_sales')
    dispatch_doc.received_payment = data.get('received_payment')
    dispatch_doc.fixed_deposit = data.get('fixed_deposit')
    dispatch_doc.reason = data.get('reason')
    dispatch_doc.insert(ignore_permissions=True)
    frappe.db.set_value("Delivery Ticket", data.get('ticket_no'), 'status', 'Dispatched')
    frappe.db.set_value("Agreement Form", data.get('account_no'), 'new_customer', 'No')
    frappe.db.commit()
    return dispatch_doc.name