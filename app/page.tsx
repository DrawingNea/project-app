import { ProjectInterface, UserProfile } from "@/common.types";
import Categories from "@/components/Categories";
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
}

type Props = {
  searchParams: SearchParams
}

const Home = async ({searchParams: {category}}: Props) => {
  const data = (await fetchAllProjects(category)) as ProjectsSearch;

  console.log(data)

  const projectsToDisplay = data?.mongoDB?.projectCollection?.edges || [];

  console.log(projectsToDisplay)

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
      <h1>LoadMore</h1>
    </section>
  );
};
export default Home;
