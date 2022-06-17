// Copyright (c) 2022, pa and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Payroll Summary"] = {
	"filters": [

		{
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
		},
		{
			fieldname: "department",
			label: __("Department"),
			fieldtype: "Link",
			options: "Department",
		},
		{
			fieldname: "date",
			label: __("Date"),
			fieldtype: "DateRange",
			default: [frappe.datetime.month_start(), frappe.datetime.now_date()],
		},
		
	]
};
