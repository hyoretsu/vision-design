"use client";
import { type AppStore, createAppStore } from "@lib/storage";
import { type PropsWithChildren, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type AppStoreApi = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

export const AppStoreProvider = ({ children }: PropsWithChildren) => {
	const storeRef = useRef<AppStoreApi>(null);

	if (!storeRef.current) {
		storeRef.current = createAppStore();
	}

	return <AppStoreContext.Provider value={storeRef.current}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
	const appStoreContext = useContext(AppStoreContext);

	if (!appStoreContext) {
		throw new Error("useAppStore must be used within <AppStoreProvider />");
	}

	return useStore(appStoreContext, selector);
};
