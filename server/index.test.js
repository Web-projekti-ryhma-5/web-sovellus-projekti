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

    const notFoundTitle = 'abc';
    const emptyReviews = [];
    const title = 'Movie 1';

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
            body: JSON.stringify({ title, rating, info })
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.message).to.equal('Review added successfully');
        expect(data.review).to.have.property('user_id', userId);
        expect(data.review).to.have.property('email', email);
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
            body: JSON.stringify({ title })
        });

        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.message).to.equal('Movie title and rating are required');
    });

    it('should not allow adding a review with invalid rating', async () => {
        const invalidRating = "6";

        const response = await fetch(url + 'reviews/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ title, rating: invalidRating, info })
        });

        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.message).to.equal('Rating must be a string value between 1 and 5');
    });

    it('should not allow adding a review without a token', async () => {
        const response = await fetch(url + 'reviews/new', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, rating, info })
        });

        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data.message).to.equal('Authorization required.');
    });

    it('should get empty movie reviews', async () => {
        const response = await fetch(url + `reviews/${notFoundTitle}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.reviews).to.eql(emptyReviews);
    });

    it('should get movie reviews', async () => {
        const response = await fetch(url + `reviews/${title}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.reviews).to.be.an('array').that.is.not.empty;
        expect(data.reviews[0]).to.include.all.keys('user_id', 'email', 'movie_id', 'rating', 'info', 'created', 'updated');
    });

    it('should update the review for the movie', async () => {
        const response = await fetch(url + `reviews/${title}`, {
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
        const response = await fetch(url + `reviews/${title}`, {
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
        const response = await fetch(url + `reviews/${title}`, {
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

describe('GROUPS', () => {
    const email = 'testuser3@gmail.com';
    const password = 'testpassword1';
    let token;

    const groupName = 'Test Group';
    let groupId;
    const title = 'Movie 1';

    const anotherEmail = 'anotheruser@gmail.com';
    let anotherToken;

    before(async () => {
        await fetch(url + 'auth/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginResponse = await fetch(url + 'auth/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginResponse.json();
        token = loginData.token;

        await fetch(url + 'auth/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: anotherEmail, password })
        });

        const anotherLoginResponse = await fetch(url + 'auth/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: anotherEmail, password })
        });

        const anotherLoginData = await anotherLoginResponse.json();
        anotherToken = anotherLoginData.token;
    });

    it('should create a new group', async () => {
        const response = await fetch(url + 'groups', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ title: groupName })
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.have.property('group');
        expect(data.group).to.have.property('id');
        expect(data.group.title).to.equal(groupName);

        groupId = data.group.id;
    });

    it('should list all groups', async () => {
        const response = await fetch(url + 'groups', {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.groups).to.be.an('array').that.is.not.empty;
        expect(data.groups[0]).to.have.property('id', groupId);
        expect(data.groups[0]).to.have.property('title', groupName);
    });

    it('should allow a user to request to join a group', async () => {
        const response = await fetch(url + `groups/${groupId}/join-requests`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': anotherToken
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.request).to.include.all.keys('id', 'user_id', 'group_id', 'request_status');
    });

    it('should allow the owner to view join requests', async () => {
        const response = await fetch(url + `groups/${groupId}/join-requests`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.requests).to.be.an('array').that.is.not.empty;
        expect(data.requests[0]).to.include.all.keys('id', 'user_id', 'group_id', 'request_status');
    });

    it('should allow the owner to approve a join request', async () => {
        // Fetch join requests first
        const requestsResponse = await fetch(url + `groups/${groupId}/join-requests`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const requestsData = await requestsResponse.json();
        const requestId = requestsData.requests[0].id;
        console.log("REQUEST ID" + requestId)

        // Approve the join request
        const response = await fetch(url + `groups/join-requests/${requestId}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ status: 'approved' })
        });

        const data = await response.json();
        console.log(data.request.id)

        expect(response.status).to.equal(200);
        expect(data.request).to.have.property('id');
        expect(data.request).to.have.property('user_id');
        expect(data.request).to.have.property('group_id');
        expect(data.request).to.have.property('request_status');
    });

    it('should allow an approved member to add a movie to the group', async () => {
        const response = await fetch(url + `groups/${groupId}/movies`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': anotherToken
            },
            body: JSON.stringify({ title: title })
        });

        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.message).to.equal('Movie added successfully');
        expect(data.movie).to.include.all.keys('group_id', 'movie_id');
    });

    it('should allow the owner to remove a member from the group', async () => {
        const response = await fetch(url + `groups/${groupId}/members/1`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Member removed successfully');
    });

    it('should delete the group', async () => {
        const response = await fetch(url + `groups/${groupId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Group deleted');
    });
});
