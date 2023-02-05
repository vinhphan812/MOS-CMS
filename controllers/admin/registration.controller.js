const { Register } = require("../../models");
const { exportExcel } = require("../../services/xlsx.service");
module.exports = {
    index: async (req, res, next) => {
        res.locals.data = await Register.find({});

        res.render("admin/registrations")
    },
    downloadExcel: async (req, res, next) => {
        const { dataType, type, filter } = req.query;
        console.log(req.query)
        try {
            const { data } = await Register.getList(dataType, 1, 9999999, filter);

            console.log(data);


            const outPath = await exportExcel(data, type);

            res.download(outPath, outPath.split("/")[2]);
        } catch (e) {
            next(e);
        }
    }
}