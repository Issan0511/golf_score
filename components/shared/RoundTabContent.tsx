import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface RoundTabContentProps {
  value: string;
  children: ReactNode;
}

export function RoundTabContent({ value, children }: RoundTabContentProps) {
  return (
    <TabsContent
      value={value}
      className="h-full flex-col border-0 data-[state=active]:flex"
    >
      {children}
    </TabsContent>
  );
}
