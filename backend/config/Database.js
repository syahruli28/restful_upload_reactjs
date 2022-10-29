import Sequelize from "sequelize";


// inisiasi sequelize, (namadbnya, namausernya, passwordnya)
const db = new Sequelize('db_crud_upload', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;