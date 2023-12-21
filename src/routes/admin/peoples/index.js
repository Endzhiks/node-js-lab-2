function GET(req, res) {
    res.json({name: 'get peoples'})
}

function POST(req, res, url, payload) {
    console.log(payload)

    res.json(payload)

}function PUT(req, res, url, payload) {
    console.log(payload)

    res.json(payload)
}

export { GET, POST, PUT }
