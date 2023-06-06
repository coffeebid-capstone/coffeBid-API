import {Sequelize} from "sequelize"

const db = new Sequelize('capstone', 'root', 'kopi123', {
    host: "34.101.54.231",
    dialect: "mysql"
})
export default  db