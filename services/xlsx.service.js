const Excel = require("exceljs");
const moment = require("moment");

const IN_DS_PATH = "./public/DS_MAU.xlsx";
const IN_VTP_PATH = "./public/VTP_MAU.xlsx";

const SHEET_DS_NAME = "Danh Sach";
const SHEET_VTP_NAME = "Danh Sách";

const START_DS_INDEX = 4;
const START_VTP_INDEX = 2;

const alias = { Word: "W", Excel: "E", PowerPoint: "P" };

function addData(ws, data, cRow, type = "IIG") {
    const dataAccess = ["Word", "Excel", "PowerPoint"];

    for (const access of dataAccess) {
        if (data[access]) {
            cRow = cRow = addRow(ws, data, access, cRow, type);
        }
    }

    return cRow;
}

function addRow(ws, data, examField, cRow, type = "IIG") {
    if (type == "IIG") {
        const birthday = moment(data.birthday);
        ws.getCell(cRow, 1).value = cRow - START_DS_INDEX + 1;
        ws.getCell(cRow, 2).value = data.gender == "male" ? "Nam" : "Nữ";
        ws.getCell(cRow, 3).value = data.fullname;
        ws.getCell(cRow, 4).value = birthday.format("DD");
        ws.getCell(cRow, 5).value = birthday.format("MM");
        ws.getCell(cRow, 6).value = birthday.format("YYYY");
        ws.getCell(cRow, 7).value = data.idCardNumber;
        ws.getCell(cRow, 8).value = data.email;
        ws.getCell(cRow, 9).value = data.phone;
        ws.getCell(cRow, 11).value = alias[examField];
        ws.getCell(cRow, 14).value = 1;
        ws.getCell(cRow, 15).value = "2016";
        ws.getCell(cRow, 16).value = "TA";
        ws.getCell(cRow, 18).value = data[examField].time;
        ws.getCell(cRow, 19).value = moment(data[examField].date).format(
            "DD/MM/YYYY"
        );

        for (let i = 1; i < 20; i++) {
            ws.getCell(cRow, i).border = {
                top: { style: "thin", color: { argb: "000" } },
                left: { style: "thin", color: { argb: "000" } },
                bottom: { style: "thin", color: { argb: "000" } },
                right: { style: "thin", color: { argb: "000" } },
            };
        }
    } else if (type == "VTP") {
        ws.getCell(cRow, 1).value = cRow - START_VTP_INDEX + 1;
        ws.getCell(cRow, 2).value = data._id;
        ws.getCell(cRow, 3).value = data.fullname;
        ws.getCell(cRow, 4).value = data.phone;
        ws.getCell(cRow, 5).value = data.address;
        ws.getCell(cRow, 6).value = "Bằng MOS " + examField;
        ws.getCell(cRow, 7).value = 1;
        ws.getCell(cRow, 8).value = 50;
        ws.getCell(cRow, 11).value = "VCN";
        ws.getCell(cRow, 17).value = "Người nhận trả";
        ws.getCell(cRow, 18).value = "Giờ Hành Chinh";
    }

    return ++cRow;
}

module.exports = {
    exportExcel: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const wb = new Excel.Workbook();

                await wb.xlsx.readFile(IN_DS_PATH);

                const ws = wb.getWorksheet(SHEET_DS_NAME);
                let tempRow = START_DS_INDEX;

                if (!ws) throw new Error("Not Found WorkSheet");

                for (const item of data) {
                    tempRow = addData(ws, item, tempRow);
                }

                const outPath = `./exports/Report_${ moment().format(
                    "DD-MM-YYYY"
                ) }.xlsx`;

                await wb.xlsx.writeFile(outPath);

                resolve(outPath);
            } catch (e) {
                reject(e);
            }
        });
    },
    exportVTP: async (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const wb = new Excel.Workbook();
                await wb.xlsx.readFile(IN_VTP_PATH);

                const ws = wb.getWorksheet(SHEET_VTP_NAME);

                let tempRow = START_VTP_INDEX;

                if (!ws) throw new Error("Not Found WorkSheet");

                for (const item of data) {
                    tempRow = addData(ws, item, tempRow, "VTP");
                }

                const outPath = `./exports/Report_VTP_${ moment().format(
                    "DD-MM-YYYY"
                ) }.xlsx`;

                await wb.xlsx.writeFile(outPath);

                resolve(outPath);
            } catch (e) {
                reject(e);
            }
        });
    },
};
