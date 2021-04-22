const {Router} = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const {check, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const config = require("config")

const router = Router()

router.post(
    "/register",
    [
        check("email", "Incorrect email").isEmail(),
        check("password", "Minimum length password 5 symbol")
            .isLength({min: 5}),
        check("name", "Minimum length 3 symbol")
            .isLength({min: 3})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data on register"
                })
            }

            const {email, password, name} = req.body

            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({message: "This user already exist"})
            }


            //Using bcryptJS
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({email, password: hashedPassword, name})

            await user.save()

            res.status(201).json({message: "User created"})


        } catch (e) {
            return res.status(500).json({message: "Something wrong on registration"})
        }
})

router.post(
    "/login",
    [
        check("email", "Enter correct email").normalizeEmail().isEmail(),
        check("password", "Enter password").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data"
                })
            }

            const {email, password} = req.body
            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: "User not found"})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: "Incorrect password"})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get("jwtSecret"),
                {expiresIn: "10h"}
            )

            res.status(200).json({token, userId: user.id})

        } catch (e) {
            return res.status(500).json({message: "Something wrong on login"})
        }
})

module.exports = router