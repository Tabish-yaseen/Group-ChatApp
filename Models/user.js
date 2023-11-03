const{DataTypes}=require('sequelize')
const sequelize=require('../utils/database')

const User=sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false 
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneno:{
        type:DataTypes.STRING,
        allowNull:false
    }

})
module.exports=User