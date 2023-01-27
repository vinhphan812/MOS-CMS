const ROLE = {
    ADMIN: "ADMIN",
    REGISTER: "REGISTER"
};

const PERMISSIONS = { ADMIN: 3 };

const MENU_BY_ROLE = {
    ADMIN: [
        { name: "Tổng Quan", link: "/admin" },
    ],
    REGISTER: [
        { name: "Đăng kí thi", link: "/registration" },
        { name: "Các bài học", link: "/lessons" },
        { name: "Tải về", link: "/download" }
    ]

};

module.exports = { ROLE, PERMISSIONS, MENU_BY_ROLE };
