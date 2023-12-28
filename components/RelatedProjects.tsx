import { ProjectInterface } from "@/common.types";
import { getUserProjects } from "@/lib/actions";
import Link from "next/link";

type Props = {
  userId: string;
  userEmail: string;
  userName: string;
  projectId: string;
};

const RelatedProjects = async ({
  userId,
  userEmail,
  userName,
  projectId,
}: Props) => {
  const result = (await getUserProjects(userEmail)) as {
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
  };
  console.log(result);
  const filteredProjects = result?.mongoDB.projectCollection.edges.filter(
    ({ node }) => node?.id !== projectId
  );

  if (filteredProjects?.length === 0) return null;

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p>More by {userName}</p>
        <Link href={`/profile/${userId}`}>View All</Link>
      </div>
    </section>
  );
};

export default RelatedProjects;
