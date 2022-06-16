# Copyright (c) 2022, pa and contributors
# For license information, please see license.txt

from functools import total_ordering
import frappe
from frappe import _
from frappe.utils import data, flt

def execute(filters=None):
	columns = get_columns(filters)
	data = get_data(filters)
	return columns, data

def get_columns(filters):
	columns = [

		{
			"label": _("Company"),
			"fieldname": "company",
			"fieldtype": "Data",
			"width": 140,
		},
		{
			"label": _("Deparment"),
			"fieldname": "department",
			"fieldtype": "Data",
			"width": 140,
		},
		{
			"label": _("Gross Pay"),
			"fieldname": "gross_pay",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Total Earning"),
			"fieldname": "total_earning",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Total deduction"),
			"fieldname": "total_deduction",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Total deduction"),
			"fieldname": "total_deduction",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Net Pay"),
			"fieldname": "net_pay",
			"fieldtype": "Currency",
			"width": 140,
		},
		
	]

	return columns

def get_conditions(filters):
	conditions = ""

	if filters.get("company"):
		conditions += " AND parent.company=%s" % frappe.db.escape(filters.get("company"))

	# if filters.get("department"):
	# 	conditions += "AND parent.department=%s" % frappe.db.escape(filters.get("department"))

	# if filters.get("from_date"):
	# 	conditions += " where parent.posting_date>='%s'" % filters.get("from_date")

	# if filters.get("to_date"):
	# 	conditions += " AND parent.posting_date<='%s'" % filters.get("to_date")
	return conditions

def get_data(filters):
	conditions = get_conditions(filters)
	data =[]
	sql = frappe.db.sql(
			"""
		SELECT 
				company,
				department,
				sum(gross_pay) as gross_pay,
				0 as total_earning,
				sum(total_deduction) as total_deduction,
				sum(net_pay) as net_pay
		FROM  
		  		`tabSalary Slip` tss
		group by 
		   		tss.company , tss.department 
				""",as_dict=True
		)

	cur_company = ""
	gross_pay = 0
	total_earning = 0
	total_deduction = 0
	net_pay = 0
	g_gross_pay = 0
	g_total_earning = 0
	g_total_deduction = 0
	g_net_pay = 0
	for l in sql:
		if cur_company == "":
			data.append({
				'company':l.company,
				'department':l.deparment,
				'gross_pay':l.gross_pay,
				'total_earning':l.total_earning,
				'total_deduction':l.total_deduction,
				'net_pay':l.net_pay
			})
			cur_company=l.company
			gross_pay += l.gross_pay
			total_earning += l.total_earning
			total_deduction += l.total_deduction
			net_pay += l.net_pay
			g_gross_pay += l.gross_pay
			g_total_earning += l.total_earning
			g_total_deduction += l.total_deduction
			g_net_pay += l.net_pay

		elif cur_company != l.company:
			data.append({
				'company':"<b>TOTAL</b>",
				'gross_pay': gross_pay,
				'total_earning': total_earning,
				'total_deduction': total_deduction,
				'net_pay': net_pay
			})
			gross_pay = 0
			total_earning = 0
			total_deduction = 0
			net_pay = 0

			
			data.append({
					'company':l.company,
					'department':l.deparment,
					'total_earning': l.total_earning,
					'gross_pay':l.gross_pay,
					'total_deduction':l.total_deduction,
					'net_pay':l.net_pay
			})
			cur_company=l.company
			gross_pay += l.gross_pay
			total_earning += l.total_earning
			total_deduction += l.total_deduction
			net_pay += l.net_pay
			g_gross_pay += l.gross_pay
			g_total_earning += l.total_earning
			g_total_deduction += l.total_deduction
			g_net_pay += l.net_pay
		else:
			data.append({
					'company':l.company,
					'department':l.deparment,
					'total_earning': l.total_earning,
					'gross_pay':l.gross_pay,
					'total_deduction':l.total_deduction,
					'net_pay':l.net_pay
			})
			gross_pay += l.gross_pay
			total_earning += l.total_earning
			total_deduction += l.total_deduction
			net_pay += l.net_pay
			g_gross_pay += l.gross_pay
			g_total_earning += l.total_earning
			g_total_deduction += l.total_deduction
			g_net_pay += l.net_pay

	data.append({
				'company':"<b>TOTAL</b>",
				'gross_pay': gross_pay,
				'total_earning': total_earning,
				'total_deduction': total_deduction,
				'net_pay': net_pay
			})
	data.append({
				'company':"<b>GRAND TOTAL</b>",
				'gross_pay': g_gross_pay,
				'total_earning': g_total_earning,
				'total_deduction': g_total_deduction,
				'net_pay': g_net_pay
			})
	return data


