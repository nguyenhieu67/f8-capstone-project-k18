/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTE_PATHS } from "@/constants/routePaths";
import Home from "@/pages/Home";

interface RoutesI {
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
}

const publicRoutes: RoutesI[] = [
  { path: ROUTE_PATHS.HOME, component: Home },
  // { path: "/login", component: "exmp", layout: "exmp" },
];

const privateRoutes: RoutesI[] = [];

export { publicRoutes, privateRoutes };
