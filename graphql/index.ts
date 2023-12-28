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
