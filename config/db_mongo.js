const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database connection is ready...');
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose;
