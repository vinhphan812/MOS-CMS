const { exportExcel, exportVTP } = require("./services/xlsx.service");

const data = [
    {
        "_id": "63d4a32fd56e5f72df0247ea",
        "fullname": "Võ Nguyễn Thúy Anh",
        "idCardNumber": "094201000669",
        "birthday": "2001-10-24T00:00:00.000Z",
        "phone": "0335499633",
        "gender": "female",
        "email": "Vonguyenthuyanh0304@gmail.com",
        "Word": {
            "_id": "63d0b271dbd636902566abdf",
            "date": "2023-02-01T17:00:00.000Z",
            "time": "06:00"
        },
        "address": "112/D Nguyễn Thị Minh Khai, Khóm 4, TT.Mỹ An, H.Tháp Mười, Tỉnh Đồng Tháp",
        "bankingImage": "/public/uploads/banking/photo_2021-09-01_16-13-01.jpg",
        "is_approved": true,
        "is_delete": false,
        "created_at": "2023-01-28T04:23:11.714Z",
        "updated_at": "2023-01-31T21:45:16.707Z",
        "request": "NO_REQUEST",
        "reason": ""
    },
    {
        "_id": "63d4e58d0a560d51eaf6f283",
        "fullname": "phan thanh vinh",
        "idCardNumber": "094201000669",
        "birthday": "2005-10-24T00:00:00.000Z",
        "phone": "0335499633",
        "gender": "male",
        "email": "Vonguyenthuyanh0304@gmail.com",
        "Word": {
            "_id": "63d0b271dbd636902566abdf",
            "date": "2023-02-01T17:00:00.000Z",
            "time": "06:00"
        },
        "Excel": {
            "_id": "63d0ccc859b063290bb0b1b4",
            "date": "2023-02-01T17:00:00.000Z",
            "time": "10:00"
        },
        "PowerPoint": {
            "_id": "63d0ccdc59b063290bb0b1ce",
            "date": "2023-02-01T17:00:00.000Z",
            "time": "14:30"
        },
        "address": "112/D Nguyễn Thị Minh Khai, Khóm 4, TT.Mỹ An, H.Tháp Mười, Tỉnh Đồng Tháp",
        "bankingImage": "/public/uploads/banking/avatar.jpg",
        "is_approved": true,
        "is_delete": false,
        "created_at": "2023-01-28T09:06:21.666Z",
        "updated_at": "2023-01-31T21:45:32.632Z",
        "request": "NO_REQUEST"
    }
];

(async () => {
    await exportExcel(data);
})()