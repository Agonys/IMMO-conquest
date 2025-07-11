import { LucideIcon } from 'lucide-react';

interface GuildsStatisticCardProps {
  Icon: LucideIcon;
  data: string | number;
  description: string;
}
export const GuildsStatisticCard = ({ Icon, data, description }: GuildsStatisticCardProps) => {
  return (
    <div className="bg-card flex items-center gap-2 rounded-md p-4">
      <div className="bg-card-border flex h-8 w-8 items-center justify-center gap-2 rounded-md p-2">
        <Icon size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-foreground text-xl font-bold">{data}</span>
        <span className="text-foreground-darker text-xs">{description}</span>
      </div>
    </div>
  );
};
