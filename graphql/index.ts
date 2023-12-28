export const getUserQuery = `
  query GetUser($email: String!) {
    mongoDB {
		user(by: {email: $email}) {
		  id
		  name
		  email
		  avatarUrl
		  description
		  githubUrl
		  linkedInUrl
		}
	  }
  }
`;

export const createUserMutation = `
	mutation CreateUser($input: UserCreateInput!) {
		mongoDB {
			userCreate(input: $input) {
				insertedId
			}
		}
	}
`;

export const createProjectMutation = `
	mutation CreateProject($input: ProjectCreateInput!) {
		mongoDB {
			projectCreate(input: $input) {
				insertedId
			}
		}
	}
`;

export const updateProjectMutation = `
	mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
		mongoDB {
			projectUpdate(by: { id: $id }, input: $input) {
				project {
					id
					title
					description
					createdBy {
						email
						name
					}
				}
			}
		}
	}
`;

export const deleteProjectMutation = `
  mutation DeleteProject($id: ID!) {
	mongoDB{
		projectDelete(by: { id: $id }) {
			deletedCount
		}
	}
  }
`;

export const getProjectsOfUserQuery = `
query getUserProjects($id: ID!, $last: Int = 4) {
	mongoDB {
	  projectCollection(
		filter: {
		  createdBy: {
			eq: $id
		  }
		}
	last: $last
  ) {
		edges {
		  node {
			id
			title
			description
			image
			liveSiteUrl
			githubUrl
			category
			createdBy
		  }
		}
	  }
	}
  }
`;

export const projectsQuery = (filter: string, after: string) => {
  return `
query getProjects {
	mongoDB {
	  projectCollection(first: 8 ${filter} ${after}) {
		edges {
		  node {
			id
			title
			description
			image
			liveSiteUrl
			githubUrl
			category
			createdBy
		  }
		}
		pageInfo {
		  hasPreviousPage
		  hasNextPage
		  startCursor
		  endCursor
		}
	  }
	}
  }
`;
};
