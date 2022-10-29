import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// inisiasi DataType dari sequelize
const {DataTypes} = Sequelize;


// buat table di db dengan nama product dan fieldnya : name, image, url
const Product = db.define('product', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING
}, {
    freezeTableName: true
});

export default Product;

// untuk buat tb (cth tb Product) jika tidak ada (otomatis dibuatkan)
(async()=>{
    await db.sync();
})();