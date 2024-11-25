import { expect } from "chai";
import {pool} from './db.js';
import {hash, compare} from 'bcrypt';
import jwt from 'jsonwebtoken';
const {sign} = jwt;

const insertTestUser = (email, password) => {
    hash(password, 10, (err, hash) => {
        pool.query('insert into account (email, user_password) values ($1, $2) returning *', [email, hash]);
    });
}

const getToken = (email) => {
    return sign({user: email}, process.env.JWT_SECRET_KEY);
}

const url = 'http://localhost:3001/api/';

describe('POST register', () => {

    const email = 'register1@gmail.com';
    const password = 'register123';

    it('should register with valid email and password', async () =>{
        const response = await fetch(url + 'auth/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });
        const data = await response.json();

        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    });

    it('should not post a user with a password shorter than 8 characters', async() => {
        const email = 'register2@mail.com';
        const password = 'short1';

        const response = await fetch(url + 'auth/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });
        const data = await response.json();

        expect(response.status).to.be.equal(400, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });
});

describe('POST login', () => {

    const email = 'user3@example.com';
    const password = 'password123';

    insertTestUser(email, password);

    it('should login with valid email and password', async () =>{
        const response = await fetch(url + 'auth/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });
        const data = await response.json();

        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });
});

describe('POST logout', () => {

    const email = 'user4@example.com';
    const password = 'password123';
    insertTestUser(email, password);
    const token = getToken(email);

    it('should logout user', async () =>{
        const response = await fetch(url + 'auth/logout', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('message');
    });
});