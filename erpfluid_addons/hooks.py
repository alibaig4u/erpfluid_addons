# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "erpfluid_addons"
app_title = "Erpfluid Addons"
app_publisher = "Mohammad Ali"
app_description = "ERP Fluid Customizations"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "swe.mirza.ali@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = [
	"/assets/erpfluid_addons/css/bootstrap-table.min.css"
	]
app_include_js = [
	"/assets/erpfluid_addons/js/bootstrap-table.min.js",
]
# include js, css files in header of web template
# web_include_css = "/assets/fm_addons/css/fm_addons.css"
# web_include_js = "/assets/fm_addons/js/fm_addons.js"

# include js in page
page_js = {"dispatch" : "public/js/echarts.min.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "erpfluid_addons.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "erpfluid_addons.install.before_install"
# after_install = "erpfluid_addons.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "erpfluid_addons.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"erpfluid_addons.tasks.all"
# 	],
# 	"daily": [
# 		"erpfluid_addons.tasks.daily"
# 	],
# 	"hourly": [
# 		"erpfluid_addons.tasks.hourly"
# 	],
# 	"weekly": [
# 		"erpfluid_addons.tasks.weekly"
# 	]
# 	"monthly": [
# 		"erpfluid_addons.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "erpfluid_addons.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "erpfluid_addons.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "erpfluid_addons.task.get_dashboard_data"
# }

