const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('./model/db');


const app = express();
const authRouter = require('./router/auth');
const adminRouter = require('./router/admin');
const storeRouter = require('./router/store');
const ratingRouter = require('./router/rating');
const ownerRouter = require('./router/owner');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/stores', storeRouter);
app.use('/ratings', ratingRouter);
app.use('/owner', ownerRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});