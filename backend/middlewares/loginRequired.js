// Controller function for book cover upload
const loggedInUser = (req, res, next) => {
    if(typeof req.session.user === 'undefined' || req.session.user?.id===''){
        return res.redirect('/login?msg=Login First!!');
    }
    next();
};


const loggedInAdmin = (req, res, next) => {
    const user = req.session?.user;
    if(typeof user === 'undefined' || user?.id==='' || !user.isAdmin){
        return res.redirect('/login?msg=Admin Login Required!!');
    }

    if(user.isAdmin) next();

    return res.redirect('/');
};

module.exports = {
    loggedInUser,
    loggedInAdmin
}