let table;

const selected = { Word: "", Excel: "", PowerPoint: "" };

const inputManager = [];

const validated = {
    "#fullname": false,
    "#idCardNumber": false,
    "#birthday": false,
    "#phone": false,
    "#email": false,
    "#bankingImage": false,
    "#gender": false,
    "selected": false,
}

const checkValidExam = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await (await fetch("/api/check", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(selected)
            })).json();

            if (!data.success)
                reject(data);

            resolve(data);
        } catch (e) {
            reject(e);
        }
    })
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
        columns: [
            { title: "ID", field: "_id", visible: false },
            {
                title: "Ngày Thi",
                field: "date",
                formatter: (cell, formatterParams) => {
                    let value = cell.getValue();

                    return moment(value).format("DD/MM/YYYY")
                }
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
                            if (selected[selector] == value.toLowerCase()) {
                                $(element).remove();
                            }
                        }

                        return `<img src="/public/images/${ label.toLowerCase() }.svg" class="pe-2"/><strong>${ label }</strong>`;
                    },
                },
                cellEdited: function (cell) {
                    const data = cell.getData();
                    const value = cell.getValue();
                    const oldValue = cell.getOldValue();
                    if (oldValue)
                        selected[oldValue] = "";

                    if (value) {
                        selected[value] = data._id;
                        checkValid();
                    }

                    updateParams();
                },
                formatter: (cell, formatterParams) => {
                    let value = cell.getValue();
                    if (!value)
                        return "";
                    return `<div class="d-flex justify-content-center">
                                <img src="/public/images/${ value.toLowerCase() }.svg" width="24" class="me-2"/>
                                <span>${ value } </span>
                            </div>`
                }
            }
        ],
    });

    // table.on("tableBuilt", () => {
    //     // table.setData("/api/exams");
    // });

    const banking = $IV("#bankingImage");
    const gender = $IV("input[name='gender']");

    inputValidate("#fullname", (value) => !value || value.length < 6, "Họ và tên phải có ít nhất 6 ký tự");
    inputValidate("#idCardNumber", (value) => !value || value.length != 12, "Số CCCD/CMND phải đủ 12 số");
    inputValidate("#birthday", (value) => {
        if (!value) return true;

        const date = new Date(value);

        if (!date) return true;

        return new Date().getFullYear() - date.getFullYear() < 18 || date.getFullYear() <= 1950

    }, "Ngày sinh không đúng");

    inputValidate("#phone", (value) => !value || !/^0[0-9]{9}$/g.test(value), "Số điện thoại không đúng");
    inputValidate("#email", (value) => !value || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value), "Email bạn nhập chư a đúng");

    gender.change((e) => {
        gender.clearValidate();
        $("#gender-validate").removeClass("d-block");
    });

    banking.change(fileValidate);

}

function fileValidate({ target }) {
    const file = target.files[0];
    const banking = $IV(target);
    const img = $('#image_preview');

    img.addClass("d-none");

    if (file) {
        if (/\w*(\.png|\.jpg|\.jpeg)/g.test(file.name)) {
            $IV(target).setValid(true);
            validated["#bankingImage"] = true;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                img.attr('src', this.result);
                img.removeClass("d-none");
            }
            return;
        }
    }

    banking.setValid(false);
    validated["#bankingImage"] = false;
    banking.feedback("Tập tin không đúng")
}

function inputValidate(querySelector, invalidCheck, invalidFeedback) {
    const $el = $IV(querySelector);
    if (!invalidCheck || !$el) return;

    const validate = function ({ target }) {
        const $target = $(target);
        const value = $target.val();

        if (invalidCheck(value)) {
            $target.setValid(false);
            $target.feedback(invalidFeedback || "invalid");
            validated[querySelector] = false;
        } else {
            $target.setValid(true);
            validated[querySelector] = true;
        }
    }

    $el.__proto__.validate = validate;

    inputManager.push($el);

    $el.blur(validate);

    $el.focus($el.clearValidate);
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

        return Object.values(validated).every(Boolean);
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function checkValid() {
    try {
        const data = await checkValidExam();
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
        return Alert(e.message == "CONFLICT_TIME" ? "Lỗi thời gian thi" : e.message, e.message == "CONFLICT_TIME" ? "Thời gian thi phải cách nhau 1 tiếng 30 phút" : e.message, "OK", "error");
    }
}

function updateParams() {
    if (!table) return;
    const selectCell = table.columnManager.columns[4];
    const definition = selectCell.getDefinition();

    definition.editorParams.values = Object.keys(selected).filter(e => {
        return !selected[e]
    });
}