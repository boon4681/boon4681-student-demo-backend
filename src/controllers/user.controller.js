const { student } = require('../services/sql.service')

const user = async (req,res) =>{
    if(req.jwt){
        const { user } = req.jwt.data
        const [data] = (await student.query(`SELECT * FROM student WHERE st_id = ?`,Number(user)))[0]

        delete data.st_password
        delete data.st_no
        delete data.st_graduation
        delete data.st_graduation_year
        delete data.st_graduation_date
        delete data.st_register
        delete data.st_update
        
        return res.json({code:200,data})
    }
    return res.status(401).json({
        code:401,
        message:'Unauthorized'
    })
}

module.exports = { user }