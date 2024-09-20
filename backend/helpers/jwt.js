var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET||'this_is_@_temp.secret';
    return jwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            {url: /\/api\/v1\/books(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/reviews(.*)/, methods: ['GET','OPTIONS']},
            // {url: /\/api\/categories(.*)/, methods: ['GET','OPTIONS']},
            // {url: /\/api\/info(.*)/, methods: ['GET','OPTIONS']},
            // '/api/v1/users/login',
            // '/api/v1/users/signup',
            // '/api/users/join-waitlist',
            // '/'
        ]
    })
}

module.exports = authJwt;