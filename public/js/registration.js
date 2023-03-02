let table, Cities;

const selected = { Word: "", Excel: "", PowerPoint: "" };

const validated = {
	"#fullname": false,
	"#idCardNumber": false,
	"#birthday": false,
	"#phone": false,
	"#email": false,
	"#bankingImage": false,
	"#gender": false,
	"#city": false,
	"#district": false,
	"#ward": false,
	"#streetNumber": false,
	selected: false,
};

const checkValidExam = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await (
				await fetch("/api/check", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(selected),
				})
			).json();

			if (!data.success) reject(data);

			resolve(data);
		} catch (e) {
			reject(e);
		}
	});
};

const getDataCountry = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await (
				await fetch(
					"https://raw.githubusercontent.com/dvhcvn/data/master/data.json"
				)
			).json();
			const city = {};

			for (const { level1_id, level2s, ...item } of data) {
				const districts = {};

				for (const { level3s, level2_id, ...item } of level2s) {
					const wards = {};

					for (const { level3_id, ...item } of level3s) {
						wards[level3_id] = {
							...item,
							id: level3_id,
						};
					}

					districts[level2_id] = {
						...item,
						wards,
						id: level2_id,
					};
				}

				city[level1_id] = {
					...item,
					id: level1_id,
					districts,
				};
			}

			resolve(city);
		} catch (e) {
			reject(e);
		}
	});
};

function data2Option(obj, defaultOption = "Không có") {
	const data = Object.values(obj)
		.sort((a, b) => {
			const nameA = a.name.toUpperCase(); // ignore upper and lowercase
			const nameB = b.name.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		})
		.map((e) => `<option value="${e.id}">${e.name}</option>`);

	data.push(`<option selected value="none">${defaultOption}</option>`);

	return data;
}

Onload = async () => {
	table = new Tabulator("#registration_table", {
		layout: "fitColumns",
		minHeight: "100px",
		index: "ID",
		progressiveLoad: "scroll",
		paginationSize: 20,
		placeholder: "Không có dữ liệu nào...!",
		ajaxURL: "/api/exams",
		dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
		movableColumns: true,
		columns: [
			{ title: "ID", field: "_id", visible: false },
			{
				title: "Ngày Thi",
				field: "date",
				formatter: (cell, formatterParams) => {
					let value = cell.getValue();

					return moment(value).format("DD/MM/YYYY");
				},
			},
			{ title: "Giờ Thi", field: "time" },
			{ title: "Còn Lại", field: "remaining" },
			{
				title: "Chọn",
				editor: "list",
				editorParams: {
					values: ["Word", "Excel", "PowerPoint"],
					placeholderEmpty: "Bạn đã chọn tất cả",
					itemFormatter: (label, value, item, element) => {
						const selects = Object.keys(selected);

						for (const selector of selects) {
							if (
								selected[selector] ==
								value.toLowerCase()
							) {
								$(element).remove();
							}
						}

						return `<img src="/public/images/${label.toLowerCase()}.svg" class="pe-2"/><strong>${label}</strong>`;
					},
				},
				cellEdited: function (cell) {
					const data = cell.getData();
					const value = cell.getValue();
					const oldValue = cell.getOldValue();

					if (oldValue) selected[oldValue] = "";

					if (value) {
						selected[value] = data._id;
						checkValid();
					}

					updateParams();
				},
				formatter: (cell, formatterParams) => {
					let value = cell.getValue();
					if (!value) return "";
					return `<div class="d-flex justify-content-center">
                                <img src="/public/images/${value.toLowerCase()}.svg" width="24" class="me-2"/>
                                <span>${value} </span>
                            </div>`;
				},
			},
		],
	});

	calculatorPrice();

	const address = $("#address").val().length
		? $("#address").val().split(", ")
		: [];

	// table.on("tableBuilt", () => {
	//     // table.setData("/api/exams");
	// });

	getDataCountry()
		.then((data) => {
			Cities = data;

			let cityData = data2Option(Cities, "Tỉnh / Thành Phố");

			const $city = $("#city");
			const $district = $("#district");
			const $ward = $("#ward");

			$city.html(cityData);

			function loadDistricts(value) {
				const districtOption = data2Option(
					Cities[value].districts,
					"Quận / Huyện"
				);
				const wardOption = data2Option({}, "Phường / Xã");

				$district.html(districtOption);
				$ward.html(wardOption);
			}

			function loadWards(cityId, value) {
				const wardOption = data2Option(
					Cities[cityId].districts[value].wards,
					"Phường / Xã"
				);
				$ward.html(wardOption);
			}

			$city.change((e) => {
				const { value } = e.target;
				loadDistricts(value);
			});

			$district.change((e) => {
				const cityId = $city.val();
				const { value } = e.target;
				loadWards(cityId, value);
			});

			inputValidate(
				"#city",
				(value) => !value || value == "none",
				"Tỉnh / Thành Phố Chưa Đúng",
				(status, querySelector) => {
					validated[querySelector] = status;
				},
				($el) => inputManager.push($el)
			);

			inputValidate(
				"#district",
				(value) => !value || value == "none",
				"Quận / Huyện Chưa Đúng",
				(status, querySelector) => {
					validated[querySelector] = status;
				},
				($el) => inputManager.push($el)
			);

			inputValidate(
				"#ward",
				(value) => !value || value == "none",
				"Phường / Xã Chưa Đúng",
				(status, querySelector) => {
					validated[querySelector] = status;
				},
				($el) => inputManager.push($el)
			);

			if (address.length == 4) {
				$("#streetNumber").val(address[0]);
				const city = Object.values(Cities).find(
					(e) => e.name == address[3]
				);
				const district = Object.values(
					Cities[city.id].districts
				).find((e) => e.name == address[2]);
				const ward = Object.values(
					Cities[city.id].districts[district.id].wards
				).find((e) => e.name == address[1]);

				$(`select#city`).val(city.id);
				loadDistricts(city.id);
				$(`select#district`).val(district.id);
				loadWards(city.id, district.id);
				$(`select#ward`).val(ward.id);
			}
		})
		.catch(console.error);

	const banking = $IV("#bankingImage");
	const gender = $IV("input[name='gender']");

	inputValidate(
		"#streetNumber",
		(value) => !value || value.length < 6,
		"Số nhà, tên đường phải có ít nhất 6 ký tự",
		(status, querySelector) => {
			validated[querySelector] = status;
		},
		($el) => inputManager.push($el)
	);

	inputValidate(
		"#fullname",
		(value) => !value || value.length < 6,
		"Họ và tên phải có ít nhất 6 ký tự",
		(status, querySelector) => {
			validated[querySelector] = status;
		},
		($el) => inputManager.push($el)
	);
	inputValidate(
		"#idCardNumber",
		(value) => !value || value.length != 12 || value.length != 9,
		"Số CCCD/CMND phải có 9 hoặc 12 số",
		(status, querySelector) => {
			validated[querySelector] = status;
		},
		($el) => inputManager.push($el)
	);
	inputValidate(
		"#birthday",
		(value) => {
			if (!value) return true;

			const date = new Date(value);

			if (!date) return true;

			return (
				new Date().getFullYear() - date.getFullYear() < 18 ||
				date.getFullYear() <= 1950
			);
		},
		"Ngày sinh không đúng",
		(status, querySelector) => {
			validated[querySelector] = status;
		},
		($el) => inputManager.push($el)
	);

	inputValidate(
		"#phone",
		(value) => !value || !/^0[0-9]{9}$/g.test(value),
		"Số điện thoại không đúng",
		(status, querySelector) => {
			validated[querySelector] = status;
		},
		($el) => inputManager.push($el)
	);
	inputValidate(
		"#email",
		(value) => !value || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value),
		"Email bạn nhập chưa đúng",
		(status, querySelector) => {
			validated[querySelector] = status;
		},
		($el) => inputManager.push($el)
	);

	gender.change((e) => {
		gender.clearValidate();
		$("#gender-validate").removeClass("d-block");
	});

	banking.change(fileValidate);
};

