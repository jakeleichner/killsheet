// POST /api/auth/email/start: email a sign-in code (server/account.js).
import { startEmail } from "../../../../server/account.js";
export const onRequestPost = ({ request, env }) => startEmail(request, env);
