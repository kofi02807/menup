import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import MenuPreview from "../components/MenuPreview";

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
    <MenuPreview
      restaurantName={restaurant.name}
      restaurantDescription={restaurant.description}
      menuItems={menuItems}
    />
  );
};

export default PublicMenuPage;
