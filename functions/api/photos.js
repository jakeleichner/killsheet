// GET and PUT /api/photos: this account's operative photos (server/account.js).
import { getPhotos, putPhoto } from "../../server/account.js";
export const onRequestGet = ({ request, env }) => getPhotos(request, env);
export const onRequestPut = ({ request, env }) => putPhoto(request, env);
