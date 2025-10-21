import CollapsibleNavSection from "./CollapsibleNavSection";
import StaticNavSection from "./StaticNavSection";
import { navItems } from "./navItemsData";
import { useAuth } from "../../contexts/AuthContext";

// Helper function to check if the user has any of the required permissions
const hasPermission = (userPermissions, requiredPermissions) => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // No permissions required, so show the item
  }
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
};

// New helper function to check if the user's role is allowed
const hasRole = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles specified, so allow by default
  }
  return requiredRoles.includes(userRole);
};

export default function SidebarContent() {
  const { getPermissions, getRole } = useAuth();
  const permissions = getPermissions();
  const userRole = getRole(); // <-- Get the user's role

  // Filter the top-level nav items based on both roles and permissions
  const filteredNavItems = navItems.filter(
    (item) =>
      hasRole(userRole, item.roles) &&
      hasPermission(permissions, item.permission)
  );

  return (
    <div className="flex flex-col gap-2">
      {filteredNavItems.map((item, index) => {
        if (item.type === "collapsible") {
          // For collapsible items, filter the sub-links based on both roles and permissions
          const filteredLinks = item.links.filter(
            (link) =>
              hasRole(userRole, link.roles) &&
              hasPermission(permissions, link.permission)
          );

          // Only render the collapsible section if there are any visible links inside
          if (filteredLinks.length > 0) {
            return (
              <CollapsibleNavSection
                key={index}
                icon={item.icon}
                title={item.title}
                links={filteredLinks} // Pass the filtered links to the component
              />
            );
          }
          return null; // Don't render the section if no sub-links are visible
        } else {
          // Static items are already filtered by the `filteredNavItems` array
          return (
            <StaticNavSection
              key={index}
              icon={item.icon}
              title={item.title}
              to={item.to}
            />
          );
        }
      })}
    </div>
  );
}
