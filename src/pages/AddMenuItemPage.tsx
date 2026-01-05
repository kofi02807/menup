import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const AddMenuItemPage = () => {
  const navigate = useNavigate();

  // TEMP: replace with real restaurant ID later
  const restaurantId = "PASTE_RESTAURANT_ID_HERE";

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("menu_items").insert({
      name,
      price: Number(price),
      category,
      description,
      restaurant_id: restaurantId,
      is_available: true,
    });

    setLoading(false);

    if (!error) {
      navigate("/dashboard/menu");
    } else {
      alert("Error adding menu item");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Menu Item</h2>

      <form onSubmit={handleSubmit} className="mt-3">
        <input
          className="form-control mb-2"
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Category (e.g. Drinks)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItemPage;
