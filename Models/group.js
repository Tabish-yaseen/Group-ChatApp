const{DataTypes}=require('sequelize')
const sequelize=require('../utils/database')

const Group=sequelize.define('group',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    groupName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports=Group