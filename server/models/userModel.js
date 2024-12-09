import {pool} from "../db.js";

const postUser = async(email, password) => {
    return pool.query('insert into account (email, user_password) values ($1, $2) returning *;', [email, password]);
}

const deleteUser = async(email) => {
    return pool.query('delete from account where email = $1 returning *;', [email]);
}

const getByEmail = async(email) => {
    return pool.query("select * from account where email=$1", [email]);
}

const getEmailById = async(id) => {
    return pool.query("select email from account where id=$1", [id]);
}

export { postUser, getByEmail, deleteUser, getEmailById }