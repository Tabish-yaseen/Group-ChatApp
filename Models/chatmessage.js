const{DataTypes}=require('sequelize')
const sequelize=require('../utils/database')

const ChatMessage=sequelize.define('chatMessage',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    messageContent:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
module.exports=ChatMessage