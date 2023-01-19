// Onload is a start programs
Onload = () => {
    UI = TimesUI.init();
};

function htmlForm(id = "create") {
    return `<form id="${ id }">
            <div class="mb-3">
                <label for="begin_time">Giờ thi</label>
                <input class="timepicker" id="begin_time"/>
                <span class="status"></span>
            </div>
        </form>`;
}

class TimesUI extends UIBase {
    static table = null;
    static dataURL = "/api/admin/times";

    static create(e) {
        const addCreateEvent = () => {
            const timepicker = $(".timepicker");

            timepicker.timepicker({
                timeFormat: "HH:mm",
                interval: 30,
                minTime: "6",
                maxTime: "18:00pm",
                startTime: "6:00am",
                dynamic: true,
                dropdown: true,
                scrollbar: false,
                zindex: 1061,
                change: TimesUI.validateTimeEvent,
            });
        }

        Swal.fire({
            ...swalDefaultConfig,
            title: "Giờ thi",
            html: htmlForm(),
            showCancelButton: true,
            confirmButtonText: "Tạo",
            showLoaderOnConfirm: true,
            reverseButtons: false,
            cancelButtonText: "Hủy",
            preConfirm: TimesService.create,
            allowOutSideClick: () => !Swal.isLoading(),
            didRender: addCreateEvent,
        });
    }

    static update(e) {
        const addUpdateHandle = (value) => {
            const $timepicker = $(".timepicker");
            $timepicker.timepicker({
                timeFormat: "HH:mm",
                interval: 30,
                minTime: "6",
                maxTime: "18:00pm",
                startTime: "6:00am",
                dynamic: true,
                dropdown: true,
                scrollbar: false,
                zindex: 1061,
                change: TimesUI.validateTimeEvent,
            });

            const timeData = $timepicker.data("TimePicker");

            timeData.widget.setTime(
                timeData,
                moment("01/01/2023 " + value).toDate(),
                true
            );
        }
        const id = arguments[1] || e.target.parentNode.parentNode.id;
        const value = $(
            "td:nth-child(2)",
            e.target.parentNode.parentNode
        ).text() || arguments[2];

        Swal.fire({
            ...swalDefaultConfig,
            title: "Chỉnh Sửa",
            html: htmlForm(id),
            showCancelButton: true,
            confirmButtonText: "Cập nhật",
            showLoaderOnConfirm: true,
            reverseButtons: false,
            cancelButtonText: "Hủy",
            preConfirm: TimesService.update,
            allowOutSideClick: () => !Swal.isLoading(),
            didRender: (e) => addUpdateHandle(value),
        });


    }

    static async validateTimeEvent(e) {
        const $status = $(".status");
        const confirmBtn = Swal.getConfirmButton();

        confirmBtn.disabled = true;
        $status.html(
            `<div class="spinner-border spinner-border-sm text-dark" role="status"></div>`
        );
        Swal.resetValidationMessage();

        const time = moment(e).format("HH:mm");

        try {
            const res = await TimesModel.validateTime(time);

            $status.html(`<i class="bi bi-check-lg text-success"></i>`);
            confirmBtn.disabled = false;
        } catch (e) {
            $status.html(`<i class="bi bi-x-lg text-danger"></i>`);
            Swal.showValidationMessage(e.message);
        }
    }

    static async loadList() {
        try {
            if (this.table)
                this.table.setData(this.dataURL);
        } catch (e) {
            console.log(e);
        }
    }

    static addEvent() {
        $("#create-btn").click(TimesUI.create);

        this.table = new Tabulator("#times-table", {
            data: [],
            layout: "fitColumns",
            minHeight: "200px",
            index: "ID",
            columns: [
                { title: "ID", field: "_id", visible: false },
                {
                    title: "Giờ thi", field: "time", editor: dateEditor
                },
                {
                    title: "Trạng thái",
                    field: "is_delete",
                    editor: "list",
                    formatter: function (cell, formatterParams) {
                        let value = cell.getValue();
                        if (value == "") {
                            value = cell.getOldValue();
                            cell.restoreOldValue();
                        }

                        if (typeof value == "string")
                            value = JSON.parse(value);
                        return `<div class="d-flex align-items-center h-100"><div class="dot rounded-circle mx-2 ${ value ? "bg-danger" : "bg-success" }"></div><span>${ value ? "Ngưng Hoạt động" : "hoạt động" }</span></div>`;
                    },
                    editorParams: {
                        values: { true: "Ngưng hoạt động", false: "Hoạt động" }
                    },
                    cellEdited: function (cell) {
                        const data = cell.getData();
                        if(typeof data.is_delete == "string")
                            data.is_delete = JSON.parse(data.is_delete);
                        TimesModel.updateStatus(data._id, data.is_delete);
                    }
                }
            ],
            initialSort: [
                { column: "time", dir: "asc" },
                { column: "is_delete", dir: "asc" },
            ]
        });

        this.table.on("tableBuilt", () => {
            this.loadList();
        });
        // this.loadList();
    }
}

class TimesService extends Base {
    static async create() {
        try {
            const time = $(".timepicker").val();

            const res = await TimesModel.createTime(time);

            Alert("Success", res.message, "OK", "success");

            UI.loadList();
        } catch (err) {
            return Alert("Error", err.message, "OK", "error");
        }
    }

    static async update() {
        try {
            const time = $(".timepicker").val();
            const id = $(".swal2-html-container form").attr("id");


            const res = await TimesModel.update(id, time);


            Alert("Success", res.message, "OK", "success");
            await TimesUI.loadList();
        } catch (e) {
            return Alert("Error", e.message, "OK", "error");
        }
    }

    static async remove(id) {
        try {
            const res = await TimesModel.remove(id);
            Alert("Success", res.message, "OK", "success");
            await TimesUI.loadList();
        } catch (e) {
            return Alert("Error", e.message, "OK", "error");
        }
    }
}

class TimesModel extends BaseModel {
    static validateTime(time) {
        return this.fetchAPI(this.task.checkTime, { time });
    }

    static createTime(time) {
        return this.fetchAPI(this.task.createTime, { time });
    }

    static update(id, time, is_delete) {
        return this.fetchAPI(this.task.updateTime, { time, id });
    }

    static updateStatus(id, is_delete) {
        return this.fetchAPI(this.task.updateTimeStatus, { is_delete, id });
    }

    static remove(id) {
        return this.fetchAPI(this.task.removeTime, { id })
    }

    static list() {
        return this.fetchAPI(this.task.listTime)
    }
}

const dateEditor = function (cell, onRendered, success, cancel, editorParams) {
    const el = cell.getElement();
    const data = cell.getData();
    TimesUI.update({ target: el }, data._id, data.time);
};


