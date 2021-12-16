const {Sequelize} = require ('sequelize')

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./sqlite/test.db",
});


sequelize.sync({
alter: true,

}).then(() => {
    console.log('All models syncronized succesfully');
});

module.exports = sequelize;