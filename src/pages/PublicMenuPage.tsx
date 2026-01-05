import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const CATEGORY_ORDER = [
  "Today's Special",
  "Mains",
  "Pastries",
  "Pizza",
  "Desserts",
  "Drinks",
  "Beverages",
];

const PublicMenuPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      const { data: restaurantData } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!restaurantData) {
        setError("Restaurant not found");
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData);

      const { data: items } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .eq("is_available", true);

      setMenuItems(items || []);
      setLoading(false);
    };

    fetchMenu();
  }, [slug]);

  // 🔹 Group menu items by category
  const groupedMenu = useMemo(() => {
    const groups: Record<string, any[]> = {};

    menuItems.forEach((item) => {
      const category = item.is_special
        ? "Today's Special"
        : item.category || "Others";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
    });

    return groups;
  }, [menuItems]);

  // 🔹 Final category list (ordered + custom)
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

  if (loading) return <p style={{ padding: 16 }}>Loading menu…</p>;
  if (error) return <p style={{ padding: 16 }}>{error}</p>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      {/* Header */}
      <h1 style={{ textAlign: "center", marginBottom: 4 }}>
        {restaurant.name}
      </h1>
      {restaurant.description && (
        <p style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
          {restaurant.description}
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

export default PublicMenuPage;
