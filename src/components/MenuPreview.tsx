import { useMemo } from "react";

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  is_special?: boolean;
};

const CATEGORY_ORDER = [
  "Today's Special",
  "Mains",
  "Pastries",
  "Pizza",
  "Desserts",
  "Drinks",
  "Beverages",
];

type Props = {
  restaurantName: string;
  restaurantDescription?: string | null;
  menuItems: MenuItem[];
};

const MenuPreview = ({
  restaurantName,
  restaurantDescription,
  menuItems,
}: Props) => {
  // Group items by category
  const groupedMenu = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};

    menuItems.forEach((item) => {
      const category = item.is_special
        ? "Today's Special"
        : item.category || "Others";

      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });

    return groups;
  }, [menuItems]);

  // Order categories (default first, then custom)
  const orderedCategories = useMemo(() => {
    const existing = Object.keys(groupedMenu);

    const ordered = CATEGORY_ORDER.filter((cat) =>
      existing.includes(cat)
    );

    const custom = existing.filter(
      (cat) => !CATEGORY_ORDER.includes(cat)
    );

    return [...ordered, ...custom];
  }, [groupedMenu]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      {/* Header */}
      <h1 style={{ textAlign: "center", marginBottom: 4 }}>
        {restaurantName}
      </h1>

      {restaurantDescription && (
        <p style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
          {restaurantDescription}
        </p>
      )}

      {/* Menu */}
      {orderedCategories.map((category) => (
        <div key={category} style={{ marginBottom: 32 }}>
          <h2
            style={{
              borderBottom: "2px solid #eee",
              paddingBottom: 6,
              marginBottom: 12,
              fontSize: 20,
            }}
          >
            {category}
          </h2>

          {groupedMenu[category].map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {item.name}
                </p>
                {item.description && (
                  <small style={{ color: "#777" }}>
                    {item.description}
                  </small>
                )}
              </div>

              <p style={{ fontWeight: 600 }}>₵{item.price}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuPreview;
