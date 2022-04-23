const crypto = require('crypto');

const Tokenizer = function (day) {
    function string(len) {
        return crypto.randomBytes(len * 10).toString('base64').replace(/=/g, "").replace(/\+/g, "").replace(/\//g, "").slice(0, len);
    }
    const wow = (x, a, b, salt) => crypto.createHash('sha256').update(x).update(a + "." + b).update(salt)
    function reverse(x) {
        return [...x].reverse().join("")
    }
    this.getData = function (x) {
        if (!x) return
        x = x.split(".")
        x[0] = Buffer.from(x[0], "base64url").toString("utf-8")
        const _x = reverse(Buffer.from(reverse(x[0]), "base64url").toString("utf-8"))
        const k = _x.lastIndexOf(".")
        const expire_date = _x.slice(k + 1)
        return { data: _x.slice(0, k), expire_date: parseInt(expire_date) }
    }
    this.encrypt = function (x, salt) {
        x = x + "." + (Date.now() + 86400000 * day)
        const a = reverse(Buffer.from(reverse(x)).toString("base64url"))
        const b = string(20)
        const h = wow(x, a, b, salt)
        const c = h.digest().toString("base64url"); h.destroy()
        return [Buffer.from(a).toString("base64url"), b, c].join(".")
    }
    this.decrypt = function (x, salt) {
        x = x.split(".")
        x[0] = Buffer.from(x[0], "base64url").toString("utf-8")
        const _x = reverse(Buffer.from(reverse(x[0]), "base64url").toString("utf-8"))
        const h = wow(_x, x[0], x[1], salt)
        const c = h.digest().toString("base64url"); h.destroy()
        const k = _x.lastIndexOf(".")
        const expire_date = _x.slice(k + 1)
        if (c == x[2]) return { verify: true, data: _x.slice(0, k), expire_date: parseInt(expire_date), payload: x[1] }
        return { verify: false, data: _x, payload: x[1] }
    }
}

module.exports = {
    bwt: new Tokenizer(30)
}