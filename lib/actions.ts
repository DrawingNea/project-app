import { ProjectForm } from "@/common.types";
import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserByIdQuery,
  getUserQuery,
  projectsQuery,
  updateProjectMutation,
} from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction
  ? process.env.MONGODB_API_URL || ""
  : "http://127.0.0.1:4000/graphql";
const apiKey = isProduction ? process.env.MONGODB_API_KEY || "" : "letmein";
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const getUserById = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserByIdQuery, { id });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };
  return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);
  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);
    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: creatorId,
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (
  category?: string,
  endCursor?: string
) => {
  client.setHeader("x-api-key", apiKey);
  let filter = category ? `,filter: {category:{eq:"${category}"}}` : "";
  let after = endCursor ? `,after: ${endCursor}` : "";
  return makeGraphQLRequest(projectsQuery(filter, after), {});
};

export const getProjectDetails = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (userEmail: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { userEmail });
};

export const deleteProject = (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (
  form: ProjectForm,
  projectId: string,
  token: string
) => {
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = {
    title: { set: form.title },
    description: { set: form.description },
    image: { set: form.image },
    liveSiteUrl: { set: form.liveSiteUrl },
    githubUrl: { set: form.githubUrl },
    category: { set: form.category },
  };

  const isUploadingNewImage = isBase64DataURL(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);
    if (imageUrl.url) {
      updatedForm = {
        title: { set: form.title },
        description: { set: form.description },
        liveSiteUrl: { set: form.liveSiteUrl },
        githubUrl: { set: form.githubUrl },
        category: { set: form.category },
        image: { set: imageUrl.url },
      };
    }
  }

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation, variables);
};
