let historyTable, activeTable, needApprovedTable;

const exportExcelURL = "/admin/registrations/excel";

Onload = async () => {
	historyTable = new Tabulator("#history_table", {
		layout: "fitColumns",
		minHeight: "100px",
		index: "ID",
		paginationSize: TABULATOR_CONFIG.paginationSize,
		placeholder: "<div>Không có dữ liệu nào...!</div>",
		ajaxURL: "/api/admin/registrations",
		ajaxParams: { type: "history" },
		dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
		filterMode: "remote",
		paginationMode: "remote",
		pagination: true,
		paginationSizeSelector: [10, 20, 50, 100, true],
		movableColumns: true,
		paginationCounter: "rows",
		columns: [
			{ title: "ID", field: "_id", visible: false },
			{
				title: "Giới tính",
				field: "gender",
				formatter: (cell) => {
					return cell.getValue() == "male" ? "Nam" : "Nữ";
				},
			},
			{
				title: "Họ và tên",
				field: "fullname",
			},
			{
				title: "Ngày sinh",
				field: "birthday",
				formatter: (cell) => {
					return moment(cell.getValue()).format("DD/MM/YYYY");
				},
			},
			{ title: "Số CCCD/CMND", field: "idCardNumber" },
			{ title: "Email", field: "email" },
			{ title: "Số điện thoại", field: "phone" },
			{
				title: "Word",
				field: "Word",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
			{
				title: "Excel",
				field: "Excel",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
			{
				title: "PowerPoint",
				field: "PowerPoint",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
		],
	});
	needApprovedTable = new Tabulator("#need_approved_table", {
		layout: "fitColumns",
		minHeight: "100px",
		index: "ID",
		progressiveLoad: "scroll",
		paginationSize: TABULATOR_CONFIG.paginationSize,
		placeholder: "<div>Không có dữ liệu nào...!</div>",
		ajaxURL: "/api/admin/registrations",
		ajaxParams: { type: "need_approved" },
		dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
		paginationMode: "remote",
		columns: [
			{ title: "ID", field: "_id", visible: false },
			{
				title: "Giới tính",
				field: "gender",
				formatter: (cell) => {
					return cell.getValue() == "male" ? "Nam" : "Nữ";
				},
			},
			{
				title: "Họ và tên",
				field: "fullname",
			},
			{
				title: "Ngày sinh",
				field: "birthday",
				formatter: (cell) => {
					return moment(cell.getValue()).format("DD/MM/YYYY");
				},
			},
			{ title: "Số CCCD/CMND", field: "idCardNumber" },
			{ title: "Địa chỉ email", field: "email" },
			{ title: "Số điện thoại", field: "phone" },
			{
				title: "Word",
				field: "Word",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
			{
				title: "Excel",
				field: "Excel",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
			{
				title: "PowerPoint",
				field: "PowerPoint",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
		],
	});

	needApprovedTable.on("rowClick", (e, row) => {
		const data = row.getData();
		Swal.fire({
			buttonsStyling: false,
			customClass: {
				confirmButton: "btn btn-success mx-3 fs-4",
				denyButton: "btn btn-danger fs-4 me-3",
				cancelButton: "btn btn-secondary fs-4",
			},
			grow: "row",
			html: `<img src="https://moskhanhly.com${data.bankingImage}" alt="${data._id}" class="w-100" style="max-width: 340px;"/>`,
			title: "Duyệt Đăng ký",
			confirmButtonText: "Duyệt",
			showCancelButton: true,
			showDenyButton: true,
			denyButtonText: "Từ chối",
			cancelButtonText: "Hủy",
			showLoaderOnConfirm: true,
			showLoaderOnDeny: true,
			preDeny: async (result) => {
				Swal.fire({
					title: "Lý do tù chối duyệt?",
					input: "text",
					inputAttributes: {
						autocapitalize: "off",
					},
					showCancelButton: true,
					confirmButtonText: "Gửi",
					cancelButtonText: "Hủy",
					showLoaderOnConfirm: true,
					preConfirm: async (result) => {
						await changeIsApproved(false, data._id, result);
					},
				});
			},
			preConfirm: async (result) => {
				await changeIsApproved(result, data._id);
			},
		});
	});

	activeTable = new Tabulator("#active_table", {
		layout: "fitColumns",
		responsiveLayout: "hide",
		minHeight: "100px",
		index: "ID",
		paginationSize: TABULATOR_CONFIG.paginationSize,
		placeholder: "<div>Không có dữ liệu nào...!</div>",
		ajaxURL: "/api/admin/registrations",
		ajaxParams: { type: "approved" },
		dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
		filterMode: "remote",
		paginationMode: "remote",
		pagination: "local",
		pagination: true,
		paginationSizeSelector: [10, 20, 50, 100, true],
		movableColumns: true,
		paginationCounter: "rows",
		columns: [
			{ title: "ID", field: "_id", visible: false },
			{
				title: "Giới tính",
				field: "gender",
				formatter: (cell) => {
					return cell.getValue() == "male" ? "Nam" : "Nữ";
				},
			},
			{
				title: "Họ và tên",
				field: "fullname",
			},
			{
				title: "Ngày sinh",
				field: "birthday",
				formatter: (cell) => {
					return moment(cell.getValue()).format("DD/MM/YYYY");
				},
			},
			{ title: "Số CCCD/CMND", field: "idCardNumber" },
			{ title: "Địa chỉ email", field: "email" },
			{ title: "Số điện thoại", field: "phone" },
			{
				title: "Word",
				field: "Word",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
			{
				title: "Excel",
				field: "Excel",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
			{
				title: "PowerPoint",
				field: "PowerPoint",
				formatter: (cell) => {
					const value = cell.getValue();

					if (!value)
						return "<div class='w-100 h-100 bg-danger'></div>";

					const [h, m] = value.time.split(":");

					return moment(value.date)
						.hour(h)
						.minute(m)
						.format("HH:mm DD/MM/YYYY");
				},
			},
		],
	});

	addAction();
};

function addAction() {
	$("#reload").click(reload);
	addEvent4Search("#history", historyTable);
	addEvent4Search("#approved", activeTable);
}

function reload() {
	if (needApprovedTable) {
		needApprovedTable.dataLoader.load();
	}

	if (activeTable) {
		activeTable.dataLoader.load();
	}

	if (historyTable) {
		historyTable.dataLoader.load();
	}
	this.blur();
}

function validateDate(value) {
	if (!value) return true;

	const date = new Date(value);

	if (!date || date.getFullYear() <= 2021) return true;

	return false;
}

function addEvent4Search(queryString, tblTrigger) {
	const $parent = $(queryString);

	$(".search", $parent).click((e) => getFilter(tblTrigger, e));

	tblTrigger.inputs = [];

	const $start = $(".start", $parent);
	const $end = $(".end", $parent);

	$(".iig", $parent).click((e) => {
		openDownload(tblTrigger, "IIG");
	});

	$(".viettelpost", $parent).click((e) => {
		openDownload(tblTrigger, "VTP");
	});

	const date = moment().format("yyyy-MM-DD");

	$start.val(date);
	$end.val(date);

	inputValidate(
		$start,
		validateDate,
		"Ngày bắt đầu chưa đúng",
		null,
		(e) => {
			tblTrigger.inputs.push(e);
		}
	);
	inputValidate($end, validateDate, "Ngày kết thúc chưa đúng", null, (e) => {
		tblTrigger.inputs.push(e);
	});
}

function openDownload(table, type = "IIG") {
	const filter = arrFilter2Obj(table.getFilters());
	const dataType = table.options.ajaxParams.type;

	const params = new URLSearchParams({
		dataType,
		type,
		...filter,
	}).toString();
	console.log(params);
	open(`${exportExcelURL}?${params}`);
}

function arrFilter2Obj(filters) {
	const obj = {};

	for (const index in filters) {
		for (const key in filters[index]) {
			obj[`filter[${index}][${key}]`] = filters[index][key];
		}
	}
	return obj;
}

function getFilter(table, e) {
	const { parentNode } = e.target.parentNode;

	if (table.inputs.length < 0) {
		return;
	}

	for (const item of table.inputs) {
		item.blur();
		if (!item.valid) {
			return;
		}
	}

	const $start = $IV($(".start", parentNode));
	const $end = $IV($(".end", parentNode));
	const status = $(".status", parentNode).val();
	const startDate = moment($start.val() + " 00:00").toDate(),
		endDate = moment($end.val() + " 12:00").toDate();

	if (endDate - startDate < 0) {
		$end.setValid(false);
		$end.feedback("Ngày kết thúc phải lớn hơn ngày bắt đầu");

		return;
	}

	const filters = [
		{ field: "exam_date", type: ">=", value: startDate.getTime() },
		{ field: "exam_date", type: "=<", value: endDate.getTime() },
	];

	if (status)
		filters.push({ field: "is_approved", type: "=", value: status });

	table.setFilter(filters);
}

async function changeIsApproved(is_approved, _id, reason) {
	try {
		const res = await BaseModel.fetchAPI(BaseModel.task.approved, {
			is_approved,
			_id,
			reason,
		});
		Alert("Success", "Success!", "OK", "success");
	} catch (e) {
		Swal.showValidationMessage(e.message);
	}
	if (needApprovedTable) {
		needApprovedTable.dataLoader.load();
	}

	if (activeTable) {
		activeTable.dataLoader.load();
	}
}
