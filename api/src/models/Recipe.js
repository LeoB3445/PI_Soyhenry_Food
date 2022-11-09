const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    summary:{
      type:DataTypes.STRING,
      allowNull:false
    },
    health_score:{
      type: DataTypes.INTEGER,
      allowNull:true,
      validate:{
        min:0,
        max:10
      }
    },
    step_by_step:{
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
