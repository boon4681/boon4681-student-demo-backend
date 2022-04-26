const { bwt } = require('../modules/jwt.module')
const { student } = require('../services/sql.service')
const yup = require('yup')
const { bhash } = require('../modules/hash.module')

const loginValidator = yup.object().shape({
    user: yup.number().required().min(10000).max(99999),
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
                console.log(bwt.decode(token))
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

}

module.exports = {
    login
}