// SearchHeader 컴포넌트 Props
export interface SearchHeaderProps {
  query: string;
  total_count: number;
}

// RecentSearch 컴포넌트 Props
export interface RecentSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onKeywordClick?: (keyword: string) => void;
}

// RecommendSearch 컴포넌트 Props
export interface RecommendSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onCardClick?: (inquiry_id: number, title: string) => void;
}

// RecommendCard 컴포넌트 Props
export interface RecommendCardProps {
  title: string;
  group_name: string;
  division_name: string;
  team_name: string;
  query: string;
  isSelected: boolean;
  onClick: () => void;
}

// Keyword 컴포넌트 Props
export interface KeywordProps {
  keyword: string;
  onRemove?: (keyword: string) => void;
  onClick?: () => void;
  isRemoving?: boolean;
}

// 검색 결과 문의 아이템 타입
export interface SearchResultInquiry {
  inquiry_id: number;
  title: string;
  content_preview: string;
  inquiry_state: string;
  created_at: string;
  writer: {
    user_id: number;
    name: string;
    profile_image_url: string;
  };
  is_scrapped: boolean;
  group_name: string;
  division_name: string;
  team_name: string;
}

// 검색 결과 응답 데이터 타입
export interface SearchResultData {
  total_count: number;
  inquiries: SearchResultInquiry[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    has_next: boolean;
  };
}

// 검색 요청 타입
export interface SearchRequest {
  query: string;
  page: number;
  pageSize: number;
}

// 추천 검색 결과 아이템 타입
export interface RecommendSearchInquiry {
  inquiry_id: number;
  title: string;
  group_name: string;
  division_name: string;
  team_name: string;
}

// 추천 검색 결과 응답 데이터 타입
export interface RecommendSearchData {
  total_count: number;
  inquiries: RecommendSearchInquiry[];
}

// 최근 검색어 응답 데이터 타입
export interface RecentSearchData {
  keywords: string[];
}
