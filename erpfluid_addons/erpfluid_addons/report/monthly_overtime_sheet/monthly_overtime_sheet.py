# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cstr, cint, getdate
from frappe import msgprint, _
from calendar import monthrange

from frappe.utils.data import flt
import random


def execute(filters=None):
	if not filters: filters = {}

	conditions, filters = get_conditions(filters)
	columns = get_columns(filters)
	att_map = get_attendance_list(conditions, filters)
	emp_map = get_employee_details(filters)

	holiday_list = [emp_map[d]["holiday_list"] for d in emp_map if emp_map[d]["holiday_list"]]
	default_holiday_list = frappe.get_cached_value('Company',  filters.get("company"),  "default_holiday_list")
	holiday_list.append(default_holiday_list)
	holiday_list = list(set(holiday_list))
	holiday_map = get_holiday(holiday_list, filters["month"])

	data = []
	leave_types = frappe.db.sql("""select name from `tabLeave Type`""", as_list=True)
	leave_list = [d[0] for d in leave_types]
	# columns.extend(leave_list)
	# columns.extend([_("Total Late Entries") + ":Float:120", _("Total Early Exits") + ":Float:120"])

	for emp in sorted(att_map):
		employee_salary_list = frappe.get_all("Salary Structure Assignment", filters={"employee":emp, "docstatus":1}, order_by="modified desc", limit=1, fields="base")
		employee_salary = 0
		per_day_salary = 0
		if len(employee_salary_list) > 0:
			employee_salary = employee_salary_list[0].base
			per_day_salary = flt(employee_salary/filters["total_days_in_month"],2)
		emp_det = emp_map.get(emp)
		if not emp_det:
			continue

		gazzete_rate = round(random.uniform(100,250), 2)
		non_gazzete_rate = round(random.uniform(100,250), 2)

		row = [emp, emp_det.employee_name, emp_det.branch, emp_det.department, emp_det.designation,
			emp_det.company, 'Gazette']


		
		g_total_hours = 0.0
		total_hours = 0.0
		total_p = 0.0
		g_total_p = 0.0
		gazzete_amount = 0.0
		non_gazzete_amount = 0.0
		for day in range(filters["total_days_in_month"]):
			# ot = random.randint(0, 1)
			ot = 0
			emp_att = frappe.db.sql("""select DISTINCT 
					tea.employee,
					teat.date,
					teat.approved_ot1,
					teat.holiday
				from 
				`tabEmployee Attendance` tea
				left join
				`tabEmployee Attendance Table` teat
				on teat.parent = tea.name
				where 
				day(teat.date) = '{day}' and month(teat.date) = '{month}' and year(teat.date) = '{year}' and tea.employee='{employee}' """.format(day=day,month=filters.get('month'), year=filters.get('year'), employee=emp), as_dict=1)
			if len(emp_att) > 0:
				if emp_att[0].holiday == 1:
					ot = emp_att[0].approved_ot1
	# 		status = att_map.get(emp).get(day + 1, "None")
	# 		status_map = {"Present": "P", "Absent": "A", "Half Day": "HD", "On Leave": "L", "None": "", "Holiday":"<b>H</b>"}
	# 		if status == "None" and holiday_map:
	# 			emp_holiday_list = emp_det.holiday_list if emp_det.holiday_list else default_holiday_list
	# 			if emp_holiday_list in holiday_map and (day+1) in holiday_map[emp_holiday_list]:
	# 				status = "Holiday"
			
			total_hours += ot
			g_total_hours += ot
			if ot > 0:
				total_p += 1
				g_total_p += 1
			row.append(ot)


		gazzete_amount = total_hours *  gazzete_rate
		row += [total_hours,total_p,emp_det.employment_type,gazzete_rate,employee_salary,per_day_salary,gazzete_amount]
		data.append(row)
		
		
		row = [emp, emp_det.employment_type, emp_det.branch, emp_det.department, emp_det.designation,
			emp_det.company, 'Non-Gazette']

		total_hours = 0.0
		total_p = 0.0
		for day in range(filters["total_days_in_month"]):

			# ot = random.randint(0, 1)
			ot = 0
			emp_att = frappe.db.sql("""select DISTINCT 
					tea.employee,
					teat.date,
					teat.approved_ot1,
					teat.holiday
				from 
				`tabEmployee Attendance` tea
				left join
				`tabEmployee Attendance Table` teat
				on teat.parent = tea.name
				where 
				day(teat.date) = '{day}' and month(teat.date) = '{month}' and year(teat.date) = '{year}' and tea.employee='{employee}' """.format(day=day,month=filters.get('month'), year=filters.get('year'), employee=emp), as_dict=1)
			if len(emp_att) > 0:
				if emp_att[0].holiday == 0:
					ot = emp_att[0].approved_ot1
			total_hours += ot
			g_total_hours += ot
			if ot > 0:
				total_p += 1
				g_total_p += 1
			row.append(ot)


		non_gazzete_amount = total_hours *  non_gazzete_rate
		row += [total_hours,total_p,emp_det.employment_type,non_gazzete_rate,employee_salary,per_day_salary,non_gazzete_amount]


		data.append(row)
		row = ["", "", "", "", "","", ""]
		for day in range(filters["total_days_in_month"]):
			row.append("")

		g_gazette_amount = non_gazzete_amount + gazzete_amount 
		row+= [g_total_hours,g_total_p,emp_det.employment_type,0,employee_salary,per_day_salary,g_gazette_amount]
		data.append(row)
	return columns, data

