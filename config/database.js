import {Sequelize} from "sequelize"
const db = new Sequelize('try_capstone', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})
export default  db