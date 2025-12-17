// src/pages/PublicMenuPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.png";

type PublicMenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  is_available: boolean;
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
};

const PublicMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<PublicMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(menuItems.map((i) => i.category))),
    [menuItems]
  );

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      if (!restaurantId) {
        setError("No restaurant specified.");
        setLoading(false);
        return;
      }

      const slug = restaurantId.trim().toLowerCase();
      console.log("Slug from URL:", slug);

      // 1️⃣ Fetch restaurant
      const { data: restaurantData, error: restaurantError } =
        await supabase
          .from("restaurants")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

      console.log("Restaurant data:", restaurantData);
      console.log("Restaurant error:", restaurantError);

      if (!restaurantData) {
        setError("Restaurant not found.");
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData);

      // 2️⃣ Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (itemsError) {
        console.error(itemsError);
        setError("Could not load menu items.");
        setLoading(false);
        return;
      }

      setMenuItems(itemsData || []);
      setLoading(false);
    };

    fetchMenu();
  }, [restaurantId]);

  if (loading) {
    return <p className="text-center mt-4">Loading menu...</p>;
  }

  if (error) {
    return <p className="text-center text-danger mt-4">{error}</p>;
  }

  if (!restaurant) {
    return (
      <p className="text-center mt-4">
        Restaurant not found. Please check the link.
      </p>
    );
  }

  return (
    <div className="pb-4">
      {/* LOGO */}
      <div className="text-center mb-3">
        <img
          src={restaurant.logo_url || logo}
          alt={`${restaurant.name} Logo`}
          style={{ height: "70px", objectFit: "contain" }}
        />
      </div>

      <header className="mb-4 text-center">
        <h1 className="mb-1 text-capitalize">{restaurant.name}</h1>
        <p className="text-muted mb-0">Digital Menu</p>
      </header>

      {categories.length === 0 && (
        <p className="text-center text-muted">
          No menu items yet. Please check back later.
        </p>
      )}

      {categories.map((cat) => (
        <section key={cat} className="mb-4">
          <h4 className="border-bottom pb-1 mb-3">{cat}</h4>

          {menuItems
            .filter((item) => item.category === cat)
            .map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-start mb-3"
              >
                <div>
                  <div className="fw-semibold">
                    {item.name}
                    {!item.is_available && (
                      <span className="badge bg-secondary ms-2">
                        Unavailable
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <small className="text-muted">{item.description}</small>
                  )}
                </div>

                <div className="ms-3 fw-semibold">
                  GHS {Number(item.price).toFixed(2)}
                </div>
              </div>
            ))}
        </section>
      ))}

      <p className="text-center text-muted small mt-4">
        Powered by MenuP – scan, order, enjoy.
      </p>
    </div>
  );
};

export default PublicMenuPage;
