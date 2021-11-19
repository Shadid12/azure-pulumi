const faunadb = require('faunadb')
const q = faunadb.query

const serverClient = new faunadb.Client({ secret: process.env["FAUNA_SECRET"] })

module.exports = async function (context, req) {
    if (req.query.id) {
        const id = req.query.id;
        try {
            const res = await serverClient.query(
                q.Get(q.Ref(q.Collection('Book'), id))
            )
            context.res = {
                body: { book: res.data },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } catch(e) {
            context.res = {
                status: 404,
                body: "Not Found"
            };
        }
    }
    
    else {
        context.res = {
            status: 400,
            body: "Please pass a name here"
        };
    }
};
