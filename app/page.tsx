import { ProjectInterface, UserProfile } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchAllProjects, getUser } from "@/lib/actions";

type ProjectsSearch = {
  mongoDB:{
    projectCollection: {
    edges: {
      node: ProjectInterface;
    }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
  }
};

type SearchParams = {
  category?:string;
  endCursor?:string;
}

type Props = {
  searchParams: SearchParams
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({searchParams: {category, endCursor}}: Props) => {
  const data = (await fetchAllProjects(category, endCursor)) as ProjectsSearch;

  const projectsToDisplay = data?.mongoDB?.projectCollection?.edges || [];

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <p className="no-result-text text-center">
          No projects found, go create some first.
        </p>
      </section>
    );
  }

  const pagination = data?.mongoDB.projectCollection.pageInfo;

  console.log(pagination)

  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />
      <section className="projects-grid">
        {projectsToDisplay.map(async ({ node }: { node: ProjectInterface }) => {
          const projectCreator = (await getUser(node?.createdBy)) as {
            mongoDB: {
              user: UserProfile;
            };
          };
          return(<ProjectCard key={node?.id} id={node?.id} image={node?.image} title={node?.title} name={projectCreator?.mongoDB.user?.name} avatarUrl={projectCreator?.mongoDB.user?.avatarUrl} userId={projectCreator?.mongoDB.user?.id} />);
})}
      </section>
      <LoadMore startCursor={pagination.startCursor} endCursor={pagination.endCursor} hasPreviousPage={pagination.hasPreviousPage} hasNextPage={pagination.hasNextPage} />
    </section>
  );
};
export default Home;
