function GET(req, res) {
    res.json({name: 'get admin route data'})
}

function POST(req, res, url, payload) {
    console.log(payload)

    res.json({name: 'success!'})
}

export { GET, POST }
