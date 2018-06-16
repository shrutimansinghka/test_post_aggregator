module.exports = [
	{method: "POST", path: "/internal/orders", name: "create", controller: "order", action: "create"},
	{method: "POST", path: "/internal/orders/:uuid/invoice-generated", name: "Invoice Generated", controller: "order", action: "update_invoice_status"}
]