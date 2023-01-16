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
                <select id="time" class="form-select" aria-label="Begin Time">
                    <option selected>Không có</option>
                </select>
                <label for="time">Giờ thi</label>
                <span class="status"></span>
            </div>
            <div class="mb-3 form-floating">
                <input class="form-control" id="slot" placeholder="number"/>
                <span class="status"></span>
                <label for="slot">Số lượng</label>
            </div>
        </form>`;
}

class ExamsUI extends UIBase {
    static async create() {
        const is_enabled = {
            date: false, time: false, slot: false, check: function (type) {
                Swal.getConfirmButton().disabled = !(this.date && this.time && this.slot);
                if (this.date && this.time && type != "slot") {
                    ExamsService.validate().then((ex) => {
                        if (ex.success) return;

                        if (typeof ex == "object" && !ex.success && ex.data && ex.data.ex && ex.data.ex.length > 0) {
                            for (const el of ex.data.ex) {
                                this[el] = false;
                                $IV("#" + el).setValid(false);
                            }
                            this.check();
                        }
                    })
                }
            },
        };
        try {
            const addCreateEvent = () => {
                is_enabled.check();

                $("#time").change((e) => {
                    const $input = $IV(e.target);
                    const time = $input.val();

                    $input.clearValidate();

                    is_enabled.time = !!time && time != "Không có";
                    is_enabled.check();
                    $input.setValid(is_enabled.time);
                });

                $("#slot").change((e) => {
                    const $input = $IV(e.target);
                    const slot = +$input.val();
                    $input.clearValidate();

                    is_enabled.slot = !!slot && /^\d/g.test(slot);

                    is_enabled.check("slot");

                    $input.setValid(is_enabled.slot);
                });

                $("#date").change((e) => {
                    const $input = $IV(e.target);
                    const date = $input.val();
                    $input.clearValidate();

                    is_enabled.date = new Date(date) && /(\d{2}|\d{1})\/(\d{2}|\d{1})\/\d{4}/g.test(date);

                    is_enabled.check();

                    $input.setValid(is_enabled.date);
                });
            };
            ExamsModel.IIGRecommend().then(({ data }) => {
                const $datalist = $("datalist#iig");

                for (const item of data) {
                    $datalist.append(`<option value="${ item }"/>`);
                }
            });

            ExamsModel.listTime().then(({ data }) => {
                const $select = $("select#time");

                for (const item of data) {
                    $select.append(`<option value="${ item._id }">${ item.time }</option>`);
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
            const date = $("#date").val(), time = $("#time").val(), slot = $("#slot").val();

            const res = await ExamsModel.create(date, time, slot);

            Alert("Success", res.message, "OK", "success");
        } catch (e) {
            return Alert("Error", e.message, "OK", "error");
        }
    }

    static async validate() {
        try {
            Swal.resetValidationMessage();
            const date = $("#date").val(), time = $("#time").val();
            const data = await ExamsModel.validate(date, time);
            return data;
        } catch (e) {
            Swal.showValidationMessage(e.message);
            return e;
        }
    }
}

class ExamsModel extends BaseModel {
    static create(date, time, slot) {
        return this.fetchAPI(this.task.createExam, { date, slot, time });
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
