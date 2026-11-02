// GET and DELETE /api/admin/feedback: the owner reads and clears messages (server/feedback.js).
import { listFeedback, deleteFeedback } from "../../../server/feedback.js";
export const onRequestGet = ({ request, env }) => listFeedback(request, env);
export const onRequestDelete = ({ request, env }) => deleteFeedback(request, env);
