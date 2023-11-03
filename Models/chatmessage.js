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
    date:{
        type:DataTypes.DATE,
        allowNull:false
    }
})
module.exports=ChatMessage