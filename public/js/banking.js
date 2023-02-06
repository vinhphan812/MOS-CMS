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
                                <span>${ value } </span>
                            </div>`;
                },
            },
        ],
    });

    table.on("rowClick", (e, row) => {
        const data = row.getData();
        Swal.fire({
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-success mx-3 fs-4',
                denyButton: 'btn btn-danger fs-4 me-3',
                cancelButton: 'btn btn-secondary fs-4'
            },
            grow: "row",
            input: 'text',
            inputAttributes: {
              placeholder: "Email"
            },
            title: "Gửi lại Mail",
            confirmButtonText: "Duyệt",
            showCancelButton: true,
            showDenyButton: true,
            denyButtonText: "Từ chối",
            cancelButtonText: "Hủy",
            showLoaderOnConfirm: true,
            showLoaderOnDeny: true,
            preDeny: async (result) => {
                Swal.fire({
                    title: 'Lý do tù chối duyệt?',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Gửi',
                    cancelButtonText: "Hủy",
                    showLoaderOnConfirm: true,
                    preConfirm: async (result) => {
                        await changeIsApproved(false, data._id, result);
                    }
                })
            },
            preConfirm: async (result) => {
                await changeIsApproved(result, data._id);
            }
        });
    });
}