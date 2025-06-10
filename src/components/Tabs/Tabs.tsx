import { Children, ReactNode, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

interface TabsProps {
  tabs: string[];
  children: ReactNode[];
}

export const Tabs = ({ tabs, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const dynamicBorderRef = useRef<HTMLDivElement>(null);

  const activeTabIndex = useMemo(() => tabs.findIndex((tab) => tab === activeTab), [tabs, activeTab]);

  const calculateDynamicBorder = useCallback(() => {
    const currentTrigger = tabsRef.current[activeTabIndex];
    const parent = currentTrigger?.parentElement;
    if (!currentTrigger || !parent) return { width: 0, left: 0 };

    const triggerRect = currentTrigger?.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    return { width: triggerRect.width, left: triggerRect.left - parentRect.left };
  }, [activeTabIndex]);

  const moveDynamicBorder = (width = 0, left = 0) => {
    const borderElement = dynamicBorderRef.current;
    if (!borderElement) return;

    borderElement.style.width = `${width}px`;
    borderElement.style.left = `${left}px`;
  };

  const handleChangeTab = (id: string) => {
    setActiveTab(id);
  };

  const activeChild = Children.toArray(children).find(
    (child) =>
      isValidElement(child) &&
      typeof (child.props as HTMLDivElement).id === 'string' &&
      (child.props as HTMLDivElement).id.toLowerCase() === activeTab.toLowerCase(),
  );

  useEffect(() => {
    const { width, left } = calculateDynamicBorder();
    moveDynamicBorder(width, left);
  }, [calculateDynamicBorder]);

  useEffect(() => {
    if (activeChild === undefined) {
      console.warn('activeChild is undefined in Tabs.tsx. Check your tabs IDs');
    }
  }, [activeChild]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative flex w-full justify-center border-b align-bottom">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            ref={(ref) => void (tabsRef.current[i] = ref)}
            onClick={() => handleChangeTab(tab)}
            className={clsx(
              'hover:text-yellow-dark mb-[1px] cursor-pointer px-5 py-2.5 font-semibold uppercase transition-colors',
              activeTabIndex === i && 'text-yellow-light',
            )}
          >
            {tab}
          </button>
        ))}
        <div
          ref={dynamicBorderRef}
          className="bg-yellow-light absolute bottom-0 h-[1px] transition-all"
          style={{ left: 'calc(50% - 100px)', width: 100 }}
        ></div>
      </div>

      {activeChild}
    </div>
  );
};
