const sequelize = require("../sequelize");
const {DataTypes} = require ('sequelize')

const Notes = sequelize.define("Notes", {
    id:
     { type: DataTypes.INTEGER, 
       primaryKey: true,
       autoIncrement: true,
    },

    curricula:{
      type:   DataTypes.STRING,
      allowNull: false,
    },
firstName: DataTypes.STRING,
lastName: DataTypes.STRING,


});

module.exports = Notes;