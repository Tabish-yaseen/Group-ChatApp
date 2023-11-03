const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize=require('./utils/database')

// import models
const User=require('./Models/user')
const ChatMessage=require('./Models/chatmessage')

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


sequelize.sync({ force:false}).then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
