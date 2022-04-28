const useProfile = async (req, res, next) => {
    if (req.path === `/${req.jwt.data.user}.jpeg`) {
        return next()
    }
    return res.status(403).json({
        code: 403,
        message: 'Forbidden'
    })
}


module.exports = { useProfile }