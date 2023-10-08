import userService from '../services/userService.js';
import dbConnect from '../database/db.js';
import spotifyService from '../services/spotifyService.js';

await dbConnect();

function generateRandomEmail() {
    const username = Math.random().toString(36).substring(7);
    const domain = 'gmail.com';
    return `${username}@${domain}`;
}

const email = generateRandomEmail();
describe('User services', () => {
    describe('Register service', () => {
        test('Should return accesss and refresh tokens', async () => {
            const res = await userService.register({ name: 'test', email, password: 'qwerty' });
            expect(res).toHaveProperty('accessToken');
        });
    });

    describe('Login service', () => {
        test('Should return accesss and refresh tokens', async () => {
            const res = await userService.login({ email, password: 'qwerty' });
            expect(res).toHaveProperty('accessToken');
        });
    });
});

describe('spotify services', () => {
    describe('authorize spotify', () => {
        test('Should return mongo document', async () => {
            const res = await spotifyService.authorizeSpotify();
            expect(res).toHaveProperty('acknowledged');
        });
    });

    describe('get spotify token from db', () => {
        test('Should return mongo document', async () => {
            const res = await spotifyService.getSpotifyToken();
            expect(res).toHaveProperty('name');
        });
    });

    describe('get spotify profile', () => {
        test('Should return profile data', async () => {
            const res = await spotifyService.getProfileById('selbin');
            expect(res).toHaveProperty('display_name');
        });
    });

    describe('get spotify playlist', () => {
        test('Should return user playlists', async () => {
            const res = await spotifyService.getPlaylistsById({ id: 'selbin', page: 1, limit: 5 });
            expect(res).toHaveProperty('items');
        });
    });
});
