function GET(_, res) {
    res.json({name: "Hello from server!"})
}

function OPTIONS(_, res) {

    res.json({name: 'OPTIONS request'})
}

function POST(req, res, url, payload) {
    res.json(payload)
}

export { GET, OPTIONS, POST };
