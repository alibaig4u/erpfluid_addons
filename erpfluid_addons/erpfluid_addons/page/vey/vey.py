from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import date, datetime
from frappe.utils import get_url_to_form, get_site_path
import json
from frappe.utils.background_jobs import enqueue
from numpy import size

@frappe.whitelist()
def get_dp(offset=None, limit=None, filters=None):
    filters = json.loads(filters)
    conditions = ""
    conditions = "tdt.customer = '{customer}' and ".format(customer=getCustomer())
    # conditions = "tdt.status = 'Pending' and "
    # if filters.get('client') is not None:
    #     conditions += "tdt.client_title = '{}' and ".format(filters.get('client'))
    # if filters.get('client_type') is not None:
    #     conditions += "tdt.client_type = '{}' and ".format(filters.get('client_type'))
    # if filters.get('mop') is not None:
    #     conditions += "tdt.mode_of_payments = '{}' and ".format(filters.get('mop'))
    
    # if filters.get('date') is not None:
    #     conditions += "tdt.delivery_date between '{}' and '{}' and ".format(filters.get('date')[0], filters.get('date')[1])
    conditions = conditions.strip("and ")
    if conditions != "":
        conditions = "where " + conditions
  
    sql = """select DISTINCT
            tdt.date,
            tdt.day,
            tdt.ticket_no,
            tdt.customer,
            tdt.quantity,
            tdt.empty_bottles,
            tdt.received_payment,
            tdt.remarks
        from
            `tabDispatch` tdt
            
            {conditions}
            """.format(conditions=conditions)
    dp_list = frappe.db.sql(sql, as_dict=True)


    return dp_list


@frappe.whitelist()
def get_logs(offset=None, limit=None, filters=None):
    filters = json.loads(filters)
    conditions = ""
    conditions = "tcpl.customer = '{customer}' and ".format(customer=getCustomer())
    # conditions = "tdt.status = 'Pending' and "
    # if filters.get('client') is not None:
    #     conditions += "tdt.client_title = '{}' and ".format(filters.get('client'))
    # if filters.get('client_type') is not None:
    #     conditions += "tdt.client_type = '{}' and ".format(filters.get('client_type'))
    # if filters.get('mop') is not None:
    #     conditions += "tdt.mode_of_payments = '{}' and ".format(filters.get('mop'))
    
    # if filters.get('date') is not None:
    #     conditions += "tdt.delivery_date between '{}' and '{}' and ".format(filters.get('date')[0], filters.get('date')[1])
    conditions = conditions.strip("and ")
    if conditions != "":
        conditions = "where " + conditions
  
    sql = """select DISTINCT
            tcpl.name,
            tcpl.date,
            tcpl.customer,
            tcpl.status,
            tcpl.comment,
            tcpl.resolved_date
        from
            `tabComplaints` tcpl
            
            {conditions}
            """.format(conditions=conditions)
    log_list = frappe.db.sql(sql, as_dict=True)


    return log_list



@frappe.whitelist()
def getCustomer():
    customer =  frappe.get_list("Customer", fields="name")[0].name if len(frappe.get_list("Customer", fields="name")) > 0 else ""
    return customer





@frappe.whitelist()
def get_tiles_value():
    tiles_data = frappe.db.sql("""select
            taf.name as agreement_id,
            taf.customer,
            taf.client_title,
            taf.cell,
            taf.delivery_schedule,
            taf.date,
            taf.unit_rate,
            taf.total_bottles,
            IFNULL((
                select COALESCE(sum(tsi.paid_amount),0) as total_outstanding_amount  
                from `tabPayment Entry` tsi 
                where tsi.docstatus != 2
                and tsi.party="{customer}"
                group by tsi.party
            ),0) as outstanding_amount,
            IFNULL((
                select COALESCE(sum(psi.grand_total),0) as total_paid  
                from `tabSales Invoice` psi 
                where psi.docstatus != 2
                and psi.customer="{customer}"
                group by psi.customer
            ),0) as paid_amount,
            IFNULL((
                select COALESCE(count(*),0) as dn_count
                from `tabDispatch` tdn 
                where tdn.docstatus != 2
                and tdn.customer="{customer}"
                group by tdn.customer
            ),0) as total_deliveries

        from `tabAgreement Form` taf
        where taf.customer = "{customer}"
        group by taf.customer
    """.format(customer=getCustomer()), as_dict=True)
    return tiles_data


@frappe.whitelist()
def create_complaint(data=None):
    
    data = json.loads(data)
    complaints_doc = frappe.new_doc("Complaints")
    complaints_doc.date = data.get('date')
    complaints_doc.customer = data.get('customer')
    complaints_doc.comment = data.get('comments')
    complaints_doc.status = 'Pending'
    complaints_doc.insert(ignore_permissions=True)
    return complaints_doc.name


