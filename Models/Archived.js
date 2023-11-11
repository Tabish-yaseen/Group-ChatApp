const{DataTypes}=require('sequelize')
const sequelize=require('../utils/database')

const AchivedChat = sequelize.define('achivedchat', {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    messageContent:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    groupId:{
        type:DataTypes.STRING,
        allowNull:false
    }

})

module.exports = AchivedChat