def get_columns(filters):
	columns = [
		_("Employee") + ":Link/Employee:120", _("Employee Name") + "::140", _("Branch")+ ":Link/Branch:120",
		_("Department") + ":Link/Department:120", _("Designation") + ":Link/Designation:120",
		 _("Company") + ":Link/Company:120",  _("Nature") + ":Data:120"
	]

	for day in range(filters["total_days_in_month"]):
		columns.append(cstr(day+1) +"::20")

	columns += [
		_("Total Hours") + ":Float:120",
		_("Present Day") + ":Int:120", 
		_("Regular/Probation") + ":Data:120", 
		_("Per Day Rate") + ":Float:120",  
		_("Basic Pay") + ":Float:120",  
		_("Per Day") + ":Float:120",  
		_("Net Amount") + ":Float:120"
	]
	return columns

def get_attendance_list(conditions, filters):
	attendance_list = frappe.db.sql("""select employee, day(attendance_date) as day_of_month,
		status from tabAttendance where docstatus = 1 %s order by employee, attendance_date""" %
		conditions, filters, as_dict=1)

	att_map = {}
	for d in attendance_list:
		att_map.setdefault(d.employee, frappe._dict()).setdefault(d.day_of_month, "")
		att_map[d.employee][d.day_of_month] = d.status

	return att_map

def get_conditions(filters):
	if not (filters.get("month") and filters.get("year")):
		msgprint(_("Please select month and year"), raise_exception=1)

	filters["month"] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
		"Dec"].index(filters.month) + 1

	filters["total_days_in_month"] = monthrange(cint(filters.year), filters.month)[1]

	conditions = " and month(attendance_date) = %(month)s and year(attendance_date) = %(year)s"

	if filters.get("company"): conditions += " and company = %(company)s"
	if filters.get("employee"): conditions += " and employee = %(employee)s"

	return conditions, filters

def get_employee_details(filters):
	emp_map = frappe._dict()
	for d in frappe.db.sql("""select name, employee_name, designation, department, branch, company,
		holiday_list, employment_type from tabEmployee where company = "%s" """ % (filters.get("company")), as_dict=1):
		emp_map.setdefault(d.name, d)

	return emp_map

def get_holiday(holiday_list, month):
	holiday_map = frappe._dict()
	for d in holiday_list:
		if d:
			holiday_map.setdefault(d, frappe.db.sql_list('''select day(holiday_date) from `tabHoliday`
				where parent=%s and month(holiday_date)=%s''', (d, month)))

	return holiday_map

@frappe.whitelist()
def get_attendance_years():
	year_list = frappe.db.sql_list("""select distinct YEAR(attendance_date) from tabAttendance ORDER BY YEAR(attendance_date) DESC""")
	if not year_list:
		year_list = [getdate().year]

	return "\n".join(str(year) for year in year_list)
