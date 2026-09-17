import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarCheck, Users, IndianRupee, MoreHorizontal } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/staff', label: 'Staff', icon: Users },
    { href: '/payments', label: 'Payments', icon: IndianRupee },
    { href: '/more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="flex-none flex border-t border-line-soft bg-paper-card pt-2 pb-[calc(16px+env(safe-area-inset-bottom))] px-1.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-[3px] py-1.5 px-0.5 rounded-[10px] ${
              isActive ? 'text-marigold-deep' : 'text-ink-faint'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10.5px] font-bold tracking-[0.2px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
