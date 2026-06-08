import { createContext, useContext, type ReactNode } from "react";

type NameMap = Record<string, string>;

const PricingNamesContext = createContext<NameMap>({});

export const PricingNamesProvider = ({
  names,
  children,
}: {
  names: NameMap;
  children: ReactNode;
}) => (
  <PricingNamesContext.Provider value={names}>{children}</PricingNamesContext.Provider>
);

export const usePricingName = (original: string) => {
  const map = useContext(PricingNamesContext);
  return map[original] ?? original;
};

export const PricingName = ({ name }: { name: string }) => <>{usePricingName(name)}</>;
