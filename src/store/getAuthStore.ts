import { useAuthStore } from "@/store/useAuthStore";

export const getAuthStore = () => useAuthStore.getState();
