interface PlayersCardProps {
  id: string;
}
export const SummaryCard = ({ id }: PlayersCardProps) => {
  return (
    <div id={id} className="bg-card flex flex-col items-center justify-center gap-4 rounded-md p-40 text-5xl font-bold">
      Coming Soon
    </div>
  );
};
