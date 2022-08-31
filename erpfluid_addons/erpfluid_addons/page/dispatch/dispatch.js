frappe.pages['dispatch'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Dispatch',
		single_column: true
	});

	page.main.html(frappe.render_template("dispatch", { 'doc': {} }));
	

	frappe.si_list.make(wrapper, wrapper.page);
	frappe.si_list.so = ""
}



frappe.si_list = {

	make: function (wrapper, page) {
		// setTimeout(() => {
			// frappe.si_list.renderFilters(wrapper, page);
			// frappe.si_list.date_control.set_value([frappe.datetime.month_start(), frappe.datetime.now_date()]);
			
		// }, 100);

		var me = frappe.si_list;
		me.page = page;


		frappe.si_list.table = $('#datatable');
		
		setTimeout(() => {
			frappe.si_list.buildTable(frappe.si_list.table, 8, 1)
		}, 100);


	},

	renderFilters: function(wrapper, page){

		frappe.si_list.client_control = frappe.ui.form.make_control({
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

		frappe.si_list.client_type_control = frappe.ui.form.make_control({
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

		frappe.si_list.mop_control = frappe.ui.form.make_control({
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


		frappe.si_list.date_control = frappe.ui.form.make_control({
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

			frappe.si_list.table.bootstrapTable('load', frappe.si_list.setDTList(1, 10));
		})

	},
	buildTable: function ($el, cells, rows) {
		var i; var j; var row
		var columns = []
		var data = []
		debugger;
		var options = $el.bootstrapTable('getOptions')
		data = frappe.si_list.setDTList(1, 10)
		$el.bootstrapTable({
			columns: columns,
			data: data,
			onClickRow: function(row, $element, field){
				debugger;
				if(field == 'dispatch'){
					var new_customer = 1
					if(row.new_customer == 'Yes'){
						new_customer = 0
					}
					var d = new frappe.ui.Dialog({
						'title': 'Dispatch Order',
						'fields': [
							{
								'label': 'Account No',
								'fieldname': 'account_no',
								'fieldtype': 'Data',
								'read_only': 1,
								'hidden':1
							},
							{
								'label': 'Ticket No',
								'fieldname': 'ticket_no',
								'fieldtype': 'Data',
								'read_only': 1,
								'hidden':1
							},
							{
								'label': 'Customer Type',
								'fieldname': 'cust_type',
								'fieldtype': 'Data',
								'read_only': 1,
								'hidden':1
							},
							{
								'label': 'Customer',
								'fieldname': 'client_title',
								'fieldtype': 'Data',
								'read_only': 1
							},
							{
								'label': 'Cell No',
								'fieldname': 'cell_no',
								'fieldtype': 'Data',
								'read_only': 1,
								'hidden':1
							},
							{
								'label': 'Delivery Address',
								'fieldname': 'delivery_address',
								'fieldtype': 'Data',
								'read_only': 1
							},
							{
								'label': "Reason",
								'fieldname': 'reason',
								'fieldtype': 'Link',
								'options': 'Dispatch Reason'
							},
							{
								'label': 'Rate Unit',
								'fieldname': 'rate_unit',
								'fieldtype': 'Data',
								'read_only': 1,
								'hidden':1
							},
							{
								'label': 'Delivery Date',
								'fieldname': 'delivery_date',
								'fieldtype': 'Date',
								'read_only': 1,
								'hidden':1
							},
							{
								'label': "Dispatch Register",
								'fieldname': 'reg_qty',
								'fieldtype': 'Int',
								'read_only': 1,
							},
							{
								'label': "Dispatch Qty",
								'fieldname': 'qty',
								'fieldtype': 'Int',
							},
							{
								'label': "Empty Bottles",
								'fieldname': 'empty_qty',
								'fieldtype': 'Int',
							},
							{
								'label': "Payment Received",
								'fieldname': 'received_amount',
								'fieldtype': 'Currency',
							},
							{
								'label': 'Mode of Payment',
								'fieldname': 'mop',
								'fieldtype': 'Data',
								'read_only': 1
							},
							{
								'label': "Accessories Sale",
								'fieldname': 'accessories_sales',
								'fieldtype': 'Currency',
								'read_only': new_customer
							},
							
							{
								'label': "Fixed Deposit",
								'fieldname': 'fixed_deposit',
								'fieldtype': 'Currency',
							},

							
						],
						primary_action_label: 'Dispatch Order',
						primary_action: function (data) {
							debugger;
							if(data.qty > data.reg_qty){
								frappe.msgprint("Qty cannot be exceed as Registered Qty in Agreement")

							}else{

								frappe.call({
									method: "erpfluid_addons.erpfluid_addons.page.dispatch.dispatch.create_dispatch",
									args:{
										data:{
											"account_no": data.account_no,
											"ticket_no": data.ticket_no,
											"cust_type": data.cust_type,
											"client_title": data.client_title,
											"cell_no": data.cell_no,
											"address": data.delivery_address,
											"rate_unit": data.rate_unit,
											"delivery_date": data.delivery_date,
											"mop": data.mop,
											"qty": data.qty,
											"empty_bottles": data.empty_qty,
											"accessories_sales": data.accessories_sales,
											"received_payment": data.received_amount,
											"fixed_deposit": data.fixed_deposit,
											"reason": data.reason
										}
									},
									freeze: true,
									freeze_message: "Dispatch is being created, please wait...",
									callback: (r) => {
										debugger;
										d.hide();

										frappe.msgprint(`Dispatch Created : <a target="_blank" href="#Form/Dispatch/`+r.message+`">`+r.message+`</a>`)
										frappe.si_list.table.bootstrapTable('load', frappe.si_list.setDTList(1, 10));
										window.open("/printview?doctype=Dispatch&name="+r.message+"&trigger_print=1&format=Standard&no_letterhead=0&_lang=en")

									}
								})

							}


						}
					});

					d.set_value("account_no", row.account_no)
					d.set_value("ticket_no", row.ticket_no)
					d.set_value("cust_type", row.cust_type)
					d.set_value("client_title", row.client_title)
					d.set_value("cell_no", row.cell_no)
					d.set_value("delivery_address", row.delivery_address)
					d.set_value("rate_unit", row.rate_unit)
					d.set_value("delivery_date", row.delivery_date)
					d.set_value("mop", row.mop)
					d.set_value('reg_qty',row.reg_qty)
					d.set_value("qty", row.qty)
					d.set_value("received_amount", row.qty*row.rate_unit)
					d.set_value("accessories_sales",0)
					d.set_value("fixed_deposit",0)

					d.show();
				}
				else if(field == 'checkin'){
					const options = {
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0
					};

					function success(pos) {
						const crd = pos.coords;

						console.log('Your checkin current position is:');
						console.log(`Latitude : ${crd.latitude}`);
						console.log(`Longitude: ${crd.longitude}`);
						console.log(`More or less ${crd.accuracy} meters.`);
						// var destAddress = new google.maps.LatLng(crd.latitude, crd.longitude);
						let origin = ""
						let destination = ""
						frappe.call({
							method: "erpfluid_addons.erpfluid_addons.page.dispatch.dispatch.create_checkin",
							args: {
								data:{
									"user": frappe.user.name,
									"origin":origin,
									"destination":destination,
									"date": frappe.datetime.now_date(),
									"start_time": frappe.datetime.now_time(),
									"ticket_no": row.ticket_no
								}
							},
							callback: (r)=>{
								if (r.message == "Existing Trip Already Found."){
									frappe.msgprint(r.message)
								}
								else{
									frappe.msgprint("Checkin Added")
								}
							}

						})
					}

					function error(err) {
						console.warn(`ERROR(${err.code}): ${err.message}`);
					}

					navigator.geolocation.getCurrentPosition(success, error, options);
				}
				// else if(field == 'checkout'){
				// 	const options = {
				// 		enableHighAccuracy: true,
				// 		timeout: 5000,
				// 		maximumAge: 0
				// 	};

				// 	function success(pos) {
				// 		const crd = pos.coords;

				// 		console.log('Your checkout current position is:');
				// 		console.log(`Latitude : ${crd.latitude}`);
				// 		console.log(`Longitude: ${crd.longitude}`);
				// 		console.log(`More or less ${crd.accuracy} meters.`);
				// 	}

				// 	function error(err) {
				// 		console.warn(`ERROR(${err.code}): ${err.message}`);
				// 	}

				// 	navigator.geolocation.getCurrentPosition(success, error, options);

				// }
			}

		})
		
		
		

	},
	
	setDTList: function (number, size) {
		
		let item_data = []
		frappe.call({
			method: "erpfluid_addons.erpfluid_addons.page.dispatch.dispatch.get_dt",
			args:{
				offset: (number - 1) * size,
				limit: size,
				filters: {
					// client: frappe.si_list.client_control.get_value() != "" ? frappe.si_list.client_control.get_value() : null,
					// client_type: frappe.si_list.client_type_control.get_value() != "" ? frappe.si_list.client_type_control.get_value() : null,
					// mop: frappe.si_list.mop_control.get_value() != "" ? frappe.si_list.mop_control.get_value() : null,
					// date: frappe.si_list.date_control.get_value() != "" ? frappe.si_list.date_control.get_value() : null,
				}
			},
			async:false,
			callback: (r) => {

				$.each(r.message, (k, v) => {
					item_data.push({
						"ticket_no": v.ticket_no,
						"cust_type": v.client_type,
						"client_title": v.client_title,
						"cell_no": v.phone_fax,
						"delivery_address": v.address,
						"rate_unit": v.rate_unit,
						"delivery_date": v.delivery_date,
						"mop": v.mode_of_payments,
						"qty": v.reg_qty,
						"checkin": "<a class='btn btn-primary inline_checkin'>Checkin</a>",
						"dispatch": "<a class='btn btn-primary inline_dispatch'>DISPATCH</a>",
						"account_no": v.account_no,
						"reg_qty": v.reg_qty,
						"new_customer": v.new_customer,
					})
				})

			}
		})

		return item_data


	},
	
}


