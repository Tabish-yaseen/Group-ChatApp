const{DataTypes}=require('sequelize')
const sequelize=require('../utils/database')

const UserGroup=sequelize.define('usergroup',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    isAdmin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})
module.exports=UserGroup