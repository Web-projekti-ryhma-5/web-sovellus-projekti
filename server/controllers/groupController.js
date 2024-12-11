import {
    createGroup,
    deleteGroup,
    listGroups,
    getGroupDetails,
    addMember,
    removeMember,
    getMember,
    listMembers,
    createJoinRequest,
    updateJoinRequest,
    listJoinRequests,
    addMovieToGroup,
    listGroupMovies,
} from "../models/groupModel.js";
import { postMovie, getMovieByTitle } from '../models/movieModel.js';

// Create a new group
const createGroupHandler = async (req, res, next) => {
    const { title } = req.body;
    const ownerId = req.user.id;

    try {
        const result = await createGroup(ownerId, title);
        res.status(201).json({ group: { id: result.rows[0].id, title: result.rows[0].title} });
    } catch (err) {
        next(err);
    }
};

// Delete a group
const deleteGroupHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const ownerId = req.user.id;

    try {
        const group = await deleteGroup(groupId, ownerId);
        if (group.rowCount === 0) {
            return res.status(404).json({ message: "Group not found or unauthorized" });
        }
        res.status(200).json({ message: "Group deleted" });
    } catch (err) {
        next(err);
    }
};

// List all groups
const listGroupsHandler = async (req, res, next) => {
    try {
        const groups = await listGroups();
        res.status(200).json({groups: groups.rows});
    } catch (err) {
        next(err);
    }
};

// Get group details
const getGroupDetailsHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const memberId = req.user.id;

    try {
        const result = await getGroupDetails(groupId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Group not found" });
        }

        const member = await getMember(groupId, memberId);
        if (member.rowCount === 0 && memberId !== result.rows[0].owner_id) {
            return res.status(401).json({ message: "Only group members can see details" });
        }

        res.status(200).json({group: {
            id: result.rows[0].id,
            email: result.rows[0].email,
            title: result.rows[0].title,
            created: result.rows[0].created 
        }});
    } catch (err) {
        next(err);
    }
};

const getMembers = async (req, res, next) => {
    const { groupId } = req.params;
    const memberId = req.user.id;

    try {
        const member = await getMember(groupId, memberId);
        if (member.rowCount === 0) {
            return res.status(401).json({ message: "Only group members can see details" });
        }

        // Fetch join requests for the group
        const requests = await listMembers(groupId);
        res.status(200).json({requests: requests.rows});
    } catch (err) {
        next(err);
    }
};

// Add a member to a group
const addMemberHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const { userId, isAdmin } = req.body;

    try {
        const member = await addMember(groupId, userId, isAdmin);
        res.status(201).json(member.rows[0]);
    } catch (err) {
        next(err);
    }
};

// Remove a member from a group
const removeMemberHandler = async (req, res, next) => {
    const { groupId, userId } = req.params;

    try {
        const member = await removeMember(groupId, userId);
        if (member.rowCount === 0) {
            return res.status(404).json({ message: "Member not found in group" });
        }
        res.status(200).json({ message: "Member removed successfully" });
    } catch (err) {
        next(err);
    }
};

// List all join requests for a group
const listJoinRequestsHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const ownerId = req.user.id;

    try {
        // Verify the user is the group owner
        const groups = await getGroupDetails(groupId);
        if (groups.rowCount === 0 || groups.rows[0].owner_id !== ownerId) {
            return res.status(403).json({ message: "You are not authorized to view this group's join requests" });
        }

        // Fetch join requests for the group
        const requests = await listJoinRequests(groupId);
        res.status(200).json({requests: requests.rows});
    } catch (err) {
        next(err);
    }
};


// Create a join request
const createJoinRequestHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const request = await createJoinRequest(groupId, userId);
        res.status(201).json({request: request.rows[0]});
    } catch (err) {
        next(err);
    }
};

// Update join request status
const updateJoinRequestHandler = async (req, res, next) => {
    const { requestId } = req.params;
    const { status } = req.body;

    try {
        const result = await updateJoinRequest(requestId, status);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Join request not found" });
        }

        // add new apprved member to group
        if (result.rows[0].request_status === 'approved') {
            let member = await addMember(result.rows[0].group_id, result.rows[0].user_id, false);
        }

        res.status(200).json({request: {
            id: result.rows[0].id,
            group_id: result.rows[0].group_id,
            request_status: result.rows[0].request_status,
            user_id: result.rows[0].user_id
        }});
    } catch (err) {
        next(err);
    }
};

// Add a movie to a group
const addMovieToGroupHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const { title } = req.body;

    let movie = await getMovieByTitle(title);

    if (!movie.rows[0]) {
        movie = await postMovie(title);
    }

    try {
        const result = await addMovieToGroup(groupId, movie.rows[0].id);
        res.status(201).json({ message: 'Movie added successfully', movie: result.rows[0]});
    } catch (err) {
        next(err);
    }
};

// List all movies in a group
const listGroupMoviesHandler = async (req, res, next) => {
    const { groupId } = req.params;

    try {
        const result = await listGroupMovies(groupId);
        res.status(200).json({movies: result.rows});
    } catch (err) {
        next(err);
    }
};

export {
    createGroupHandler,
    deleteGroupHandler,
    listGroupsHandler,
    getGroupDetailsHandler,
    getMembers,
    addMemberHandler,
    removeMemberHandler,
    createJoinRequestHandler,
    updateJoinRequestHandler,
    addMovieToGroupHandler,
    listGroupMoviesHandler,
    listJoinRequestsHandler
};
