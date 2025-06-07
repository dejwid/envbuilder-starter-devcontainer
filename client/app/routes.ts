import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/test", "routes/test.tsx"),
  route("/workout", "routes/workout.tsx"),
  route("/log", "routes/log.tsx"),
  route("/details/:workoutId", "routes/details.tsx"),
] satisfies RouteConfig;
