import React from "react";
import { getUser, getUserById, getUserProjects } from "@/lib/actions";
import { ProjectInterface, UserProfile } from "@/common.types";
import ProfilePage from "@/components/ProfilePage";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const userResult = (await getUserById(params.id)) as {
    mongoDB: {
      user: UserProfile;
    };
  };
  const projectResult = (await getUserProjects(userResult.mongoDB.user.email) as {
    mongoDB: {
      projectCollection: {
        pageInfo: {
          hasPreviousPage: boolean;
          hasNextPage: boolean;
          startCursor: string;
          endCursor: string;
        };
        edges: {
          node: ProjectInterface;
        }[];
      };
    };
  });
  if (!projectResult?.mongoDB.projectCollection) {
    return <p className="no-result-text">Failed to fetch user info</p>;
  }

  return (
    <ProfilePage
      userProjects={projectResult.mongoDB.projectCollection}
      user={userResult.mongoDB.user}
    />
  );
};

export default UserProfile;
