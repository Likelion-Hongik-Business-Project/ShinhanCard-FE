import { createBrowserRouter } from "react-router-dom";

import AssignedPage from "@/pages/assigned/AssignedPage";
import HomePage from "@/pages/home/HomePage";
import InquiryFormPage from "@/pages/inquiry/InquiryFormPage";
import InquiryDetailPage from "@/pages/inquiryDetail/InquiryDetailPage";
import LoginPage from "@/pages/login/LoginPage";
import MyQuestionsPage from "@/pages/myQuestions/MyQuestionsPage";
import NotFoundPage from "@/pages/notFound/NotFoundPage";
import ScrapPage from "@/pages/scrap/ScrapPage";
import SearchResultPage from "@/pages/searchResult/SearchResultPage";
import TeamBoardPage from "@/pages/teamBoard/TeamBoardPage";
import UserSpacePage from "@/pages/userSpace/UserSpacePage";
import Layout from "@/components/layout/Layout";
import RequireAuth from "@/components/router/RequireAuth";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },

  // 인증 필요한 영역
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "assigned", element: <AssignedPage /> },
          { path: "team/:team_id", element: <TeamBoardPage /> },
          { path: "my-questions", element: <MyQuestionsPage /> },
          { path: "inquiry/form", element: <InquiryFormPage /> },
          { path: "scrap", element: <ScrapPage /> },
          { path: "space/:userId", element: <UserSpacePage /> },
          {
            path: "teams/:team_id/inquiries/:inquiry_id",
            element: <InquiryDetailPage />,
          },
          { path: "result", element: <SearchResultPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
