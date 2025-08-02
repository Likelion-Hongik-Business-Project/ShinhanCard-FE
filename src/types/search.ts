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

// 검색 결과 API 응답 타입
export interface SearchResultResponse {
  is_success: boolean;
  message: string;
  code: number;
  result: {
    total_count: number;
    inquiries: SearchResultInquiry[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      has_next: boolean;
    };
  };
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

// 추천 검색 결과 API 응답 타입
export interface RecommendSearchResponse {
  total_count: number;
  results: RecommendSearchResult[];
}

// 추천 검색 결과 아이템 타입
export interface RecommendSearchResult {
  inquiry_id: number;
  title: string;
  group_name: string;
  division_name: string;
  team_name: string;
}

// 최근 검색어 API 응답 타입
export interface RecentSearchResponse {
  keywords: string[];
}
