import { Navigate, Route } from "react-router-dom";
import PageTitle from "@/components/utilities/PageTitle";
import IamDashboardPage from "@/pages/iam/dashboard/IamDashboardPage";
import UsersPage from "@/pages/iam/users/UsersPage";
import FunctionsPage from "@/pages/iam/functions/FunctionsPage";
import FunctionDetailPage from "@/pages/iam/functions/FunctionDetailPage";
import PermissionsPage from "@/pages/iam/permissions/PermissionsPage";
import SessionsPage from "@/pages/iam/sessions/SessionsPage";
import MfaSecurityPage from "@/pages/iam/mfa/MfaSecurityPage";
import AuditLogsPage from "@/pages/iam/audit/AuditLogsPage";
import AccessReviewsPage from "@/pages/iam/access-reviews/AccessReviewsPage";
import PoliciesPage from "@/pages/iam/policies/PoliciesPage";

export const iamRouteItems = {
  dashboard: {
    path: "/user-management/dashboard",
    name: "Identity & Security",
    component: IamDashboardPage,
  },
  users: {
    path: "/user-management/users",
    name: "Users",
    component: UsersPage,
  },
  functions: {
    path: "/user-management/functions",
    name: "Functions",
    component: FunctionsPage,
  },
  functionDetail: {
    path: "/user-management/functions/:id",
    name: "Function Detail",
    component: FunctionDetailPage,
  },
  permissions: {
    path: "/user-management/permissions",
    name: "Permissions",
    component: PermissionsPage,
  },
  sessions: {
    path: "/user-management/sessions",
    name: "Sessions",
    component: SessionsPage,
  },
  mfa: {
    path: "/user-management/mfa",
    name: "MFA & Security",
    component: MfaSecurityPage,
  },
  audit: {
    path: "/user-management/audit",
    name: "Audit Logs",
    component: AuditLogsPage,
  },
  accessReviews: {
    path: "/user-management/access-reviews",
    name: "Access Reviews",
    component: AccessReviewsPage,
  },
  policies: {
    path: "/user-management/policies",
    name: "Policies",
    component: PoliciesPage,
  },
};

const iamRoutes = [
  <Route
    key="iam-redirect"
    path="/user-management"
    element={<Navigate to="/user-management/dashboard" replace />}
  />,
  ...Object.values(iamRouteItems).map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <>
          <PageTitle title={route.name} />
          <route.component />
        </>
      }
    />
  )),
];

export default iamRoutes;
