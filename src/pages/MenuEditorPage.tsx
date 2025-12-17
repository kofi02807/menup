// src/pages/MenuEditorPage.tsx
export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
};

// src/pages/MenuEditorPage.tsx
import { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";



const MenuEditorPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newItem: MenuItem = {
      id: uuid(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category || "Uncategorized",
      isAvailable: form.isAvailable,
    };

    setItems((prev) => [...prev, newItem]);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="row">
      <div className="col-lg-5 mb-4">
        <h3 className="mb-3">Add Menu Item</h3>
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <label className="form-label">Price (GHS)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              className="form-control"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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

          <button type="submit" className="btn btn-success">
            Add Item
          </button>
        </form>
      </div>

      <div className="col-lg-7">
        <h3 className="mb-3">Current Menu</h3>
        {items.length === 0 ? (
          <p>No items yet. Add your first dish on the left.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>GHS {item.price.toFixed(2)}</td>
                    <td>{item.isAvailable ? "Yes" : "No"}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuEditorPage;



