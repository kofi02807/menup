// src/pages/MenuEditorPage.tsx

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRestaurant } from "../hooks/useRestaurant";

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  is_available: boolean;
  is_published: boolean;
};

const MenuEditorPage = () => {
  const { restaurant, loading } = useRestaurant();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });

  // 🔹 Fetch ONLY draft menu items
  useEffect(() => {
    if (!restaurant) return;

    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("is_published", false)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMenuItems(data);
      }
    };

    fetchMenuItems();
  }, [restaurant]);

  // 🔹 Guards
  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>No restaurant found for this account.</p>;

  // 🔹 Add menu item (draft)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: restaurant.id,
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        category: form.category || "Uncategorized",
        is_available: form.isAvailable,
        is_published: false,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data) {
      setMenuItems((prev) => [data, ...prev]);
    }

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    });
  };

  // 🔹 Publish ALL draft items
  const publishMenu = async () => {
    if (!restaurant || menuItems.length === 0) return;

    setPublishing(true);

    const { error } = await supabase
      .from("menu_items")
      .update({ is_published: true })
      .eq("restaurant_id", restaurant.id)
      .eq("is_published", false);

    setPublishing(false);

    if (error) {
      alert("Failed to publish menu");
      return;
    }

    setMenuItems([]);
    alert("Menu published successfully 🎉");
  };

  // 🔹 Copy public menu link
  const copyMenuLink = async () => {
    if (!restaurant) return;

    const url = `${window.location.origin}/menu/${restaurant.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy link");
    }
  };

  return (
    <div className="row">
      {/* ADD MENU ITEM */}
      <div className="col-lg-6">
        <h3 className="mb-3">Add Menu Item</h3>

        <form onSubmit={handleSubmit} className="card card-body">
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price (GHS) *</label>
            <input
              type="number"
              className="form-control"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              className="form-control"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              placeholder="Starters, Mains, Drinks..."
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
              id="availableCheck"
            />
            <label className="form-check-label" htmlFor="availableCheck">
              Available
            </label>
          </div>

          <button
            className="btn btn-success w-100"
            disabled={saving}
          >
            {saving ? "Saving..." : "Add Item"}
          </button>

          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
      </div>

      {/* DRAFT MENU ITEMS */}
      <div className="col-lg-6">
        <h3 className="mb-3">Draft Menu Items</h3>

        <div className="d-flex gap-2 mb-3">
          <button
            className="btn btn-primary"
            onClick={publishMenu}
            disabled={publishing || menuItems.length === 0}
          >
            {publishing ? "Publishing..." : "Publish Menu"}
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={copyMenuLink}
          >
            {copied ? "Copied!" : "Copy Menu Link"}
          </button>
        </div>

        {menuItems.length === 0 && (
          <p className="text-muted">No draft items.</p>
        )}

        <ul className="list-group">
          {menuItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>{item.name}</strong>
                <span>GHS {item.price}</span>
              </div>

              {item.description && (
                <small className="text-muted d-block">
                  {item.description}
                </small>
              )}

              <small className="text-muted">
                {item.category || "Uncategorized"} •{" "}
                {item.is_available ? "Available" : "Unavailable"}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuEditorPage;
