# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 최근 검색어 기능

이 프로젝트는 최근 검색어 조회 및 삭제 기능을 포함하고 있습니다.

### 현재 상태

- **Mock 데이터 사용 중**: 백엔드 API 구현 및 배포가 완료될 때까지 Mock 데이터를 사용합니다.
- **UI 완성**: 실제 API와 동일한 사용자 경험을 제공합니다.

### 기능

- 최근 검색어 조회 (GET /search/inquiries/recent)
- 최근 검색어 삭제 (DELETE /search/inquiries/recent)
- 최근 검색어 추가 (POST /search/inquiries/recent)

### 백엔드 API 완료 시 전환 방법

1. **RecentSearch.tsx**에서 주석 처리된 코드를 활성화:

   ```tsx
   // 주석 해제
   import {
     useDeleteRecentSearchKeyword,
     useRecentSearchKeywords,
   } from "@/hooks/useSearch";

   // Mock 데이터 관련 코드 주석 처리
   // const [keywords, setKeywords] = useState<string[]>([]);
   ```

2. **Header.tsx**에서 주석 처리된 코드를 활성화:

   ```tsx
   // 주석 해제
   import { useAddRecentSearchKeyword } from "@/hooks/useSearch";
   ```

3. 환경 변수 설정:
   ```env
   REACT_APP_API_URL=http://your-api-url.com/api
   ```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 설정 (백엔드 API 완료 시 설정)
REACT_APP_API_URL=http://localhost:8080/api

# 개발 환경 설정
NODE_ENV=development
```

### 사용된 기술

- React Query (TanStack Query) - 서버 상태 관리
- Axios - HTTP 클라이언트
- TypeScript - 타입 안정성

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
