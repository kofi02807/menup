import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRestaurant } from "../hooks/useRestaurant";
import MenuPreview from "../components/MenuPreview";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../assets/menuo-logo-zz-03.svg";

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

  const [draftItems, setDraftItems] = useState<MenuItem[]>([]);
  const [publishedItems, setPublishedItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

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

  /* ---------------- FETCH MENU ITEMS ---------------- */

  useEffect(() => {
    if (!restaurant) return;

    const fetchMenuItems = async () => {
      const { data: drafts } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("is_published", false)
        .order("created_at", { ascending: false });

      const { data: published } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("is_published", true);

      setDraftItems(drafts || []);
      setPublishedItems(published || []);
    };

    fetchMenuItems();
  }, [restaurant]);

  /* ---------------- GUARDS ---------------- */

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>No restaurant found for this account.</p>;

  const publicMenuUrl = `${window.location.origin}/menu/${restaurant.slug}`;

  /* ---------------- ADD MENU ITEM ---------------- */

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

    if (data) setDraftItems((prev) => [data, ...prev]);

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    });
  };

  /* ---------------- PUBLISH MENU ---------------- */

  const publishMenu = async () => {
    if (draftItems.length === 0) return;

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

    setDraftItems([]);
    alert("Menu published successfully 🎉");

    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_published", true);

    setPublishedItems(data || []);
  };

  /* ---------------- EDIT / HIDE LOGIC ---------------- */

  const toggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !item.is_available })
      .eq("id", item.id);

    if (error) return alert("Failed to update item");

    setPublishedItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, is_available: !i.is_available }
          : i
      )
    );
  };

  const saveEdit = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from("menu_items")
      .update({
        name: editingItem.name,
        price: editingItem.price,
        description: editingItem.description,
        category: editingItem.category,
      })
      .eq("id", editingItem.id);

    if (error) return alert("Failed to save changes");

    setPublishedItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id ? editingItem : i
      )
    );

    setEditingItem(null);
  };

  /* ---------------- COPY LINK ---------------- */

  const copyMenuLink = async () => {
    await navigator.clipboard.writeText(publicMenuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-4">
        <img src={logo} alt="Menup" style={{ height: 32 }} className="me-3" />
        <div>
          <h4 className="mb-0 text-primary">Menu Editor</h4>
          <small className="text-muted">
            Create, preview & manage your menu
          </small>
        </div>
      </div>

      {/* EDITOR */}
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <h5>Add Menu Item</h5>
          <form onSubmit={handleSubmit} className="card card-body shadow-sm">
            <input className="form-control mb-2" placeholder="Name" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea className="form-control mb-2" placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input type="number" className="form-control mb-2" placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input className="form-control mb-2" placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <button className="btn btn-success w-100">Add Item</button>
          </form>
        </div>

        <div className="col-lg-5">
          <h5>Draft Items</h5>
          <button className="btn btn-primary mb-2" onClick={publishMenu}>
            Publish Menu
          </button>

          <ul className="list-group shadow-sm">
            {draftItems.map((item) => (
              <li key={item.id} className="list-group-item">
                <strong>{item.name}</strong> — ₵{item.price}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PUBLISHED ITEMS */}
      <div className="mt-5">
        <h4>Published Menu Items</h4>
        <ul className="list-group">
          {publishedItems.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between">
              <div>
                <strong>{item.name}</strong> — ₵{item.price}
                {!item.is_available && (
                  <span className="badge bg-warning ms-2">Hidden</span>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingItem(item)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-warning" onClick={() => toggleAvailability(item)}>
                  {item.is_available ? "Hide" : "Show"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* PREVIEW + SHARE */}
      <div className="mt-5 pt-4 border-top text-center">
        <MenuPreview
          restaurantName={restaurant.name}
          restaurantDescription={restaurant.description}
          menuItems={publishedItems.filter((i) => i.is_available)}
        />

        <div className="mt-3 d-flex justify-content-center gap-4">
          <button className="btn btn-outline-primary" onClick={copyMenuLink}>
            {copied ? "Copied!" : "Copy Menu Link"}
          </button>
          <QRCodeCanvas value={publicMenuUrl} size={140} />
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Item</h5>
                <button className="btn-close" onClick={() => setEditingItem(null)} />
              </div>
              <div className="modal-body">
                <input className="form-control mb-2"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                />
                <input type="number" className="form-control mb-2"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: Number(e.target.value) })
                  }
                />
                <textarea className="form-control"
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditorPage;
