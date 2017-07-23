const fetch = require('node-fetch')

const IntrospectionQuery = `
{
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
`

async function intro() {
  try {
    let resp = await fetch('https://api.github.com/graphql',{
      body: JSON.stringify({
        query: IntrospectionQuery,
        variables: {}
      }),
      method: 'POST',
      'Content-type': 'application/json',
      headers: {
      }
    })
    resp = await resp.json();
  } catch(e) {
    console.error(e);
  } finally {
    console.log(resp);
  }
}

intro()
