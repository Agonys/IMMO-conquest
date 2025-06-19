import Image from 'next/image';
import { Container } from '@/components/Container';

export const Navbar = () => {
  return (
    <header className="bg-card border-b">
      <Container className="mx-auto items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <h1 className="text-yellow-light text-xl font-bold md:text-3xl">IdleMMO Conquest</h1>
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        {/* <Settings className="absolute right-4" /> */}
      </Container>
    </header>
  );
};
