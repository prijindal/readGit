const PROJECT_CARD_FRAGMENT = `
fragment projectCard on ProjectCard {
  id
  note
  creator {
    login
  }
  state
  createdAt
  content {
    ...on Issueish {
      id
      number
      author{
        login
      }
      repository {
        name
        owner{
          login
        }
      }
      title
    }
    ...on Issue {
      state
      assignees(first: 5) {
        edges {
          node {
            login
            avatarURL(size: 40)
          }
        }
      }
      labels(first: 10) {
        edges {
          node {
            name
            color
          }
        }
      }
    }
    ...on PullRequest {
      state
    }
  }
}
`


const CARD_EDGE_FRAGMENT = `
fragment cardEdge on ProjectCardEdge {
  node {
    ...projectCard
  }
}
` + PROJECT_CARD_FRAGMENT

const PROJECT_COLUMN_FRAGMENT = `
fragment projectColumn on ProjectColumn {
  id
  name
  updatedAt
  cards(first: 30) {
    edges {
      ...cardEdge
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
` + CARD_EDGE_FRAGMENT

const COLUMN_EDGE_FRAGMENT = `
fragment columnEdge on ProjectColumnEdge {
  node {
    ...projectColumn
  }
}
` + PROJECT_COLUMN_FRAGMENT

export const PROJECT_QUERY = `
query($username: String!, $reponame:String! $number:Int!) {
  repository(owner: $username, name: $reponame) {
		project(number: $number) {
      id
      name
      updatedAt
      body
      viewerCanEdit
      columns(first: 30) {
        edges {
          ...columnEdge
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
}

` + COLUMN_EDGE_FRAGMENT

export const ADD_PROJECT_COLUMN_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectId:ID!,
  $name: String!
) {
  addProjectColumn(input: {
    clientMutationId: $clientMutationId, 
    projectId: $projectId, 
    name: $name
  }) {
    columnEdge {
      ...columnEdge
    }
  }
}
` + COLUMN_EDGE_FRAGMENT

export const UPDATE_PROJECT_COLUMN_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectColumnId:ID!,
  $name: String!
) {
  updateProjectColumn(input: {
    clientMutationId: $clientMutationId, 
    projectColumnId: $projectColumnId, 
    name: $name
  }) {
    projectColumn {
	    ...projectColumn
    }
  }
}
` + PROJECT_COLUMN_FRAGMENT

export const DELETE_PROJECT_COLUMN_QUERY = `
mutation(
  $clientMutationId: String!, 
  $columnId:ID!
) {
  deleteProjectColumn(input: {
    clientMutationId: $clientMutationId, 
    columnId: $columnId
  }) {
    deletedColumnId
  }
}
`

export const ADD_PROJECT_CARD_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectColumnId:ID!,
  $contentId:ID,
  $note:String
) {
  addProjectCard(input: {
    clientMutationId: $clientMutationId, 
    projectColumnId: $projectColumnId,
    contentId: $contentId,
    note: $note
  }) {
    cardEdge {
      ...cardEdge
    }
  }
}
` + CARD_EDGE_FRAGMENT

export const UPDATE_PROJECT_CARD_QUERY = `
mutation(
  $clientMutationId: String!, 
  $projectCardId:ID!,
  $note:String!
) {
  updateProjectCard(input: {
    clientMutationId: $clientMutationId, 
    projectCardId :$projectCardId,
    note: $note
  }){
    projectCard {
      ...projectCard
    }
  }
}
` + PROJECT_CARD_FRAGMENT

export const DELETE_PROJECT_CARD_QUERY = `
mutation(
  $clientMutationId: String!, 
  $cardId:ID!
) {
  deleteProjectCard(input: {
    clientMutationId: $clientMutationId, 
    cardId :$cardId
  }){
    deletedCardId
  }
}
`