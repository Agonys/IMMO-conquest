import {
  Children,
  ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils';

interface TabsProps {
  tabs: string[];
  children: ReactNode[];
}

export const Tabs = ({ tabs, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const dynamicBorderRef = useRef<HTMLDivElement>(null);

  const activeTabIndex = useMemo(() => tabs.findIndex((tab) => tab === activeTab), [tabs, activeTab]);

  const calculateDynamicBorder = useCallback(() => {
    const currentTrigger = tabsRef.current[activeTabIndex];
    const parent = currentTrigger?.parentElement;
    if (!currentTrigger || !parent) return { width: 0, left: 0 };

    const triggerRect = currentTrigger.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    return {
      width: triggerRect.width,
      left: triggerRect.left - parentRect.left,
    };
  }, [activeTabIndex]);

  const recalculate = useCallback(() => {
    const { width, left } = calculateDynamicBorder();
    const borderElement = dynamicBorderRef.current;
    if (borderElement) {
      borderElement.style.width = `${width}px`;
      borderElement.style.left = `${left}px`;
    }
  }, [calculateDynamicBorder]);

  useLayoutEffect(() => {
    recalculate();
    window.addEventListener('resize', recalculate);
    return () => window.removeEventListener('resize', recalculate);
  }, [recalculate, activeTabIndex]);

  const activeChild = useMemo(
    () =>
      Children.toArray(children).find(
        (child) =>
          isValidElement(child) &&
          typeof (child.props as HTMLDivElement).id === 'string' &&
          (child.props as HTMLDivElement).id.toLowerCase() === activeTab.toLowerCase(),
      ),
    [children, activeTab],
  );

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
            onClick={() => setActiveTab(tab)}
            className={cn(
              'hover:text-yellow-dark mb-[1px] cursor-pointer px-5 py-2.5 font-semibold uppercase transition-colors',
              activeTabIndex === i && 'text-yellow-light hover:text-yellow-light',
            )}
          >
            {tab}
          </button>
        ))}
        <div
          ref={dynamicBorderRef}
          className="bg-yellow-light absolute bottom-0 h-[2px] transition-all duration-300"
          style={{ left: 0, width: 0 }}
        ></div>
      </div>
      {activeChild}
    </div>
  );
};
