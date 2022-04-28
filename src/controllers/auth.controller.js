const { bwt } = require('../modules/jwt.module')
const { student } = require('../services/sql.service')
const yup = require('yup')
const { bhash } = require('../modules/hash.module')
const { registerValidator } = require('../modules/yupRegister.module')
const fs = require('fs')

const SQLMap = 'st_id, st_no, st_prefix, st_name, st_lastname, st_sex, st_birthdate, class_id, st_room, st_address, province_id, amphur_id, district_id, st_post, st_mail, st_mobile, father_name, father_lastname, father_card, father_edu, father_career, father_salary, father_work, father_mobile, mother_name, mother_lastname, mother_card, mother_edu, mother_career, mother_salary, mother_work, mother_mobile, parent_name, parent_lastname, parent_card, parent_edu, parent_career, parent_salary, parent_work, parent_mobile, st_password, st_graduation, st_graduation_year, st_graduation_date, st_register, st_update, st_card, st_nation, st_origin, st_religion, st_blood, st_pic, st_enname, st_enlastname, home_id, st_address_now, province_id_now, amphur_id_now, district_id_now, st_post_now, travel_id, travel_time, travel_length, health_id, st_weight, st_high, school_name, school_province, school_amphur, family_id, older_brather, young_brather, older_sister, young_sister, my_self, st_money, father_blood, mother_blood, parent_blood, parent_relation, st_latitude, st_longitude, birth_province'.replace(/\s/g, "").split(',')

const loginValidator = yup.object().shape({
    user: yup.number().required().min(10000).max(9999999),
    password: yup.string().required()
})

const login = async (req, res) => {
    const auth = req.get('Authorization')
    let p
    if (auth && auth.includes('Bearer ') && (p = auth.indexOf('Bearer ')) === 0) {
        const b = bwt.decode(auth.slice(p + 7))
        if (b && b.data.user) {
            const [data] = (await student.query(`SELECT * FROM student WHERE st_id = ?`, Number(b.data.user)))[0];
            if (data) {
                return res.json({
                    code: 200, data: {
                        user: {
                            id: data.st_id
                        }
                    }
                })
            }
        }
    }
    const { user, password } = req.body
    if (user, password) {
        if (await loginValidator.isValid({ user, password })) {
            const [data] = (await student.query(`SELECT * FROM student WHERE st_id = ?`, user))[0];
            if (data && bhash.validate(password, data.st_password)) {
                const token = bwt.encode({ user: data.st_id, name: data.st_name, lastname: data.st_lastname })
                return res.status(200).json({
                    code: 200,
                    data: {
                        user: {
                            id: data.st_id
                        },
                        token: token
                    }
                });
            } else {
                return res.status(401).json({
                    code: 401,
                    message: 'Unauthorized Username or Password is incorrect'
                })
            }
        }
    }
    return res.status(400).json({
        code: 400,
        message: 'Bad Request'
    })
}

const register = async (req, res) => {
    try {
        if (await registerValidator.isValid(req.body)) {
            req.body.st_password = bhash.hash(req.body.st_card)
            fs.writeFileSync(`./static/user/profile/${req.body.st_id}.jpeg`,req.body.st_pic.replace(/^data:([A-Za-z-+/]+);base64,/, ''),'base64')
            req.body.st_pic = req.body.st_id
            await student.query(
                `INSERT INTO student
                (st_id, st_no, st_prefix, st_name, st_lastname, st_sex, st_birthdate, class_id, st_room, st_address, province_id, amphur_id, district_id, st_post, st_mail, st_mobile, father_name, father_lastname, father_card, father_edu, father_career, father_salary, father_work, father_mobile, mother_name, mother_lastname, mother_card, mother_edu, mother_career, mother_salary, mother_work, mother_mobile, parent_name, parent_lastname, parent_card, parent_edu, parent_career, parent_salary, parent_work, parent_mobile, st_password, st_graduation, st_graduation_year, st_graduation_date, st_register, st_update, st_card, st_nation, st_origin, st_religion, st_blood, st_pic, st_enname, st_enlastname, home_id, st_address_now, province_id_now, amphur_id_now, district_id_now, st_post_now, travel_id, travel_time, travel_length, health_id, st_weight, st_high, school_name, school_province, school_amphur, family_id, older_brather, young_brather, older_sister, young_sister, my_self, st_money, father_blood, mother_blood, parent_blood, parent_relation, st_latitude, st_longitude, birth_province)
                VALUES(?, ?, ?, ?, ?, ?, STR_TO_DATE(lower(?), '%Y-%m-%d'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `, SQLMap.map(a => req.body[a] || 0)
            )
            return res.status(200).json({
                code: 200,
                message: 'Success'
            })
        }
    } catch (error) {
        console.log(error)
    }
    return res.status(400).json({
        code: 400,
        message: 'Bad Request'
    })
}

module.exports = {
    login,
    register
}