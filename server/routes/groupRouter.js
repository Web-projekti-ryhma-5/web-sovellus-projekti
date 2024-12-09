import express from "express";
import {
    createGroupHandler,
    deleteGroupHandler,
    listGroupsHandler,
    getGroupDetailsHandler,
    addMemberHandler,
    removeMemberHandler,
    createJoinRequestHandler,
    updateJoinRequestHandler,
    addMovieToGroupHandler,
    listGroupMoviesHandler,
    listJoinRequestsHandler,
} from "../controllers/groupController.js";
import {auth} from "../util/auth.js";

const groupRouter = express.Router();

groupRouter.get("/", listGroupsHandler);
groupRouter.post("/", auth, createGroupHandler);
groupRouter.delete("/:groupId", auth, deleteGroupHandler);
groupRouter.get("/:groupId", auth, getGroupDetailsHandler);
groupRouter.post("/:groupId/members", auth, addMemberHandler);
groupRouter.delete("/:groupId/members/:userId", auth, removeMemberHandler);
groupRouter.post("/:groupId/join-requests", auth, createJoinRequestHandler);
groupRouter.put("/join-requests/:requestId", auth, updateJoinRequestHandler);
groupRouter.get("/:groupId/movies", auth, listGroupMoviesHandler);
groupRouter.post("/:groupId/movies", auth, addMovieToGroupHandler);
groupRouter.get("/:groupId/join-requests", auth, listJoinRequestsHandler);

export default groupRouter;
