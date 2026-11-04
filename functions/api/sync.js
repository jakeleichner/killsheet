// GET and PUT /api/sync: this account's cloud backup (server/account.js).
import { getSync, putSync } from "../../server/account.js";
export const onRequestGet = ({ request, env }) => getSync(request, env);
export const onRequestPut = ({ request, env }) => putSync(request, env);
