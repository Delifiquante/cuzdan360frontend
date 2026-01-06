'use client';

import { useRouter } from 'next/navigation';
import {
  AreaChart,
  ArrowLeftRight,

  FileText,
  Landmark,
  LayoutDashboard,
  User,
} from 'lucide-react';
import Dock, { type DockItemData } from '@/components/ui/dock';

export function AppDock() {
  const router = useRouter();

  const menuItems: DockItemData[] = [
    {
      onClick: () => router.push('/dashboard'),
      label: 'Panel',
      icon: <LayoutDashboard className="text-primary" />,
    },
    {
      onClick: () => router.push('/dashboard/transactions'),
      label: 'İşlemler',
      icon: <ArrowLeftRight className="text-primary" />,
    },
    {
      onClick: () => router.push('/dashboard/investments'),
      label: 'Varlıklarım',
      icon: <AreaChart className="text-primary" />,
    },
    {
      onClick: () => router.push('/dashboard/debts'),
      label: 'Borçlar',
      icon: <Landmark className="text-primary" />,
    },
    {
      onClick: () => router.push('/dashboard/reports'),
      label: 'Raporlar',
      icon: <FileText className="text-primary" />,
    },

    {
      onClick: () => router.push('/dashboard/account'),
      label: 'Hesap',
      icon: <User className="text-primary" />,
    },
  ];

  return (
    <div className="fixed h-screen flex items-center z-50">
      <Dock items={menuItems} />
    </div>
  );
}
