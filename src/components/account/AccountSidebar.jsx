import { NavLink } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  Shield,
} from "lucide-react";

const menu = [
  { label: "My Profile", tab: "profile", icon: User },
  { label: "My Orders", tab: "orders", icon: Package },
  { label: "Wishlist", tab: "wishlist", icon: Heart },
  { label: "Addresses", tab: "addresses", icon: MapPin },
  { label: "Security", tab: "security", icon: Shield },
];

export default function AccountSidebar({ activeTab }) {
  return (
    <aside className="bg-white rounded-2xl shadow p-4 h-fit">

      <nav className="space-y-1">
        {menu.map(({ label, tab, icon: Icon }) => (
          <NavLink
            key={tab}
            to={`/account?tab=${tab}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-emerald-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
