let table;

Onload = () => {
    table = new Tabulator("#table", {
        layout: "fitColumns",
        minHeight: "100px",
        index: "ID",
        paginationSize: TABULATOR_CONFIG.paginationSize,
        placeholder: "Không có dữ liệu nào...!",
        ajaxURL: "/api/admin/short",
        dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
        filterMode: "remote",
        paginationMode: "remote",
        pagination: true,
        paginationSizeSelector: [10, 30, 50, 100, true],
        movableColumns: true,
        paginationCounter: "rows",
        langs: {
            default: {
                pagination: {
                    first: "<strong><<</strong>",
                    prev: "<",
                    next: "<strong>></strong>",
                    last: ">>",
                },
            },
        },
        rowFormatter: (row) => {
            const { accessTimes, expired, isExpired, isAccessTime } = row.getData();
            const el = row.getElement();

            const expired0 = new Date(moment(expired).toDate().setHours(0, 0, 0, 0));
            const current = new Date(moment().toDate().setHours(0, 0, 0, 0));

            if ((isAccessTime && accessTimes == 0) || (isExpired && (expired0 <= current))) {
                el.classList.add("bg-danger");
                el.classList.add("text-white");
            }
        },
        columns: [
            { title: "ID", field: "_id", visible: false },
            {
                title: "Rút gọn",
                field: "hash",
                widthGrow: 3,
                formatter: (cell) => {
                    let value = cell.getValue();

                    return `${ location.origin }/s/${ value }`;
                },
            },
            { title: "Đường dẫn", field: "realURL", widthGrow: 4 },
            {
                title: "Hạn và lượt", widthGrow: 2, formatter: (cell) => {
                    const { accessTimes, expired, isExpired, isAccessTime } = cell.getData();

                    let displayText = "";

                    if (isAccessTime) {
                        displayText += `còn ${ accessTimes } lượt `;
                    }

                    if (isExpired) {
                        displayText += `hạn đến ${ moment(expired).format("DD-MM-YYYY") }`;
                    }

                    if (!displayText.length) {
                        displayText = "Không có thời hạn";
                    }

                    return displayText;
                }
            },
            {
                title: "Xóa",
            },
        ],
    });

    table.on("rowClick", (e, row) => {
        const data = row.getData();
        shortForm(data._id, data.realURL, data.isExpired || data.isAccessTime, data.expired, data.accessTimes);
    });

    $(".add").click(() => {
        shortForm()
    })
}

function shortForm(_id, realURL, isExpired, expired, accessTimes) {
    Swal.fire({
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn btn-success mx-3 fs-4",
            denyButton: "btn btn-danger fs-4 me-3",
            cancelButton: "btn btn-secondary fs-4",
        },
        // grow: "row",
        html: `<div class="d-flex flex-column">
                    <input type="text" id="realURL" class="form-control mb-3" placeholder="Đường dẫn https://..." value="${ realURL ? realURL : "" }">
                    <div class="form-check form-switch mx-2 mb-3">
                      <input class="form-check-input" type="checkbox" role="switch" id="isExpired" checked="${ isExpired }">
                      <label class="form-check-label" for="isExpired">Tạo thời hạn cho đường dẫn</label>
                    </div>
                    <div id="formRoot"></div>
                </div>`,
        title: (_id ? "Chỉnh Sửa" : "Tạo") + " Short Link",
        confirmButtonText: "Gửi",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        showLoaderOnConfirm: true,
        didRender: () => {
            const root = $("#formRoot");

            if (isExpired) {
                root.html(`
                        <input type="number" id="accessTime" class="form-control" placeholder="Số lượt truy cập" value="${ accessTimes ? accessTimes : 0 }" min="0">
                        <div class="text-danger my-1">* nếu là 0 sẽ không tính số lượt truy cập</div>
                        <input type="date" id="expired" class="form-control mb-3" placeholder="Ngày hết hạn" value="${moment(expired).format("YYYY-MM-DD")}">
                        <div class="text-danger my-1">* nếu hôm nay sẽ không tính ngày hết hạn</div>`)
            } else {
                root.html("");
            }

            $("#isExpired").change(function (e) {
                if (this.checked) {
                    root.html(`
                        <input type="number" id="accessTime" class="form-control" placeholder="Số lượt truy cập" value="0" min="0">
                        <div class="text-danger my-1">* nếu là 0 sẽ không tính số lượt truy cập</div>
                        <input type="date" id="expired" class="form-control mb-3" placeholder="Ngày hết hạn">
                        <div class="text-danger my-1">* nếu hôm nay sẽ không tính ngày hết hạn</div>`)
                    $("#expired").val(moment().format("YYYY-MM-DD"));
                } else {
                    root.html("");
                }
            })
            $("#mail").keyup(function (e) {
                const value = this.value;
                this.value = value
                    .replace(/0a0/g, "@")
                    .replace(/0dot0/g, ".");
            });
        },
        preConfirm: async (result) => {
            try {
                const $url = $("#realURL");
                const url = $url.val();
                const isExpired = $("#isExpired").is(":checked");

                if (!/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gmi.test(url)) {
                    Swal.showValidationMessage("Định dạng đường dẫn không đúng!");
                    $url.focus();
                    return;
                }

                const body = {
                    realURL: url,
                    ...(_id ? { _id } : {}),
                };

                if (isExpired) {
                    const expired = $("#expired").val();
                    const accessTimes = $("#accessTime").val();
                    if (moment(expired).format("DD-MM-YYYY") != moment().format("DD-MM-YYYY") && moment(expired).toDate() > moment().toDate())
                        body.expired = expired;

                    if (accessTimes > 0)
                        body.accessTimes = accessTimes;
                    body._id = _id;
                }

                await send(body);
            } catch (e) {
                Swal.showValidationMessage(e.message);
            }
        },
    });
}

async function send(body) {
    const data = await BaseModel.fetchAPI(BaseModel.task.short_create_or_update, body);
    table.dataLoader.load();
    Swal.fire({
        title: data.message,
        icon: "success",
        html: `<div class="alert alert-warning copy" role="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Sao chép">${ data.data }</div>`,
        didRender: () => {
            $(".copy").click(() => {
                const value = $(".copy").text();
                navigator.clipboard.writeText(value);
                Swal.fire({
                    icon: "success",
                    title: "Sao chép thành công",
                    timer: 1000,
                    timerProgressBar: true,
                })

            })
        }
    })
}