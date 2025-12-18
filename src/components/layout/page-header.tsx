
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/20 bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-1 text-primary">
        <div className="relative">
          {/* Dark circular background for light theme */}
          <div className="absolute inset-0 rounded-full bg-gray-800 dark:bg-transparent" />
          <Image
            src="/czdn360logo.jpeg"
            alt="Cüzdan360 Logo"
            width={70}
            height={70}
            className="relative z-10 rounded-full"
          />
        </div>
        <span className="text-xl font-bold">Cüzdan360</span>
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl ml-4">{title}</h1>
      </div>
    </header>
  );
}
