const ROLE = {
    ADMIN: "ADMIN",
    REGISTER: "REGISTER"
};

const PERMISSIONS = { ADMIN: 3};

const MENU_BY_ROLE = {
    ADMIN: [
        { name: "Tổng Quan", link: "/admin" },
        { name: "Đăng Ký Thi", link: "/registration" },
        { name: "Bài Học", link: "/lessons"}
    ],
    REGISTER: [
        { name: "Đăng kí thi", link: "/register" },
        { name: "Các bài học", link: "/lessons"}
    ]

};

module.exports = { ROLE, PERMISSIONS, MENU_BY_ROLE };
