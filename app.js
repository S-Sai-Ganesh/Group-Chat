const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user.js');

const sequelize = require('./util/database');

const app = express();
app.use(cors({origin : 'null'}));
app.use(bodyParser.json());

app.use('/user', userRoutes);

sequelize
    .sync()
    // .sync({ force: true })
    .then(res => {
        app.listen(process.env.PORT_DEFAULT, (err) => {
            if (err) console.log(err);
            console.log('Server is listening for requests');
        });
    })
    .catch(err => {
        console.log(err);
    });