import http from 'http';
import { URL } from 'url';

const EMAIL_PATH = '/tatianakuryla_gmail_com';

function getGreatestCommonDivisor(a, b) {
    return b === 0n ? a : getGreatestCommonDivisor(b, a % b);
}

function toNaturalBigintOrNull(string) {
    if (typeof string !== 'string' || !/^[0-9]+$/.test(string)) return null;
    const value = BigInt(string);
    return value > 0n ? value : null;
}

function getLeastCommonMultiple(a, b) {
    return String((a / getGreatestCommonDivisor(a, b)) * b);
}

const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');

    if (url.pathname === '/' && request.method === 'GET') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('OK');
        return;
    }

    const isEmailPath =
        (url.pathname === EMAIL_PATH) ||
        (url.pathname === EMAIL_PATH + '/');

    if (request.method !== 'GET' || !isEmailPath) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Not Found');
        return;
    }
    const xParam = url.searchParams.get('x');
    const yParam = url.searchParams.get('y');

    const x = toNaturalBigintOrNull(xParam);
    const y = toNaturalBigintOrNull(yParam);

    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (x === null || y === null) {
        response.end('NaN');
        return;
    }

    response.end(getLeastCommonMultiple(x, y));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Listening: http://localhost:${PORT}${EMAIL_PATH}?x=8&y=6`);
});