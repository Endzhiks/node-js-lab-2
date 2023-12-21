import * as http from 'node:http';
import router from './router.js'

const EMPTY_OBJECT = {};

const defaultHandler = (_, res) => {
    res.json({name: 'default handling'});
}

const contentTypes = {
    'text/html': (text) => text,
    'text/plain': (text) => text,
    'application/json': (json) => {
        try {
            return JSON.parse(json)
        } catch {
            return EMPTY_OBJECT;
        }
    },
    'application/x-www-form-urlencoded': (formData) => {
        return Object.fromEntries(new URLSearchParams(formData));
    }
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `https://${req.headers.host}`);

    const routeModule = router.get(url.pathname) ?? EMPTY_OBJECT;

    const handler = routeModule[req?.method] || defaultHandler;

    let payload = EMPTY_OBJECT;

    let rawRequest = '';

    for await (const chunk of req) {
        rawRequest += chunk;
    }

    if (req.headers['content-type']) {
        const contentType = req.headers['content-type'].split(';')[0];
        if (contentTypes[contentType]) {
            payload = contentTypes[contentType](rawRequest);
        }
    }

    try {
        handler(req, Object.assign(res, {
            json(data) {
                this.end(JSON.stringify(data));
            }
        }), url, payload, rawRequest);

    } catch (e) {
        res.statusCode = 500;

        res.end('Internal  Server Error');
    }
});

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(4000);

process.on('SIGINT', () => {
    server.close(error => {
        if (error) {
            console.error(error);

            process.exit(1);
        }
    });
})
