import { pool } from "../db.js";

const createGroup = async (ownerId, title) => {
    return pool.query(
        `INSERT INTO groups (owner_id, title) VALUES ($1, $2) RETURNING *;`,
        [ownerId, title]
    );
};

const deleteGroup = async (groupId, ownerId) => {
    return pool.query(
        `DELETE FROM groups WHERE id = $1 AND owner_id = $2 RETURNING *;`,
        [groupId, ownerId]
    );
};

const listGroups = async () => {
    return pool.query(`SELECT * FROM groups;`);
};

// GET GROUP DETAILS AND OWNER EMAIL
const getGroupDetails = async (groupId) => {
    return pool.query(
        `SELECT g.id, g.owner_id, a.email, g.title, g.created
         FROM groups g
         JOIN account a ON g.owner_id = a.id
         WHERE g.id = $1;`,
        [groupId]
    );
};

const addMember = async (groupId, userId, isAdmin = false) => {
    return pool.query(
        `INSERT INTO group_members (group_id, user_id, is_admin) VALUES ($1, $2, $3) RETURNING *;`,
        [groupId, userId, isAdmin]
    );
};

const removeMember = async (groupId, userId) => {
    return pool.query(
        `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *;`,
        [groupId, userId]
    );
};

const listMembers = async (groupId) => {
    return pool.query(`SELECT * FROM group_members WHERE group_id = $1;`, [groupId]);
};

const createJoinRequest = async (groupId, userId, status = "pending") => {
    return pool.query(
        `INSERT INTO join_requests (group_id, user_id, request_status) VALUES ($1, $2, $3) RETURNING *;`,
        [groupId, userId, status]
    );
};

const updateJoinRequest = async (requestId, request_status) => {
    return pool.query(
        `UPDATE join_requests SET request_status = $1, updated = NOW() WHERE id = $2 RETURNING *;`,
        [request_status, requestId]
    );
};

const listJoinRequests = async (groupId) => {
    return pool.query(
        `SELECT * FROM join_requests WHERE group_id = $1;`,
        [groupId]
    );
};

const addMovieToGroup = async (groupId, movieId) => {
    return pool.query(
        `INSERT INTO group_movies (group_id, movie_id) VALUES ($1, $2) RETURNING *;`,
        [groupId, movieId]
    );
};

const listGroupMovies = async (groupId) => {
    return pool.query(
        `SELECT gm.group_id, gm.movie_id, m.title, m.finnkino_event
         FROM group_movies gm
         JOIN movies m ON gm.movie_id = m.id
         WHERE gm.group_id = $1;`,
        [groupId]
    );
};

export {
    createGroup,
    deleteGroup,
    listGroups,
    getGroupDetails,
    addMember,
    removeMember,
    listMembers,
    createJoinRequest,
    updateJoinRequest,
    listJoinRequests,
    addMovieToGroup,
    listGroupMovies,
};
