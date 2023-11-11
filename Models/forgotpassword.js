const{DataTypes}=require('sequelize')
const sequelize=require('../utils/database')

const forgotPassword=sequelize.define('forgotPassword',{
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isActive: {
        type:DataTypes.BOOLEAN,
        allowNull: false,
      },
    })
    
  
  module.exports = forgotPassword