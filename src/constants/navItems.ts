
import {
    BriefcaseIcon as BriefcaseOutlineIcon,
    BookOpenIcon as BookOpenOutlineIcon,
    HomeIcon as HomeOutlineIcon,
    MapIcon as MapOutlineIcon,
    UserIcon as UserOutlineIcon,
} from "@heroicons/react/24/outline";
import {
    BriefcaseIcon as BriefcaseSolidIcon,
    BookOpenIcon as BookOpenSolidIcon,
    HomeIcon as HomeSolidIcon,
    MapIcon as MapSolidIcon,
    UserIcon as UserSolidIcon,
} from "@heroicons/react/24/solid";

export type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const NAV_ITEMS: NavItem[] = [
    { label: "Inicio", href: "/", icon: HomeOutlineIcon, activeIcon: HomeSolidIcon },
    { label: "Blog", href: "/blog", icon: BookOpenOutlineIcon, activeIcon: BookOpenSolidIcon },
    { label: "Viajes", href: "/travels", icon: MapOutlineIcon, activeIcon: MapSolidIcon },
    { label: "Proyectos", href: "/projects", icon: BriefcaseOutlineIcon, activeIcon: BriefcaseSolidIcon },
    { label: "Perfil", href: "/profile", icon: UserOutlineIcon, activeIcon: UserSolidIcon },
];