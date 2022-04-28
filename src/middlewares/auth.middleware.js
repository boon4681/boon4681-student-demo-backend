const { bwt } = require('../modules/jwt.module')
const { student } = require('../services/sql.service')

const useAuth = async (req, res, next) => {
    if (!req.is('application/json'))
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        })
    const auth = req.get('Authorization')
    let p
    if (auth && auth.includes('Bearer ') && (p = auth.indexOf('Bearer ')) === 0) {
        const b = bwt.decode(auth.slice(p + 7))
        if (b && b.data.user) {
            const [data] = (await student.query(`SELECT * FROM student WHERE st_id = ${Number(b.data.user)}`))[0];
            if (data) {
                req.jwt = b
                return next()
            }
        }
    }
    return res.status(401).json({
        code: 401,
        message: 'Unauthorized'
    })
}

module.exports = { useAuth }