const faunadb = require('faunadb')
const q = faunadb.query

const serverClient = new faunadb.Client({ secret: process.env["FAUNA_SECRET"] })


module.exports = async function (context, req) {
    const { method, query } = req;
    switch(method) {
        case 'GET':
            if (query.id) {
                const id = query.id;
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
            } else {
                context.res = {
                    status: 400,
                    body: "Please pass a name here"
                };
            }
            break;
        case 'POST':
            try {
                const response = await serverClient.query(
                    q.Create(
                      q.Collection('Book'),
                      { data: {
                        title: req.body.title,
                        author: req.body.author
                      }},
                    )
                )
                context.res = {
                    body: { book: response.data },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                  
            } catch (e) {

            }
            break;
        default:
            context.res = {
                status: 400,
                body: "Default"
            };
            break;
    }
};
