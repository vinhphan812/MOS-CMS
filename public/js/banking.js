let table;

Onload = () => {
    table = new Tabulator("#table-banking", {
        layout: "fitColumns",
        minHeight: "100px",
        index: "ID",
        progressiveLoad: "scroll",
        paginationSize: 20,
        placeholder: "Không có dữ liệu nào...!",
        ajaxURL: "/api/admin/banking",
        dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
        movableColumns: true,
        rowFormatter: (row) => {
            const data = row.getData();
            const el = row.getElement();
            if (!data.status) {
                el.classList.add("bg-danger");
                el.classList.add("text-white")
            }
        },
        columns: [
            { title: "ID", field: "_id", visible: false },
            {
                title: "Số tiền",
                field: "amount",
                widthGrow: 1,
                formatter: (cell, formatterParams) => {
                    let value = +cell.getValue();

                    return value.toLocaleString("vi", { style: "currency", currency: "VND" });
                },
            },
            {
                title: "Vào Lúc",
                field: "date",
                widthGrow: 1,
                formatter: (cell, formatterParams) => {
                    let value = cell.getValue();

                    return moment(value).format("HH:mm DD-MM-YYYY")
                },
            },
            { title: "Mô tả", field: "description", widthGrow: 4 },
            { title: "Email", field: "email", widthGrow: 2 },
            {
                title: "Đã gủi",
                field: "sendType",
                formatter: (cell, formatterParams) => {
                    let value = cell.getValue();
                    if (!value) return "";
                    return `<div class="d-flex justify-content-center">
                                <img src="/public/images/${ value.toLowerCase() }.svg" width="24" class="me-2"/>
                            </div>`;
                },
            },
        ],
    });

    table.on("rowClick", (e, row) => {
        const data = row.getData();
        sendAlert(data)
    });

    $("#send").click(() => {
        sendAlert({});
    })
}

function sendAlert({ _id, description }) {
    Swal.fire({
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn btn-success mx-3 fs-4',
            denyButton: 'btn btn-danger fs-4 me-3',
            cancelButton: 'btn btn-secondary fs-4'
        },
        // grow: "row",
        html: `<div class="d-flex flex-column">
                ${ description ? `<div class="alert alert-warning">${ description }</div>` : "" }
                <input type="email" id="mail" class="form-control mb-3" placeholder="Email">
                <select class="form-select" id="type">
                      <option value="Word">Word</option>
                      <option value="Excel">Excel</option>
                      <option value="PowerPoint">PowerPoint</option>
                </select>
                </div>`,
        title: _id ? "Gửi Lại Mail" : "Gửi Mail",
        confirmButtonText: "Gửi",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        showLoaderOnConfirm: true,
        didRender: () => {
            $("#mail").keyup(function (e) {
                const value = this.value;
                this.value = value.replace(/0a0/g, "@").replace(/0dot0/g, ".");
            })
        },
        preConfirm: async (result) => {
            try {
                const email = $("#mail").val()
                const type = $("#type").val();
                await send({ _id, type, email });
            } catch (e) {
                Swal.showValidationMessage(e.message);
            }
        }
    });
}

async function send({ _id, email, type }) {
    await BaseModel.fetchAPI(BaseModel.task.send_download, { _id, email, type });

    if(_id) {
        table.dataLoader.load();
    }
}