function fileValidate({ target }) {
	const file = target.files[0];
	const banking = $IV(target);
	const img = $("#image_preview");

	img.addClass("d-none");

	if (file) {
		if (/\w*(\.png|\.jpg|\.jpeg)/g.test(file.name)) {
			$IV(target).setValid(true);
			validated["#bankingImage"] = true;
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				img.attr("src", this.result);
				img.removeClass("d-none");
			};
			return;
		}
	}

	banking.setValid(false);
	validated["#bankingImage"] = false;
	banking.feedback("Tập tin không đúng");
}

document.forms.registration.onsubmit = (e) => {
	try {
		const srcElement = e.srcElement;
		let status = true;
		const gender = $IV("input[name='gender']:checked");
		const banking = $("#bankingImage");
		const genderValid = $("#gender-validate");
		genderValid.removeClass("d-block");

		for (const el of inputManager) {
			el.blur();
		}

		fileValidate({ target: banking[0] });

		if (!gender.length) {
			genderValid.addClass("d-block");
			$genders = $IV("input[name='gender']");
			$genders.setValid(false);
			genderValid.text("Vui lòng chọn giới tính.");
			validated["#gender"] = false;
		} else {
			validated["#gender"] = true;
		}
		if (!Object.values(selected).some(Boolean)) {
			Alert("Oops", "Vui lòng chọn môn thi trước khi đăng ký");
			validated.selected = false;
		} else {
			validated.selected = true;
			$("#registrations").val(JSON.stringify(selected));
		}

		const isSubmit = Object.values(validated).every(Boolean);

		if (isSubmit) {
			address();
		}

		return isSubmit;
	} catch (e) {
		console.log(e);
		return false;
	}
};

function address() {
	const $address = $("#address");
	const address = [];

	const cityCode = $("#city").val();
	const districtCode = $("#district").val();
	const wardCode = $("#ward").val();
	const streetNumber = $("#streetNumber").val();

	address.push(Cities[cityCode].name);
	address.push(Cities[cityCode].districts[districtCode].name);
	address.push(
		Cities[cityCode].districts[districtCode].wards[wardCode].name
	);
	address.push(streetNumber);

	$address.val(address.reverse().join(", "));
}

async function checkValid() {
	try {
		const data = await checkValidExam();
		calculatorPrice();
	} catch (e) {
		if (e.data && table) {
			const res = [];
			for (const item of e.data) {
				for (const selector of Object.keys(selected)) {
					if (selected[selector] == item) {
						res.push(selector);
					}
				}
			}
		}
		return Alert(
			e.message == "CONFLICT_TIME" ? "Lỗi thời gian thi" : e.message,
			e.message == "CONFLICT_TIME"
				? "Thời gian thi phải cách nhau 1 tiếng 30 phút"
				: e.message,
			"OK",
			"error"
		);
	}
}

function updateParams() {
	if (!table) return;
	const selectCell = table.columnManager.columns[4];
	const definition = selectCell.getDefinition();

	definition.editorParams.values = Object.keys(selected).filter((e) => {
		return !selected[e];
	});
}

function calculatorPrice() {
	const val = Object.values(selected).filter(Boolean).length * 875000;
	$("#price").text(
		val.toLocaleString("vi", {
			style: "currency",
			currency: "VND",
		})
	);
}
