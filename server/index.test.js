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

describe('REVIEWS', () => {
    const email = 'testuser@gmail.com';
    const password = 'testpassword1';
    let token;
    const userId = 4;
    const movieId = 1;
    const rating = "4";
    const info = "Great movie, highly recommend!";
    const newRating = "5";
    const newInfo = "Great movie, highly recommend!";

    before(async () => {
        await fetch(url + 'auth/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const loginResponse = await fetch(url + 'auth/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const loginData = await loginResponse.json();
        token = loginData.token;
    });

    it('should add a review for a movie', async () => {
        const response = await fetch(url + 'reviews/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ movieId, rating, info })
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.message).to.equal('Review added successfully');
        expect(data.review).to.have.property('user_id', userId);
        expect(data.review).to.have.property('movie_id', movieId);
        expect(data.review).to.have.property('rating', rating);
        expect(data.review).to.have.property('info', info);
    });

    it('should not allow adding a review with missing rating', async () => {
        const response = await fetch(url + 'reviews/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ movieId })
        });

        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.message).to.equal('Movie ID and rating are required');
    });

    it('should not allow adding a review with invalid rating', async () => {
        const invalidRating = "6";

        const response = await fetch(url + 'reviews/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ movieId, rating: invalidRating, info })
        });

        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.message).to.equal('Rating must be a string value between 1 and 5');
    });

    it('should not allow adding a review without a token', async () => {
        const response = await fetch(url + 'reviews/new', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieId, rating, info })
        });

        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data.message).to.equal('Authorization required.');
    });

    it('should update the review for the movie', async () => {
        const response = await fetch(url + `reviews/${movieId}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ rating: newRating, info: newInfo })
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Review updated successfully');
        expect(data.review.rating).to.equal(newRating);
        expect(data.review.info).to.equal(newInfo);
    });

    it('should delete the review for the movie', async () => {
        const response = await fetch(url + `reviews/${movieId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Review deleted successfully');
    });

    it('should not find a deleted review', async () => {
        const response = await fetch(url + `reviews/${movieId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(404);
        expect(data.message).to.equal('Review not found');
    });
});