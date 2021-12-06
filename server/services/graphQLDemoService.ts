export default class GraphQLDemoService {
  async getDemoData() {
    const response = await fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
                    getDemoData {
                        id
                        name
                        description
                        price
                        image
                    }
                }`,
      }),
    })

    const data = await response.json()
    return data.data.getDemoData
  }
}
