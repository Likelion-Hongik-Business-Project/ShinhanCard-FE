import { BrowserRouter, Route, Routes } from "react-router-dom";

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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/assigned" element={<AssignedPage />} />
          <Route path="/team/:id" element={<TeamBoardPage />} />
          <Route path="/my-questions" element={<MyQuestionsPage />} />
          <Route path="/inquiry/form" element={<InquiryFormPage />} />
          <Route path="/scrap" element={<ScrapPage />} />
          <Route path="/space/:username" element={<UserSpacePage />} />
          {/* 👆 :username은 api에 따라 변경 가능 */}
          <Route path="/inquiries/:id" element={<InquiryDetailPage />} />
          <Route path="/result" element={<SearchResultPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
