function birthdayValidate(value) {
	if (!value) return true;

	const date = new Date(value);

	if (!date) return true;

	return (
		new Date().getFullYear() - date.getFullYear() < 18 ||
		date.getFullYear() <= 1950
	);
}

module.exports = {
	registrationValidate: async (req, res, next) => {
		try {
			const {
				fullname,
				idCardNumber,
				birthday,
				phone,
				gender,
				email,
				registrations,
				address,
				streetNumber,
				city,
				district,
				ward,
			} = req.body;

			const errors = [];

			if (!address || address.length < 6) {
				errors.push("Địa chỉ không hợp lệ");
			}

			if (!fullname || fullname.length < 6) {
				errors.push("Họ và tên phải có ít nhất 6 ký tự.");
			}

			if (
				!idCardNumber ||
				idCardNumber.length != 12 ||
				idCardNumber.length != 9
			) {
				errors.push("Số CCCD/CMND có 9 hoặc 12 số.");
			}

			if (birthdayValidate(birthday)) {
				errors.push("Ngày sinh không đúng.\n");
			}

			if (!phone || !/^0[0-9]{9}$/g.test(phone)) {
				errors.push("Số điện thoại không đúng.");
			}

			if (!gender) {
				errors.push("Vui lòng nhập giới tính.");
			} else if (!["male", "female"].includes(gender)) {
				errors.push("Giới tính vừa nhập chưa đúng.");
			}

			if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
				errors.push("Email bạn nhập chư a đúng.");
			}

			if (!req.file) {
				errors.push("Bạn phải tải file minh chứng.");
			}

			const bankingImage = req.file
				? "/" + req.file.path.split("\\").join("/")
				: "";

			if (!registrations) errors.push("Bạn chưa chọn môn thi.");

			const parse = registrations ? JSON.parse(registrations) : {};

			if (typeof parse != "object") errors.push("Xảy ra lỗi.");

			// if (!parse.Word || !parse.Excel || !parse.PowerPoint) errors.push("Xảy ra lỗi thành phần bắt buộc");
			const registrationObj = {
				Word: null,
				Excel: null,
				PowerPoint: null,
			};
			for (const key of Object.keys(registrationObj)) {
				if (parse[key]) registrationObj[key] = parse[key];
			}

			res.locals.body = {
				fullname,
				idCardNumber,
				birthday,
				phone,
				gender,
				email,
				registrations: registrationObj,
				bankingImage,
				address,
				streetNumber,
				city,
				district,
				ward,
			};

			if (errors.length) {
				res.locals.errors = errors;
				return res.render("registration");
			}

			next();
		} catch (e) {
			console.log(e);
			res.locals.errors = [e.message];
			return res.render("registration");
		}
	},
};
