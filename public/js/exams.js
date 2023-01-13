// Onload is a start programs
Onload = () => {
    UI = ExamsUI.init();
};

function htmlForm(id = "create") {
    return `<form id="${ id }">
            <div class="form-floating mb-3">
                <input list="iig" class="form-control" id="date" placeholder="DD/MM/YYYY">
                <label for="date">Ngày thi</label>
                <span class="status"></span>
                <datalist id="iig"></datalist>
            </div>
            <div class="mb-3 form-floating">
                <select id="begin_time" class="form-select" aria-label="Begin Time">
                    <option selected>Không có</option>
                </select>
                <label for="begin_time">Giờ thi</label>
                <span class="status"></span>
            </div>
            <div class="mb-3 form-floating">
                <input class="quantity form-control" id="quantity" placeholder="number"/>
                <span class="status"></span>
                <label for="quantity">Số lượng</label>
            </div>
        </form>`;
}

class ExamsUI extends UIBase {
    static async create() {
        const is_enabled = {
            date: false,
            time: false,
            quantity: false,
            check: function () {
                Swal.getConfirmButton().disabled = !(
                    this.date &&
                    this.time &&
                    this.quantity
                );
                if (this.date && this.time) {
                    ExamsService.validate();
                }
            },
        };
        try {
            const addCreateEvent = () => {
                is_enabled.check();

                $("#begin_time").change((e) => {
                    const $input = $(e.target);
                    const time = $input.val();
                    $input
                        .removeClass("is-invalid")
                        .removeClass("is-valid");

                    is_enabled.time = !!time && time != "Không có";
                    is_enabled.check();
                    $input.addClass(
                        is_enabled.time ? "is-valid" : "is-invalid"
                    );
                });

                $("#quantity").change((e) => {
                    const $input = $(e.target);
                    const quantity = +$input.val();
                    $input
                        .removeClass("is-invalid")
                        .removeClass("is-valid");

                    is_enabled.quantity =
                        !!quantity && /\d/g.test(quantity);
                    is_enabled.check();
                    $input.addClass(
                        is_enabled.quantity ? "is-valid" : "is-invalid"
                    );
                });

                $("#date").change((e) => {
                    const $input = $(e.target);
                    const date = $input.val();
                    $input
                        .removeClass("is-invalid")
                        .removeClass("is-valid");

                    is_enabled.date =
                        new Date(date) &&
                        /(\d{2}|\d{1})\/(\d{2}|\d{1})\/\d{4}/g.test(date);

                    is_enabled.check();

                    $input.addClass(
                        is_enabled.date ? "is-valid" : "is-invalid"
                    );
                });
            };
            ExamsModel.IIGRecommend().then(({ data }) => {
                const $datalist = $("datalist#iig");

                for (const item of data) {
                    $datalist.append(`<option value="${ item }"/>`);
                }
            });

            ExamsModel.listTime().then(({ data }) => {
                const $select = $("select#begin_time");

                for (const item of data) {
                    $select.append(
                        `<option value="${ item._id }">${ item.time }</option>`
                    );
                }
            });

            Swal.fire({
                ...swalDefaultConfig,
                title: "Ngày thi",
                html: htmlForm(),
                showCancelButton: true,
                confirmButtonText: "Tạo",
                showLoaderOnConfirm: true,
                reverseButtons: false,
                cancelButtonText: "Hủy",
                preConfirm: ExamsService.create,
                allowOutSideClick: () => !Swal.isLoading(),
                didRender: addCreateEvent,
            });
        } catch (e) {
            console.log(e);
        }
    }

    static addAction() {
    }

    static addEvent() {
        $("#create-btn").click(this.create);
    }
}

class ExamsService extends Base {
    static async create() {
        try {
            const date = $("#date").val(),
                time = $("#begin_time").val(),
                quantity = $("#quantity").val();

            const res = await ExamsModel.create(date, time, quantity);

            Alert("Success", res.message, "OK", "success");
        } catch (e) {
            return Alert("Error", e.message, "OK", "error");
        }
    }

    static async validate() {
        try {
            Swal.resetValidationMessage();
            const date = $("#date").val(),
                time = $("#begin_time").val();
            await ExamsModel.validate(date, time);
        } catch (e) {
            Swal.showValidationMessage(e.message);
        }
    }
}

class ExamsModel extends BaseModel {
    static create(date, time, quantity) {
        return this.fetchAPI(this.task.createExam, { date, quantity, time });
    }

    static IIGRecommend() {
        return this.fetchAPI(this.task.IIG);
    }

    static listTime() {
        return this.fetchAPI(this.task.listTime);
    }

    static validate(date, time) {
        return this.fetchAPI(this.task.checkExam, { date, time });
    }
}
