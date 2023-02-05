const { Register, Exam } = require("../models");
const IdValidate = require("../validations/id.validate");
const YTB = require("../modules/ytb");
const { registerSuccess } = require("../services/mail.service");


module.exports = {
    homePage: (req, res, next) => {
        res.locals.seo.title = "Trang Chủ";
        res.locals.seo.keywords = ["Home", "Home MOS", "Home MOS Khanh Ly", "Home MOS Khánh Lý", "Trang Chủ", "Trang Chủ MOS Khánh Lý", "Trang Chủ MOS Khanh Ly", "Thi MOS", "Đăng ký thi MOS", "IIG MOS", "MOS", "Microsoft Office Specialist", "Tin Học Văn Phòng", "2016"];
        res.render('index');
    },
    registrationPage: (req, res, next) => {
        res.locals.seo.title = "Đăng Ký Thi MOS";
        res.locals.seo.description = "Word 2016 Specialist, Excel 2016 Specialist, PowerPoint 2016 Specialist"
        res.locals.seo.keywords = ["Registration MOS Exam", "Registration MOS", "Registration MOS Khanh Ly", "Registration MOS Khánh Lý", "Đăng ký thi", "Đăng ký thi MOS Khánh Lý", "Đăng ký thi MOS Khanh Ly", "Đăng ký thi MOS", "IIG MOS", "MOS", "Registration Microsoft Office Specialist", "Tin Học Văn Phòng", "2016"];
        res.render('registration');
    },
    registrationHandle: async (req, res, next) => {
        try {
            const { registrations, ...body } = res.locals.body;

            for (const key of Object.keys(registrations)) {
                await Exam.register(registrations[key], key);
            }

            const data = await Register.create({ ...body, ...registrations });
            registerSuccess(data.email, { name: data.name });

            res.redirect(`/registration/${ data._id }`);
        } catch (e) {
            res.locals.seo.title = "Đăng Ký Thi MOS";
            res.locals.seo.description = "Word 2016 Specialist, Excel 2016 Specialist, PowerPoint 2016 Specialist"
            res.locals.seo.keywords = ["Registration MOS Exam", "Registration MOS", "Registration MOS Khanh Ly", "Registration MOS Khánh Lý", "Đăng ký thi", "Đăng ký thi MOS Khánh Lý", "Đăng ký thi MOS Khanh Ly", "Đăng ký thi MOS", "IIG MOS", "MOS", "Registration Microsoft Office Specialist", "Tin Học Văn Phòng", "2016"];
            res.locals.errors = [e.message];
            res.render("registration");
        }
    },
    registrationPageSuccess: async (req, res, next) => {
        const { id } = req.params;

        if (!id || IdValidate(id)) return next(new Error("Id Không đúng"));

        const data = await Register.findOne({ _id: id }).populate(["Word", "Excel", "PowerPoint"]);

        if (!data) return next(new Error("Không tồn tại...!"));

        data.idCardNumber = data.idCardNumber.slice(-4).padStart(data.idCardNumber.length, '*');
        data.phone = data.phone.slice(-4).padStart(data.phone.length, '*');

        res.locals.data = data;

        res.locals.seo.title = "Thí sinh " + data.fullname;
        res.locals.seo.description = "Thông tin đăng ký thi MOS, trạng thái đăng ký";

        res.render("registration_success");
    },
    downloadPage: (req, res, next) => {
        res.locals.seo.title = "Tải Xuống";
        res.locals.seo.description = "Các Project của Word 2016 Specialist, Excel 2016 Specialist, PowerPoint 2016 Specialist"
        res.locals.seo.keywords = ["Download MOS Exam", "Download MOS", "Download MOS Khanh Ly", "Download MOS Khánh Lý", "Tải Project", "Tải xuống Project MOS Khánh Lý", "Tải xuống MOS Khanh Ly", "Tải xuống Project MOS", "IIG MOS Project", "MOS", "Project Microsoft Office Specialist", "Project Tin Học Văn Phòng", "Project 2016"];

        res.render("download");

    },
    lessonsPage: async (req, res, next) => {
        res.locals.seo.title = "Các Bài Học";
        res.locals.seo.description = "Các bài học của Word 2016 Specialist, Excel 2016 Specialist, PowerPoint 2016 Specialist. Từ https://www.youtube.com/@MRLYKHANHMOSCertification/"
        res.locals.seo.keywords = ["Download MOS Exam", "Download MOS", "Download MOS Khanh Ly", "Download MOS Khánh Lý", "Tải Project", "Tải xuống Project MOS Khánh Lý", "Tải xuống MOS Khanh Ly", "Tải xuống Project MOS", "IIG MOS Project", "MOS", "Project Microsoft Office Specialist", "Project Tin Học Văn Phòng", "Project 2016"];
        try {
            const ytb = new YTB();
            const playlist = await ytb.getPlayList();

            res.locals.playlist = playlist;

            res.render("lessons")
        } catch (e) {
            next(e)
        }
    }
}