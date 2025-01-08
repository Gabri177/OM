<template>
	<div class="flex flex-col items-center justify-center w-full">
		<!-- 添加右上角按钮 -->
		<div class="fixed top-4 right-4">
			<button class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600" @click="exportToPDF">
				Export to PDF
			</button>
		</div>
		<div id="invoice-content">
			<div class="clearfix flex flex-col items-end justify-end w-[685.109px]">
				<div id="logo">
					<img src="./logo.png" alt="Logo">
				</div>
				<div id="company">
					<h2 class="name">{{ companyDetails.name }}</h2>
					<div>{{ companyDetails.address }}</div>
					<div>{{ companyDetails.phone }}</div>
					<div>{{ companyDetails.email }}</div>
				</div>
			</div>
			<div>
				<div id="details" class="clearfix">
					<div id="client">
						<div class="to">INVOICE TO:</div>
						<h2 class="name">{{ customerDetails.name }}</h2>
						<div class="address">{{ customerDetails.address }}</div>
						<div class="email">{{ customerDetails.email }}</div>
					</div>
					<div id="invoice">
						<h1>{{ invoiceNumber }}</h1>
						<div class="date">Date of Invoice: {{ issueDate }}</div>
						<div class="date">Due Date: {{ dueDate }}</div>
					</div>
				</div>
				<table border="0" cellspacing="0" cellpadding="0">
					<thead>
						<tr>
							<th class="no">#</th>
							<th class="desc">DESCRIPTION</th>
							<th class="unit">UNIT PRICE</th>
							<th class="qty">QUANTITY</th>
							<th class="total">TOTAL</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in items" :key="index">
							<td class="no">{{ index + 1 }}</td>
							<td class="desc">
								<h3>{{ item.name }}</h3>
								{{ item.description }}
							</td>
							<td class="unit">${{ item.price.toFixed(2) }}</td>
							<td class="qty">{{ item.quantity }}</td>
							<td class="total">${{ (item.price * item.quantity).toFixed(2) }}</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="2"></td>
							<td colspan="2">SUBTOTAL</td>
							<td>${{ subtotal.toFixed(2) }}</td>
						</tr>
						<tr>
							<td colspan="2"></td>
							<td colspan="2">TAX 25%</td>
							<td>${{ tax.toFixed(2) }}</td>
						</tr>
						<tr>
							<td colspan="2"></td>
							<td colspan="2">GRAND TOTAL</td>
							<td>${{ grandTotal.toFixed(2) }}</td>
						</tr>
					</tfoot>
				</table>
				<div id="thanks">Thank you!</div>
				<div id="notices">
					<div>NOTICE:</div>
					<div class="notice">
						A finance charge of 1.5% will be made on unpaid balances after 30 days.
					</div>
				</div>
				<div style="min-height: 50px;"></div>
			</div>
		</div>
	</div>
</template>




<style scope>
@font-face {
	font-family: SourceSansPro;
	src: url(SourceSansPro-Regular.ttf);
}

.clearfix:after {
	content: "";
	display: table;
	clear: both;
}

a {
	color: #0087C3;
	text-decoration: none;
}

body {
	position: relative;
	width: 21cm;
	height: 29.7cm;
	margin: 0 auto;
	color: #555555;
	background: #FFFFFF;
	font-family: Arial, sans-serif;
	font-size: 14px;
	font-family: SourceSansPro;
}

header {
	padding: 10px 0;
	margin-bottom: 20px;
	border-bottom: 1px solid #AAAAAA;
}

#logo {
	float: left;
	margin-top: 8px;
}

#logo img {
	height: 70px;
}

#company {
	float: right;
	text-align: right;
}


#details {
	margin-bottom: 50px;
}

#client {
	padding-left: 6px;
	border-left: 6px solid #db3311;
	float: left;
}

#client .to {
	color: #777777;
}

h2.name {
	font-size: 1.4em;
	font-weight: normal;
	margin: 0;
}

#invoice {
	float: right;
	text-align: right;
}

#invoice h1 {
	color: #db3311;
	font-size: 2.4em;
	line-height: 1em;
	font-weight: normal;
	margin: 0 0 10px 0;
}

#invoice .date {
	font-size: 1.1em;
	color: #777777;
}

table {
	width: 100%;
	border-collapse: collapse;
	border-spacing: 0;
	margin-bottom: 20px;
}

table th,
table td {
	padding: 20px;
	background: #EEEEEE;
	text-align: center;
	border-bottom: 1px solid #FFFFFF;
}

table th {
	white-space: nowrap;
	font-weight: normal;
}

table td {
	text-align: right;
}

table td h3 {
	color: #db3311;
	font-size: 1.2em;
	font-weight: normal;
	margin: 0 0 0.2em 0;
}

table .no {
	color: #FFFFFF;
	font-size: 1.6em;
	background: #db3311;
}

table .desc {
	text-align: left;
}

table .unit {
	background: #DDDDDD;
}

table .qty {}

table .total {
	background: #db3311;
	color: #FFFFFF;
}

table td.unit,
table td.qty,
table td.total {
	font-size: 1.2em;
}

table tbody tr:last-child td {
	border: none;
}

table tfoot td {
	padding: 10px 20px;
	background: #FFFFFF;
	border-bottom: none;
	font-size: 1.2em;
	white-space: nowrap;
	border-top: 1px solid #AAAAAA;
}

table tfoot tr:first-child td {
	border-top: none;
}

table tfoot tr:last-child td {
	color: #db3311;
	font-size: 1.4em;
	border-top: 1px solid #db3311;

}

table tfoot tr td:first-child {
	border: none;
}

#thanks {
	font-size: 2em;
	margin-bottom: 50px;
}

#notices {
	padding-left: 6px;
	border-left: 6px solid #db3311;
}

#notices .notice {
	font-size: 1.2em;
}

footer {
	color: #777777;
	width: 100%;
	height: 30px;
	position: absolute;
	bottom: 0;
	border-top: 1px solid #AAAAAA;
	padding: 8px 0;
	text-align: center;
}

html,
body {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
}
</style>


<script setup>
import { ref, computed } from "vue";
import html2pdf from "html2pdf.js";

// 响应式数据
const companyDetails = ref({
	name: "Tech Solutions Ltd.",
	address: "123 Technology Road, Silicon Valley, CA",
	phone: "+1 123 456 7890",
	email: "info@techsolutions.com",
});

const customerDetails = ref({
	name: "John Doe",
	address: "456 Elm Street, Springfield, IL",
	email: "johndoe@example.com",
});

const invoiceNumber = ref("INV-2025001");
const issueDate = ref("2025-01-08");
const dueDate = ref("2025-02-08");

const items = ref([
	{ name: "Website Development", description: "Building a responsive website", price: 1200, quantity: 1 },
	{ name: "Mobile App", description: "Creating a cross-platform mobile app", price: 2500, quantity: 1 },
	{ name: "SEO Optimization", description: "Improving search engine rankings", price: 500, quantity: 2 },
]);

// 计算属性
const subtotal = computed(() =>
	items.value.reduce((total, item) => total + item.price * item.quantity, 0)
);

const tax = computed(() => subtotal.value * 0.25);

const grandTotal = computed(() => subtotal.value + tax.value);

// 导出为 PDF
const exportToPDF = () => {
	const invoiceElement = document.getElementById("invoice-content");
	const options = {
		margin: 0.5,
		filename: "invoice.pdf",
		image: { type: "jpeg", quality: 0.98 },
		html2canvas: { scale: 2 },
		jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
	};
	html2pdf().set(options).from(invoiceElement).save();
};
</script>
