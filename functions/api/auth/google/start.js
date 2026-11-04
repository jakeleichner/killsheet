// GET /api/auth/google/start: go to Google's sign-in page (server/account.js).
import { googleStart } from "../../../../server/account.js";
export const onRequestGet = ({ request, env }) => googleStart(request, env);
