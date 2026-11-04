// GET /api/auth/google/callback: Google sends the player back (server/account.js).
import { googleCallback } from "../../../../server/account.js";
export const onRequestGet = ({ request, env }) => googleCallback(request, env);
