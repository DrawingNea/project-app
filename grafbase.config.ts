import { graph, config, connector, auth } from "@grafbase/sdk";

const g = graph.Standalone();

const mongo = connector.MongoDB("MongoDB", {
  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-spflb/endpoint/data/v1',
  apiKey: 'phQ999qxPu3xvmjoZ4xImZxiJWLkiiisLyiW9o9myc4Be7UgZrEU5hQWEKwe06fG',
  dataSource: 'Cluster0',
  database: 'Demo'
});

g.datasource(mongo);

//@ts-ignore
const User = mongo
  .model("User", {
    name: g.string().length({ min: 2, max: 20 }),
    email: g.string().unique(),
    avatarUrl: g.url(),
    description: g.string().optional(),
    githubUrl: g.url().optional(),
    linkedInUrl: g.url().optional(),
    //projects: g.relation(() => Project).list().optional(),
  }).collection("users")
  .auth((rules) => {
    rules.public().read();
  });

//@ts-ignore
const Project = mongo
  .model("Project", {
    title: g.string().length({ min: 3 }),
    description: g.string(),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url(),
    //category: g.string().search(),
    //createdBy : g.relation(() => User),
  }).collection("projects")
  .auth((rules) => {
    rules.public().read(), rules.private().create().delete().update();
  });

const jwt = auth.JWT({
  issuer: "grafbase",
  secret: g.env("NEXTAUTH_SECRET"),
});

export default config({
  graph: g,
  // Authentication - https://grafbase.com/docs/auth
  auth: {
    providers: [jwt],
    // OpenID Connect
    // const oidc = auth.OpenIDConnect({ issuer: g.env('OIDC_ISSUER_URL') })
    // providers: [oidc],
    rules: (rules) => {
      rules.private();
    },
  },
  // Caching - https://grafbase.com/docs/graphql-edge-caching
  // cache: {
  //   rules: [
  //     {
  //       types: ['Query'], // Cache everything for 60 seconds
  //       maxAge: 60,
  //       staleWhileRevalidate: 60
  //     }
  //   ]
  // }
});
