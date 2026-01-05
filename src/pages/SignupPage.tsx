import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRestaurant } from "../hooks/useRestaurant";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_available: boolean;
};

const MenuEditorPage = () => {
  const { restaurant, loading: restaurantLoading } = useRestaurant();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });

  const [error, setError] = useState<string | null>(null);

  /* 🔹 FETCH MENU ITEMS (THIS WAS MISSING / TOO EARLY) */
  useEffect(() => {
    if (!restaurant) return;

    const fetchMenuItems = async () => {
      setLoadingItems(true);

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Failed to load menu items");
      } else {
        setItems(data || []);
      }

      setLoadingItems(false);
    };

    fetchMenuItems();
  }, [restaurant]);

  if (restaurantLoading) return <p>Loading...</p>;
  if (!restaurant) return <p>No restaurant found.</p>;

  /* 🔹 ADD ITEM */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setItems((prev) => [data, ...prev]);

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    });
  };

  /* 🔹 DELETE ITEM */
  const handleDelete = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="row">
      {/* ADD ITEM */}
      <div className="col-lg-5 mb-4">
        <h3>Add Menu Item</h3>

        <form onSubmit={handleSubmit} className="card card-body">
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <button className="btn btn-success">Add Item</button>

          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
      </div>

      {/* MENU LIST */}
      <div className="col-lg-7">
        <h3>Current Menu</h3>

        {loadingItems ? (
          <p>Loading menu...</p>
        ) : items.length === 0 ? (
          <p>No menu items yet.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>GHS {item.price.toFixed(2)}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MenuEditorPage;
