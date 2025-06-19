import Link from 'next/link';
import { DiscordIcon } from '../DiscordIcon';

export const Footer = () => {
  return (
    <footer className="bg-card flex w-full flex-col items-center justify-center gap-2 p-4">
      <Link
        href="http://discordapp.com/users/183315400858009600"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm"
      >
        <DiscordIcon />
        Agonys
      </Link>
      <span className="text-foreground-darker text-xs">
        This project is not affiliated with IdleMMO or Galahad Creative Ltd. All graphics used in this project are
        either the property of their respective owners or are used under appropriate license or permission.
      </span>
    </footer>
  );
};
