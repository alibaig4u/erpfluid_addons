frappe.pages['vey'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'VEY',
		single_column: true
	});

	page.main.html(frappe.render_template("vey", { 'doc': {} }));
	

	frappe.dp_list.make(wrapper, wrapper.page);
	frappe.dp_list.so = ""
}


frappe.dp_list = {

	make: function (wrapper, page) {
		setTimeout(() => {
			frappe.dp_list.renderHeadingTiles()
			$('#complain').on('click', () => { 
				frappe.dp_list.make_complaint()
				
			})
			// frappe.dp_list.renderFilters(wrapper, page);
			// frappe.dp_list.date_control.set_value([frappe.datetime.month_start(), frappe.datetime.now_date()]);
			
		}, 100);

		var me = frappe.dp_list;
		me.page = page;


		frappe.dp_list.table = $('#datatable');
		frappe.dp_list.logtable = $('#log_datatable');
		
		setTimeout(() => {
			frappe.dp_list.buildTable(frappe.dp_list.table, 8, 1)
			frappe.dp_list.buildLogTable(frappe.dp_list.logtable, 8, 1)
		}, 100);




	},

	renderFilters: function(wrapper, page){

		frappe.dp_list.client_control = frappe.ui.form.make_control({
			df: {
				label: __("Client"),
				fieldtype: 'Link',
				placeholder: __("Select Client"),
				options: 'Customer',
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.client_control'),
			render_input: true,
		});

		frappe.dp_list.client_type_control = frappe.ui.form.make_control({
			df: {
				label: __("Client Type"),
				fieldtype: 'Link',
				placeholder: __("Select Client Type"),
				options: 'Customer Type',
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.client_type_control'),
			render_input: true,
		});

		frappe.dp_list.mop_control = frappe.ui.form.make_control({
			df: {
				label: __("Mode of Payment"),
				fieldtype: 'Select',
				placeholder: __("Select MOP"),
				options: ["Cash", "Credit", "Cross Cheque", "Coupons"],
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.mop_control'),
			render_input: true,
		});


		frappe.dp_list.date_control = frappe.ui.form.make_control({
			df: {
				label: __("Delivery Date"),
				fieldtype: 'DateRange',
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.date_control'),
			render_input: true,
		});

		page.main.on("click", "#filter_btn", function () {

			frappe.dp_list.table.bootstrapTable('load', frappe.dp_list.setDPList(1, 10));
		})

	},
	buildTable: function ($el, cells, rows) {
		var i; var j; var row
		var columns = []
		var data = []
		debugger;
		var options = $el.bootstrapTable('getOptions')
		// data = frappe.dp_list.setDPList(1, 10)
		$el.bootstrapTable({
			columns: columns,
			data: data,
		})
		
		frappe.dp_list.table.bootstrapTable('load', frappe.dp_list.setDPList(1, 10));
		

	},

	buildLogTable: function ($el, cells, rows) {
		var i; var j; var row
		var columns = []
		var data = []
		debugger;
		var options = $el.bootstrapTable('getOptions')
		$el.bootstrapTable({
			columns: columns,
			data: data,
		})
		
		frappe.dp_list.logtable.bootstrapTable('load', frappe.dp_list.setLogList(1, 10));
		

	},
	
	setDPList: function (number, size) {
		
		let item_data = []
		frappe.call({
			method: "erpfluid_addons.erpfluid_addons.page.vey.vey.get_dp",
			args:{
				offset: (number - 1) * size,
				limit: size,
				filters: {
					// client: frappe.dp_list.client_control.get_value() != "" ? frappe.dp_list.client_control.get_value() : null,
					// client_type: frappe.dp_list.client_type_control.get_value() != "" ? frappe.dp_list.client_type_control.get_value() : null,
					// mop: frappe.dp_list.mop_control.get_value() != "" ? frappe.dp_list.mop_control.get_value() : null,
					// date: frappe.dp_list.date_control.get_value() != "" ? frappe.dp_list.date_control.get_value() : null,
				}
			},
			async:false,
			callback: (r) => {

				$.each(r.message, (k, v) => {
					item_data.push({
						"date": v.date,
						"day": v.day,
						"ticket_no": v.ticket_no,
						"quantity": v.quantity,
						"empty_bottles": v.empty_bottles,
						"received_payment": v.received_payment,
						"remarks": v.remarks
					})
				})

			}
		})

		return item_data


	},

	setLogList: function (number, size) {
		
		let item_data = []
		frappe.call({
			method: "erpfluid_addons.erpfluid_addons.page.vey.vey.get_logs",
			args:{
				offset: (number - 1) * size,
				limit: size,
				filters: {
					// client: frappe.dp_list.client_control.get_value() != "" ? frappe.dp_list.client_control.get_value() : null,
					// client_type: frappe.dp_list.client_type_control.get_value() != "" ? frappe.dp_list.client_type_control.get_value() : null,
					// mop: frappe.dp_list.mop_control.get_value() != "" ? frappe.dp_list.mop_control.get_value() : null,
					// date: frappe.dp_list.date_control.get_value() != "" ? frappe.dp_list.date_control.get_value() : null,
				}
			},
			async:false,
			callback: (r) => {

				$.each(r.message, (k, v) => {
					item_data.push({
						"id": `<a target="_blank" href="#Form/Complaints/`+v.name+`">`+v.name+`</a>`,
						"date": v.date,
						"comment": v.comment,
						"status": v.status,
						"resolved_date": v.resolved_date,
					})
				})

			}
		})

		return item_data


	},


	renderHeadingTiles: function(){
		var tile_values = frappe.dp_list.getCommonValues()
		$('#customer').html(tile_values.agreement_id)
		$('#customer_name').html(tile_values.customer_name)
		$('#contact').html(tile_values.cell)
		$('#delivery_schedule').html(tile_values.delivery_schedule)
		$('#agreement_date').html(tile_values.date)
		$('#bottle_rates').html(tile_values.bottle_rates)
		$('#bottle_to_delivery').html(tile_values.total_bottles)
		$('#available_coupon').html(tile_values.total_coupons)
		$('#total_deliveries').html(tile_values.total_deliveries)
		$('#total_outstanding_amount').html(tile_values.total_outstanding_amount+" /-")
	},

	getCommonValues: function(){
		frappe.dp_list.agreement_id = ""
		frappe.dp_list.customer = ""
		var customer_name = ""
		var cell = ""
		var delivery_schedule = ""
		var date = ""
		var bottle_rates = 0
		var total_bottles = 0
		var total_deliveries = 0
		var total_outstanding_amount = 0
		var total_coupons = 0
		frappe.call({
			method:"erpfluid_addons.erpfluid_addons.page.vey.vey.get_tiles_value",
			async:false,
			callback: function(r){
				if(r.message){
					var data = r.message[0]
					frappe.dp_list.agreement_id = data.agreement_id
					frappe.dp_list.customer = data.customer
					customer_name = data.client_title
					cell = data.cell
					delivery_schedule = data.delivery_schedule
					date = data.date
					bottle_rates = data.unit_rate
					total_bottles = data.total_bottles
					total_deliveries = data.total_deliveries
					total_outstanding_amount = data.outstanding_amount
					total_coupons = total_outstanding_amount / bottle_rates
					
				}
			}
		})
		return {
			"agreement_id":frappe.dp_list.agreement_id,
			"customer":frappe.dp_list.customer,
			"customer_name":customer_name,
			"cell":cell,
			"delivery_schedule":delivery_schedule,
			"date":date,
			"bottle_rates":bottle_rates,
			"total_bottles":total_bottles,
			"total_deliveries":total_deliveries,
			"total_outstanding_amount":total_outstanding_amount,
			"total_coupons":total_coupons
		}
	},
	

	make_complaint: function(){
		var d = new frappe.ui.Dialog({
            'title': 'Create Complaint',
            'fields': [
                {
                    'label': 'Customer',
                    'fieldname': 'customer',
                    'fieldtype': 'Link',
                    'options': 'Customer',
                    'read_only': 1
                },
                {
                    'label': 'Complaint Date',
                    'fieldname': 'date',
                    'fieldtype': 'Data',
                    'read_only': 1
                },
                {
                    'label': 'Comments',
                    'fieldname': 'comments',
                    'fieldtype': 'Text'
                },
                
                
            ],
            primary_action_label: 'Add Complaint',
            primary_action: function (data) {
                frappe.call({
					method: "erpfluid_addons.erpfluid_addons.page.vey.vey.create_complaint",
					args:{
						data:{
							"customer": data.customer,
							"date": data.date,
							"comments": data.comments,
							
						}
					},
					freeze: true,
					freeze_message: "Complaint is being created, please wait...",
					callback: (r) => {
						debugger;
						d.hide();

						frappe.msgprint(`Complaint Created : <a target="_blank" href="#Form/Complaints/`+r.message+`">`+r.message+`</a>`)
						frappe.dp_list.logtable.bootstrapTable('load', frappe.dp_list.setLogList(1, 10));
						window.open("/printview?doctype=Complaints&name="+r.message+"&trigger_print=1&format=Standard&no_letterhead=0&_lang=en")

					}
				})


            }
        });

        d.set_value("customer", frappe.dp_list.customer)
		d.set_value("date", frappe.datetime.now_date())
		d.show();


	}
}


