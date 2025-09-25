import http from 'http';
import { URL } from 'url';

const EMAIL = 'tatianakuryla_gmail_com';

function getGreatestCommonDivisor(a, b) {
    return b === 0n ? a : getGreatestCommonDivisor(b, a % b);
}

function isNatural(a) {
    return typeof a === 'bigint' && a >= 0n;
}

function getLeastCommonMultiple(a, b) {
    if (!isNatural(a) || !isNatural(b)) return `NaN`;
    if (a === 0n && b === 0n) return '0';
    if (a === 0n) return String(b);
    if (b === 0n) return String(a);
    return String((a / getGreatestCommonDivisor(a,  b)) * b);
}

const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    if (request.method !== 'GET' || url.pathname !== `/${EMAIL}`) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('Not Found');
        return;
    }
    const xParam = url.searchParams.get('x');
    const yParam = url.searchParams.get('y');
    if (xParam === null || yParam === null) {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('NaN');
        return;
    }

    let x;
    let y;

    try {
        x = BigInt(xParam);
        y = BigInt(yParam);
    } catch {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('NaN');
        return;
    }

    const result = getLeastCommonMultiple(x, y);
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end(result);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Listening: http://localhost:${PORT}/${EMAIL}?x=8&y=6`);
});