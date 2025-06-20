const { body } = require("express-validator");

const registerValidation = () => [
    body("password")
        .notEmpty().withMessage("Şifrə boş ola bilməz")
        .isLength({ min: 8 }).withMessage("Şifrə ən az 8 simvoldan ibarət olmalıdır")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
        .withMessage("Şifrə həm hərf, həm rəqəm içerməlidir"),

    body("username").notEmpty().withMessage("İstifadəçi adı boş ola bilməz"),

    body('email').notEmpty().withMessage("Email boş ola bilməz").isEmail().withMessage("Email formatı yanlışdır"),

    body("role").notEmpty().withMessage(""),
];

const loginValidation = () => [
    body("usernameORemail").notEmpty().withMessage("İstifadəçi adı və ya e-poçt boş ola bilməz").custom((v) => {
        if (v.includes("@")) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(v)) {
                throw new Error("E-poçt formatı yanlışdır");
            }
        }
        return true;
    }),

    body("password")
        .notEmpty().withMessage("Şifrə boş ola bilməz")
        .isLength({ min: 8 }).withMessage("Şifrə ən az 8 simvoldan ibarət olmalıdır")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
        .withMessage("Şifrə həm hərf, həm rəqəm içerməlidir"),
]

const checkPinValidation = () => [
    body("pin_code").notEmpty().withMessage("Pin kod boş ola bilməz").isLength({ max: 4 }).withMessage("Kod ən çox 4 simvoldan ibarət olmalıdır"),
    body("token").notEmpty().withMessage("Token boş ola bilməz")
]

const resendCodeValidation = () => [
    body("user_id").notEmpty().withMessage("")
]

const forgotPasswordValidation = () => [
    body("request_type")
        .notEmpty().withMessage("request_type tələb olunur")
        .isIn(["send_otp", "check_pin_code", "reset_password"])
        .withMessage("Yanlış request_type dəyəri"),

    body("email")
        .if(body("request_type").equals("send_otp"))
        .notEmpty().withMessage("E-poçt tələb olunur")
        .isEmail().withMessage("E-poçt formatı yanlışdır"),

    body("id")
        .if(body("request_type").equals("check_pin_code"))
        .notEmpty().withMessage("İstifadəçi ID-si tələb olunur"),
    body("pin_code")
        .if(body("request_type").equals("check_pin_code"))
        .notEmpty().withMessage("Doğrulama kodu tələb olunur")
        .isLength({ max: 4 }).withMessage("Kod 4 simvol olmalıdır"),

    body("id")
        .if(body("request_type").equals("reset_password"))
        .notEmpty().withMessage("İstifadəçi ID-si tələb olunur"),
    body("password")
        .if(body("request_type").equals("reset_password"))
        .notEmpty().withMessage("Yeni şifrə tələb olunur")
        .isLength({ min: 8 }).withMessage("Şifrə ən az 8 simvol olmalıdır")
        .matches(/[a-zA-Z]/).withMessage("Şifrə hərf içerməlidir")
        .matches(/[0-9]/).withMessage("Şifrə rəqəm içerməlidir")
        
];

module.exports = { registerValidation, loginValidation, checkPinValidation, resendCodeValidation, forgotPasswordValidation };
