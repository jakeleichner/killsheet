// POST /api/auth/signout (server/account.js).
import { signOut } from "../../../server/account.js";
export const onRequestPost = ({ request, env }) => signOut(request, env);
