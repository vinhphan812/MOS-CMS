let Onload;
const inputManager = [];

const swalDefaultConfig = {
    heightAuto: false,
}

const TABULATOR_CONFIG = {
    paginationSize: 20,
}

/**
 * JQuery Input Add setValid, clearValidate handle
 * @param querySelect query string, is a query selector in JQuery
 * @returns {*|jQuery|HTMLElement} JQuery with setValid, ClearValidate Function
 */
const $IV =
    (querySelect) => {
        const $el = $(querySelect);
        $el.__proto__.clearValidate = function () {
            const parent = $(this).parent();
            parent.removeClass("was-validated")
            $(this)
                .removeClass("is-invalid")
                .removeClass("is-valid");
        }

        $el.__proto__.setValid = function (status) {
            $el.clearValidate();
            this.addClass(status ? "is-valid" : "is-invalid");
        }

        $el.__proto__.feedback = function (message) {
            const parent = $(this).parent();
            const feedback = $(".invalid-feedback", parent);

            if (feedback.length) {
                feedback.text(message);
            } else {
                parent.append(`<div class="invalid-feedback">${ message }.</div>`)
            }
        }

        return $el;
    }

/**
 * Invalid check callback
 *
 * @callback validateCallback
 * @param {String} value value of input HTML
 * @returns {boolean} if invalid return true and vice versa
 */

/**
 * Trigger listen event when change and status of INPUT
 *
 * @callback onStatusCallback
 * @param {boolean} status
 * @param {String | Object} querySelector
 * @param {Object} $el
 * @returns {void}
 */

/**
 * Trigger listen event when load done INPUT
 *
 * @callback onDoneCallback
 * @param {JqueryObject} $el
 * @returns {void}
 */

/**
 * Input validte using $IV function. if you want to run validation trigger, you can use blur
 * @param {string} querySelector is a query string or Jquery Object. Recommended to use query string instead of Jquery Object
 * @param {validateCallback} invalidCheck invalid check callback
 * @param {string} invalidFeedback is a feedback for input for invalid value
 * @param {undefined|onStatusCallback} onStatus
 * @param {undefined|onDoneCallback} onDone
 */
function inputValidate(querySelector, invalidCheck, invalidFeedback, onStatus, onDone) {
    const $el = $IV(querySelector);
    if (!invalidCheck || !$el) return;

    const validate = function ({ target }) {
        const $target = $(target);
        const value = $target.val();

        if (invalidCheck(value)) {
            $target.setValid(false);
            $target.feedback(invalidFeedback || "invalid");
            // trigger event status TRUE|FALSE for /js/registration.js
            if (onStatus)
                onStatus(false, querySelector, $el);
            $el.valid = false;
        } else {
            // trigger event status TRUE|FALSE for /js/registration.js
            $target.setValid(true);
            if (onStatus)
                onStatus(true, querySelector, $el);
            $el.valid = true;
        }
    };

    $el.__proto__.validate = validate;

    $el.valid = false;

    // trigger event onLoad return initialization element
    if (onDone)
        onDone($el);

    $el.blur(validate);

    $el.focus($el.clearValidate);
}

function Alert(title, text, confirmButtonText = "OK", icon = "error") {
    return Swal.fire({
        heightAuto: false,
        title,
        text,
        icon,
        confirmButtonText,
        timer: 2000,
        timerProgressBar: true,
    });
}

function confirmDelete(name = "thành phân", cb) {
    Swal.fire({
        customClass: {
            confirmButton: "btn btn-success mx-2",
            cancelButton: "btn btn-danger mx-2",
        },
        buttonsStyling: false,
        title: "Xóa " + name,
        text: `Bạn chắc chắn muốn xóa?`,
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Quay lại",
        showLoaderOnConfirm: true,
        preConfirm: cb,
        reverseButtons: true,
    });
}

window.onload = () => {
    const table = $(".table");
    if (!table.hasClass("inactive"))
        table.DataTable({
            responsive: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/vi.json",
            },
            lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, "All"],
            ],
        });

    // if you have task need active with onload, you can declare Onload Function
    if (Onload) {
        Onload();
    }

    // active tooltip for bootstrap 5.1
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};
