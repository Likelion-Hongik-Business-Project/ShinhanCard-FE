import { UserRole } from "@/constants/userRoles";

// 통합된 문의 타입 (mock 데이터와 컴포넌트에서 공통 사용)
export interface InquiryData {
  inquiry_id: number;
  title: string;
  content_preview: string;
  inquiry_state: string;
  created_at: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url?: string;
  };
  assignees?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  references?: Array<{
    user_id: number;
    name: string;
    profile_image_url?: string;
  }>;
  is_scrapped: boolean;
  confirmed_assignees: number[];
  answers_count: number;
  last_notification_sent?: string;

  // 테스트용 필드들 (mock 데이터에서만 사용, 컴포넌트에서는 옵셔널)
  test_scenario?: string;
  test_user_role?: "default" | "assignee" | "writer" | "admin";
  test_current_user_id?: number;
}

// InquiryCard 컴포넌트 Props
export interface InquiryCardProps {
  inquiry: InquiryData;
  userRole?: UserRole;
  currentUserId?: number;
}
