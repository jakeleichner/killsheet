// POST /api/feedback: a player's message (server/feedback.js).
import { postFeedback } from "../../server/feedback.js";
export const onRequestPost = ({ request, env }) => postFeedback(request, env);
