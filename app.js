const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/user');
const Chat = require('./models/chat');

const userRoutes = require('./routes/user.js');
const messageRoutes = require('./routes/message');

const sequelize = require('./util/database');

const app = express();
app.use(cors({
    origin : '*',
    methods: ['GET', 'POST']
}));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/message', messageRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

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