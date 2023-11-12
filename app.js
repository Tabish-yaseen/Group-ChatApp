const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path=require('path')

const sequelize=require('./utils/database')

// import models

const ChatMessage=require('./Models/chatmessage')
const Group=require('./Models/group')
const User=require('./Models/user')
const UserGroup=require('./Models/usergroup')
const ForgotPassword=require('./Models/forgotpassword')

// routes imported
const userRoute=require('./Routes/user')
const chatMessageRoute=require('./Routes/chatmessage')
const groupRoute=require('./Routes/group')
const passwordRoute=require('./Routes/password')


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin:'*'
}));

 // handling routes
app.use('/user',userRoute)
app.use('/chat',chatMessageRoute)
app.use('/group',groupRoute)
app.use('/password', passwordRoute);


app.use((req, res) => {
    console.log(req.url)
    console.log("req is completed ")
    res.sendFile(path.join(__dirname, `public/${req.url}` ));
});

// defining relations between the models
User.hasMany(ChatMessage)
ChatMessage.belongsTo(User)


User.belongsToMany(Group,{ through: UserGroup })
Group.belongsToMany(User,{ through: UserGroup })

Group.hasMany(ChatMessage)
ChatMessage.belongsTo(Group)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)


sequelize.sync({ force:false}).then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
