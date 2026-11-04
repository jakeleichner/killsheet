// GET /api/account: who's signed in. DELETE: delete the account (server/account.js).
import { getAccount, deleteAccount } from "../../server/account.js";
export const onRequestGet = ({ request, env }) => getAccount(request, env);
export const onRequestDelete = ({ request, env }) => deleteAccount(request, env);
