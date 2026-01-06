import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import MenuPreview from "../components/MenuPreview";
import { QRCodeCanvas } from "qrcode.react";

const DashboardPage = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      // 1️⃣ Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      // 2️⃣ Get restaurant for this user
      const { data: restaurantData } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!restaurantData) {
        setError("No restaurant found for this account");
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData);

      // 3️⃣ Get menu items
      const { data: items } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantData.id)
        .eq("is_available", true);

      setMenuItems(items || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard…</p>;
  if (error) return <p>{error}</p>;

  const publicMenuUrl = `${window.location.origin}/menu/${restaurant.slug}`;

  return (
    <div>
      <h2 className="mb-3">Dashboard</h2>
      <p className="text-muted">
        Welcome! From here you can edit your menu and share it with customers.
      </p>

      {/* TOP CARDS */}
      <div className="row g-3 mb-4">
        {/* MENU EDITOR */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Menu Editor</h5>
              <p className="card-text flex-grow-1">
                Add, remove, and update items on your live menu.
              </p>
              <Link to="/editor" className="btn btn-primary mt-auto">
                Open Editor
              </Link>
            </div>
          </div>
        </div>

        {/* PUBLIC LINK */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Public Menu Link</h5>
              <p className="card-text">
                Share this link with customers or put it behind a QR code.
              </p>

              <code className="small mb-2">{publicMenuUrl}</code>

              <button
                className="btn btn-outline-secondary mb-2"
                onClick={() => {
                  navigator.clipboard.writeText(publicMenuUrl);
                  alert("Menu link copied!");
                }}
              >
                Copy Menu Link
              </button>

              <Link
                to={`/menu/${restaurant.slug}`}
                className="btn btn-outline-primary mt-auto"
                target="_blank"
              >
                Preview Menu
              </Link>
            </div>
          </div>
        </div>

        {/* QR CODE */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column align-items-center">
              <h5 className="card-title">QR Code</h5>

              <QRCodeCanvas value={publicMenuUrl} size={160} />

              <p className="text-muted small mt-2 text-center">
                Customers can scan this to view your menu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MENU PREVIEW */}
      <div className="mt-5">
        <h4 className="mb-3">Menu Preview</h4>

        <MenuPreview
          restaurantName={restaurant.name}
          restaurantDescription={restaurant.description}
          menuItems={menuItems}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
