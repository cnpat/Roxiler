// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {

    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.log(err);

    }


  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
