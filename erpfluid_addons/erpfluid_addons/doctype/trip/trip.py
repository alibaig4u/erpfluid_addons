# -*- coding: utf-8 -*-
# Copyright (c) 2019, Frappe Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import datetime
from frappe.utils import cint, cstr, date_diff, add_months,flt,add_days ,formatdate,today, getdate, get_link_to_form, \
	comma_or, get_fullname
class Trip(Document):
	def on_trash(self):
		frappe.db.sql(''' DELETE from `tabLocation History` where trip_name=%s''',(self.name))
		frappe.db.commit()

@frappe.whitelist()
def update_user_data(form,lat,long):
	timestamp= datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	doc = frappe.new_doc('Location History')
	doc.trip_name=form
	doc.user_name = frappe.session.user
	doc.lat = lat
	doc.long=long
	doc.datetime=timestamp
	doc.date=today()
	doc.insert(ignore_permissions=True)
	frappe.db.commit()
	return frappe.get_all("Location History",filters={'user_name':frappe.session.user,'trip_name':form},fields=['*'],order_by='creation ASC')

@frappe.whitelist()
def get_user_data(form):
	return frappe.get_all("Location History",filters={'trip_name':form},fields=['*'],order_by='creation ASC')

@frappe.whitelist()
def log_error(messageOrEvent, source, lineno,error,file):
    frappe.log_error(file+","+messageOrEvent+", "+source+", "+str(lineno)+", "+error, 'Front End')