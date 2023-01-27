let UI;

class Base {
    static create() {
        console.warn("Not Support Create");
    }

    static remove() {
        console.warn("Not Support Remove");
    }

    static update() {
        console.warn("Not Support Update");
    }
}

class UIBase extends Base {
    static init() {
        this.addEvent();
        this.addAction();
        return this;
    }

    static addEvent() {
        console.warn("Not Support Event");
    }

    static addAction() {
        console.warn("Not Support Action");
    }

    static changeStatusInput($input, isValid) {
        $input.addClass(isValid ? "is-valid" : "is-invalid");
    }

    static clearValidateInput($input) {
        const validateClass = ["is-invalid", "is-valid"];

        $input
            .removeClass("is-invalid")
            .removeClass("is-valid");
    }
}

class BaseModel extends Base {
    static task = {
        checkTime: "check_time",
        createTime: "create_time",
        updateTime: "update_time",
        updateTimeStatus: "update_status_time",
        listTime: "list_time",
        IIG: "iig",
        createExam: "create_exam",
        checkExam: "check_exam",
        removeTime: "remove_time"

    };

    static fetchAPI(method, body) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await fetch("/api/admin/do", {
                    method: "POST", headers: {
                        "Content-Type": "application/json",
                    }, body: JSON.stringify({ method, ...body }),
                });

                const json = await data.json();

                if (!json.success) return reject(json);

                resolve(json);
            } catch (e) {
                reject(e);
            }
        });
    }
}
