import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import MenuPreview from "../components/MenuPreview";
import menupLogo from "../assets/menuo-logo-zz-03.svg";

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

  if (loading) return <p style={{ padding: 16 }}>Loading menu…</p>;
  if (error) return <p style={{ padding: 16 }}>{error}</p>;

  return (
    <div>
      <MenuPreview
        restaurantName={restaurant.name}
        restaurantDescription={restaurant.description}
        menuItems={menuItems}
      />

      {/* MENUP FOOTER */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: "1px solid #eee",
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        <small style={{ display: "block", marginBottom: 6 }}>
          Made with
        </small>

        <img
          src={menupLogo}
          alt="Menup"
          style={{ height: 18 }}
        />
      </div>
    </div>
  );
};

export default PublicMenuPage;
