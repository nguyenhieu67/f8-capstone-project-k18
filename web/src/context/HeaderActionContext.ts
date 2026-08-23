import type { HeaderAction } from "@/layouts/Default/Header";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from "react";

interface HeaderActionContextValue {
  primaryAction: HeaderAction | undefined;
  setPrimaryAction: (action: HeaderAction | undefined) => void;
}

const HeaderActionContext = createContext<HeaderActionContextValue>({
  primaryAction: undefined,
  setPrimaryAction: () => {},
});

export function HeaderActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primaryAction, setPrimaryAction] = useState<HeaderAction | undefined>(
    undefined,
  );

  return createElement(
    HeaderActionContext.Provider,
    { value: { primaryAction, setPrimaryAction } },
    children,
  );
}

export const useHeaderActionContext = () => useContext(HeaderActionContext);

//  * Ví dụ trong emxpPage.tsx:
//  *   useHeaderAction({
//  *     label: t("dashboardPage.addLead"),
//  *     onClick: () => setModalOpen(true),
//  *   }, [t]);

export function useHeaderAction(
  action: HeaderAction | undefined,
  deps: React.DependencyList = [],
) {
  const { setPrimaryAction } = useHeaderActionContext();

  useEffect(() => {
    setPrimaryAction(action);
    return () => setPrimaryAction(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
