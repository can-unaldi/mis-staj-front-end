/* eslint-disable react/jsx-key */
import React, { lazy } from "react";
import AuthorizedRoute from "base-shell/lib/components/AuthorizedRoute";
import UnauthorizedRoute from "base-shell/lib/components/UnauthorizedRoute";
import AddStudent from "pages/admin/AddStudent";
import AddFinishedInternship from "pages/admin/AddFinishedInternship";

const CompanyApproval = lazy(() => import("../pages/student/CompanyApproval"));
const SignIn = lazy(() => import("../pages/SignIn/SignIn"));
const Internships = lazy(() => import("../pages/Internships/Internships"));
const InternEvaluation = lazy(() =>
  import("../pages/student/InternEvaluation")
);
const CompanyEvaluation = lazy(() =>
  import("../pages/student/CompanyEvaluation")
);
const ApprovedInterships = lazy(() =>
  import("../pages/manager/ApprovedInterships")
);
const OldInterships = lazy(() => import("../pages/student/OldInterships"));
const AddUser = lazy(() => import("../pages/admin/AddUser"));
const UpdateUser = lazy(() => import("../pages/admin/UpdateUser"));
const UpdateStudent = lazy(() => import("../pages/admin/UpdateStudent"));
const FinishedInternships = lazy(() =>
  import("../pages/admin/FinishedInternships")
);
const SignUp = lazy(() => import("../pages/SignUp/SignUp"));
const PasswordReset = lazy(() =>
  import("../pages/PasswordReset/PasswordReset")
);
const About = lazy(() => import("../pages/About"));
const Home = lazy(() => import("../pages/Home/Home"));
const InternshipApplicationProcess = lazy(() =>
  import("../pages/student/InternshipApplicationProcess")
);
const ApplicationForm = lazy(() => import("../pages/student/ApplicationForm"));
const ApplicationDetails = lazy(() =>
  import("../pages/student/ApplicationDetails")
);
const MyAccount = lazy(() => import("../pages/MyAccount/MyAccount"));

const routes = [
  {
    path: "/company-approval/:applicationId",
    exact: true,
    element: <CompanyApproval />,
  },
  {
    path: "/intern-evaluation/:internshipId",
    exact: true,
    element: <InternEvaluation />,
  },
  {
    path: "/signin",
    exact: true,
    element: (
      <UnauthorizedRoute>
        <SignIn redirectTo="/home" />
      </UnauthorizedRoute>
    ),
  },
  {
    path: "/signup",
    exact: true,
    element: (
      <UnauthorizedRoute>
        <SignUp redirectTo="/home" />
      </UnauthorizedRoute>
    ),
  },
  {
    path: "/password-reset",
    exact: true,
    element: (
      <UnauthorizedRoute>
        <PasswordReset redirectTo="/home" />
      </UnauthorizedRoute>
    ),
  },
  {
    path: "/about",
    exact: true,
    element: <About />,
  },
  {
    path: "/my_account",
    exact: true,
    element: (
      <AuthorizedRoute>
        <MyAccount />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/application-process",
    exact: true,
    element: (
      <AuthorizedRoute>
        <InternshipApplicationProcess />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/application-process/application-form",
    exact: true,
    element: (
      <AuthorizedRoute>
        <ApplicationForm />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/application-details/:applicationId",
    exact: true,
    element: (
      <AuthorizedRoute>
        <ApplicationDetails />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/internships",
    exact: true,
    element: (
      <AuthorizedRoute>
        <Internships />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/approved-internships",
    exact: true,
    element: (
      <AuthorizedRoute>
        <ApprovedInterships />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/admin/add-user",
    exact: true,
    element: (
      <AuthorizedRoute>
        <AddUser />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/admin/add-finished-internship",
    exact: true,
    element: (
      <AuthorizedRoute>
        <AddFinishedInternship />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/admin/add-student",
    exact: true,
    element: (
      <AuthorizedRoute>
        <AddStudent />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/admin/update-user/:userId",
    exact: true,
    element: (
      <AuthorizedRoute>
        <UpdateUser />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/admin/update-student/:userId",
    exact: true,
    element: (
      <AuthorizedRoute>
        <UpdateStudent />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/old-internships",
    exact: true,
    element: (
      <AuthorizedRoute>
        <OldInterships />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/admin/finished-internships",
    exact: true,
    element: (
      <AuthorizedRoute>
        <FinishedInternships />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/internships/company-evaluation/:internshipId",
    exact: true,
    element: (
      <AuthorizedRoute>
        <CompanyEvaluation />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/home",
    exact: true,
    element: (
      <AuthorizedRoute>
        <Home />
      </AuthorizedRoute>
    ),
  },
];

export default routes;
