import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route('activities','routes/activities.tsx'),
    layout("protected.tsx", [
      route(':username','routes/userpage.tsx')
    ]),
  ]),
] satisfies RouteConfig;
