import { expect } from "chai";

const url = 'http://localhost:3001/api/';

describe('AUTH', () => {

    const email = 'register1@gmail.com';
    const password = 'register123';
    let token;

    it('should register with valid email and password', async () =>{
        const response = await fetch(url + 'auth/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.message).to.equal('Registration success');
    });

    it('should not allow duplicate registration', async () => {
        const response = await fetch(url + 'auth/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });

        const data = await response.json();

        expect(response.status).to.equal(409);
        expect(data.message).to.equal('Email already exists');
    });

    it('should not register a user with a password shorter than 8 characters', async() => {
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

        expect(response.status).to.equal(400);
        expect(data.message).to.equal('Invalid password for user');
    });

    it('should login with valid email and password', async () =>{
        const response = await fetch(url + 'auth/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.have.property('token');
        token = data.token;
    });

    it('should fail login with invalid credentials', async () => {
        const response = await fetch(url + 'auth/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email,'password':'123'})
        });

        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data.message).to.equal('Invalid credentials');
    });

    it('should logout user', async () =>{
        const response = await fetch(url + 'auth/logout', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Successfully logged out');
    });

    it('should not allow usage of a revoked token', async () => {
        const response = await fetch(url + 'auth/logout', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data.message).to.equal('Token has been revoked');
    });
});