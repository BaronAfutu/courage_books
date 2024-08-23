const jwt = require('jsonwebtoken');

const PAGINATION_LIMIT = 10;

const decodeToken = async (authorizationString) => {
    const token = authorizationString.split(' ')[1];
    try {
        var decoded = jwt.verify(token, process.env.SECRET||'this_is_@_temp.secret');
        decoded['success'] = true;
    } catch (err) {
        console.log(err);
        decoded['success'] = false;
    } finally {
        return decoded;
    }
}


module.exports = {
    PAGINATION_LIMIT,
    decodeToken
}