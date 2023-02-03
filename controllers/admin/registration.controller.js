const { Register } = require("../../models");
const { exportExcel } = require("../../services/xlsx.service");
module.exports = {
    index: async (req, res, next) => {
        res.locals.data = await Register.find({});

        res.render("admin/registrations")
    },
    downloadExcel: async (req, res, next) => {
        try {
            const { data } = await Register.getList("approved", 1, 9999999);

            console.log(data);


            const outPath = await exportExcel(data);

            res.download(outPath, outPath.split("/")[2]);
        } catch (e) {
            next(e);
        }
    }
}