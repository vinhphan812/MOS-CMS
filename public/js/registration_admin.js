let historyTable, activeTable, needApprovedTable;

Onload = async () => {
    historyTable = new Tabulator("#history_table", {
        layout: "fitColumns",
        minHeight: "100px",
        index: "ID",
        progressiveLoad: "scroll",
        paginationSize: 20,
        placeholder: "<div>Không có dữ liệu nào...!</div>",
        ajaxURL: "/api/admin/registrations",
        ajaxParams: { type: "history" },
        dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
        columns: [
            { title: "ID", field: "_id", visible: false },
            {
                title: "Giới tính",
                field: "gender",
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
                }
            },
            { title: "Số CCCD/CMND", field: "idCardNumber" },
            { title: "Địa chỉ email", field: "email" },
            { title: "Số điện thoại", field: "phone" },
            {
                title: "Word", field: "Word", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            {
                title: "Excel", field: "Excel", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            {
                title: "PowerPoint", field: "PowerPoint", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            // {
            //     title: "Chọn",
            //     editor: "list",
            //     editorParams: {
            //         values: ["Word", "Excel", "PowerPoint"],
            //         placeholderEmpty: "Bạn đã chọn tất cả",
            //         itemFormatter: (label, value, item, element) => {
            //             const selects = Object.keys(selected);
            //
            //             for (const selector of selects) {
            //                 if (selected[selector] == value.toLowerCase()) {
            //                     $(element).remove();
            //                 }
            //             }
            //
            //             return `<img src="/public/images/${ label.toLowerCase() }.svg" class="pe-2"/><strong>${ label }</strong>`;
            //         },
            //     },
            //     cellEdited: function (cell) {
            //         const data = cell.getData();
            //         const value = cell.getValue();
            //         const oldValue = cell.getOldValue();
            //         if (oldValue)
            //             selected[oldValue] = "";
            //
            //         if (value) {
            //             selected[value] = data._id;
            //             checkValid();
            //         }
            //
            //         updateParams();
            //     },
            //     formatter: (cell, formatterParams) => {
            //         let value = cell.getValue();
            //         if (!value)
            //             return "";
            //         return `<div class="d-flex justify-content-center">
            //                     <img src="/public/images/${ value.toLowerCase() }.svg" width="24" class="me-2"/>
            //                     <span>${ value } </span>
            //                 </div>`
            //     }
            // }
        ],
    });
    needApprovedTable = new Tabulator("#need_approved_table", {
        layout: "fitColumns",
        minHeight: "100px",
        index: "ID",
        progressiveLoad: "scroll",
        paginationSize: 20,
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
                }
            },
            { title: "Số CCCD/CMND", field: "idCardNumber" },
            { title: "Địa chỉ email", field: "email" },
            { title: "Số điện thoại", field: "phone" },
            {
                title: "Word", field: "Word", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            {
                title: "Excel", field: "Excel", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            {
                title: "PowerPoint", field: "PowerPoint", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
        ],
    });

    needApprovedTable.on("rowClick", (e, row) => {
        const data = row.getData();
        Swal.fire({

            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-success mx-3 fs-4',
                denyButton: 'btn btn-danger fs-4 me-3',
                cancelButton: 'btn btn-secondary fs-4'
            },
            grow: "row",
            html: `<img src="${ data.bankingImage }" alt="${ data._id }" class="w-100"/>`,
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
                        await changeIsApproved(result, data._id);
                    }
                })
            },
            preConfirm: async (result) => {
                await changeIsApproved(result, data._id);
            }
        });
    });

    activeTable = new Tabulator("#active_table", {
        layout: "fitColumns",
        minHeight: "100px",
        index: "ID",
        progressiveLoad: "scroll",
        paginationSize: 20,
        placeholder: "<div>Không có dữ liệu nào...!</div>",
        ajaxURL: "/api/admin/registrations",
        ajaxParams: { type: "approved" },
        dataLoaderLoading: "<span>Đang tải dữ liệu...!</span>",
        columns: [
            { title: "ID", field: "_id", visible: false },
            {
                title: "Giới tính",
                field: "gender",
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
                }
            },
            { title: "Số CCCD/CMND", field: "idCardNumber" },
            { title: "Địa chỉ email", field: "email" },
            { title: "Số điện thoại", field: "phone" },
            {
                title: "Word", field: "Word", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            {
                title: "Excel", field: "Excel", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            {
                title: "PowerPoint", field: "PowerPoint", formatter: (cell) => {
                    const value = cell.getValue();

                    if (!value)
                        return "<div class='w-100 h-100 bg-danger'></div>";

                    const [h, m] = value.time.split(":");

                    return moment(value.date).hour(h).minute(m).format("HH:mm DD/MM/YYYY");
                }
            },
            // {
            //     title: "Chọn",
            //     editor: "list",
            //     editorParams: {
            //         values: ["Word", "Excel", "PowerPoint"],
            //         placeholderEmpty: "Bạn đã chọn tất cả",
            //         itemFormatter: (label, value, item, element) => {
            //             const selects = Object.keys(selected);
            //
            //             for (const selector of selects) {
            //                 if (selected[selector] == value.toLowerCase()) {
            //                     $(element).remove();
            //                 }
            //             }
            //
            //             return `<img src="/public/images/${ label.toLowerCase() }.svg" class="pe-2"/><strong>${ label }</strong>`;
            //         },
            //     },
            //     cellEdited: function (cell) {
            //         const data = cell.getData();
            //         const value = cell.getValue();
            //         const oldValue = cell.getOldValue();
            //         if (oldValue)
            //             selected[oldValue] = "";
            //
            //         if (value) {
            //             selected[value] = data._id;
            //             checkValid();
            //         }
            //
            //         updateParams();
            //     },
            //     formatter: (cell, formatterParams) => {
            //         let value = cell.getValue();
            //         if (!value)
            //             return "";
            //         return `<div class="d-flex justify-content-center">
            //                     <img src="/public/images/${ value.toLowerCase() }.svg" width="24" class="me-2"/>
            //                     <span>${ value } </span>
            //                 </div>`
            //     }
            // }
        ],
    })
}

async function changeIsApproved(is_approved, _id, reason) {
    try {
        const res = await BaseModel.fetchAPI(BaseModel.task.approved, { is_approved, _id, reason });
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