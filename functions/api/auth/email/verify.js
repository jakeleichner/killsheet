// POST /api/auth/email/verify: check a sign-in code (server/account.js).
import { verifyEmail } from "../../../../server/account.js";
export const onRequestPost = ({ request, env }) => verifyEmail(request, env);
