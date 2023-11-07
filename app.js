const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize=require('./utils/database')

// import models

const ChatMessage=require('./Models/chatmessage')
const Group=require('./Models/group')
const User=require('./Models/user')

// routes imported
const userRoute=require('./Routes/user')
const chatMessageRoute=require('./Routes/chatmessage')




const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin:'*'
}));
 // handling routes
app.use('/user',userRoute)
app.use('/chat',chatMessageRoute)

// defining relations between the models
User.hasMany(ChatMessage)
ChatMessage.belongsTo(User)


User.belongsToMany(Group,{ through: 'userGroup' })
Group.belongsToMany(User,{ through: 'userGroup' })

Group.hasMany(ChatMessage)
ChatMessage.belongsTo(Group)


sequelize.sync({ force:false}).then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
