const express = require('express');

const app = express();



app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Hello Naru Sheth');
})

app.listen(8080, () => {
    console.log('Server is running on port 3000');
});