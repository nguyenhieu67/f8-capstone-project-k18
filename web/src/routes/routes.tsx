/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTE_PATHS } from "@/constants/routePaths";
import AuthLayout from "@/layouts/Auth/AuthLayout";
import {
  ForgotPassword,
  Login,
  NotFound,
  Register,
  ResetPassword,
  Review,
} from "@/pages/public";
import {
  Classe,
  Dashboard,
  Employee,
  Payroll,
  PreSale,
  SaleResult,
  Source,
  StaffTimeKeeping,
  StudentAttendance,
} from "@/pages/private";

interface RoutesI {
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any> | null;
}

// eslint-disable-next-line react-refresh/only-export-components
const AuthRightLayout = (props: { children: React.ReactNode }) => (
  <AuthLayout bannerPosition="right" {...props} />
);

const publicRoutes: RoutesI[] = [
  { path: ROUTE_PATHS.REGISTER, component: Register, layout: AuthRightLayout },
  { path: ROUTE_PATHS.LOGIN, component: Login, layout: AuthLayout },
  {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    component: ForgotPassword,
    layout: AuthLayout,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    component: ResetPassword,
    layout: AuthRightLayout,
  },
  { path: ROUTE_PATHS.REVIEW, component: Review, layout: null },
  { path: ROUTE_PATHS.NOT_FOUND, component: NotFound },
  // { path: "/login", component: "exmp", layout: "exmp" },
];

const privateRoutes: RoutesI[] = [
  { path: ROUTE_PATHS.DASHBOARD, component: Dashboard },
  { path: ROUTE_PATHS.PRESALE, component: PreSale },
  { path: ROUTE_PATHS.SOURCE, component: Source },
  { path: ROUTE_PATHS.CLASSE, component: Classe },
  { path: ROUTE_PATHS.EMPLOYEE, component: Employee },
  { path: ROUTE_PATHS.PAYROLL, component: Payroll },
  { path: ROUTE_PATHS.SALERESULT, component: SaleResult },
  { path: ROUTE_PATHS.STAFFTIMEKEEPING, component: StaffTimeKeeping },
  { path: ROUTE_PATHS.STUDENTATTENDANCE, component: StudentAttendance },
];

export { publicRoutes, privateRoutes };
