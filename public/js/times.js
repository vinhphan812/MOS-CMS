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

function rowUI(data, index) {
    return `
        <tr id="${ data._id }">
            <td>${ index }</td>
            <td>${ data.time }</td>
            <td class="cell-vetical-center">
                <div>
                    <div class="dot rounded-circle mx-2 ${ data.is_delete ? "bg-danger" : "bg-success" }"></div>
                    <span>${ data.is_delete ? "Ngưng hoạt động" : "Hoạt động" }</span>
                </div>
            </td>
            <td>
                <button class="btn btn-link edit bi bi-pencil-fill text-warning"></button>
                <button class="btn btn-link delete bi bi-trash text-danger"></button>
            </td>
        </tr>
    `
}

class TimesUI extends UIBase {
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
        const id = e.target.parentNode.parentNode.id;
        const value = $(
            "td:nth-child(2)",
            e.target.parentNode.parentNode
        ).text();

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

    static remove(e) {
        const id = e.target.parentNode.parentNode.id;
        confirmDelete("Giờ", () => TimesService.remove(id));
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
            const $table = $(".table tbody");

            if (!$table) return console.log(".table not contain");

            $table.children().remove();

            const { data } = await TimesModel.list();

            if (data.length < 0) return;

            for (const item of data) {
                $table.append(rowUI(item, $table.children().length + 1));
            }


            this.addAction();
        } catch (e) {
            console.log(e);
        }
    }

    static addAction() {
        $(".delete").click(TimesUI.remove);
        $(".edit").click(TimesUI.update);
    }

    static addEvent() {
        $("#create-btn").click(TimesUI.create);
    }
}

class TimesService extends Base {
    static async create() {
        try {
            const time = $(".timepicker").val();

            const res = await TimesModel.createTime(time);

            Alert("Success", res.message, "OK", "success");

            const table = $(".table > tbody");

            $("tr:not([id])", table).remove();

            table.append(`
            <tr id="${ res.data._id }">
                <td>${ table.children().length + 1 }</td>
                <td>${ res.data.time }</td>
                <td>${ res.data.is_delete ? "Ngưng hoạt động" : "Hoạt động" }</td>
                <td>
                    <button class="btn btn-link edit bi bi-pencil-fill text-warning"></button>
                    <button class="btn btn-link delete bi bi-trash text-danger"></button>
                </td>
            </tr>
        `);
            UI.addAction();
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

    static update(id, time) {
        return this.fetchAPI(this.task.updateTime, { time, id });
    }

    static remove(id) {
        return this.fetchAPI(this.task.removeTime, { id })
    }

    static list() {
        return this.fetchAPI(this.task.listTime)
    }
}
