// src/pages/DashboardPage.tsx
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const fakeRestaurantId = "second-cup"; // later from backend/user

  return (
    <div>
      <h2 className="mb-3">Dashboard</h2>
      <p className="text-muted">
        Welcome! From here you can edit your menu and share it with customers.
      </p>

      <div className="row g-3">
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

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Public Menu Link</h5>
              <p className="card-text flex-grow-1">
                Share this link with customers or put it behind a QR code.
              </p>
              <code className="small mb-2">
                {window.location.origin}/menu/{fakeRestaurantId}
              </code>
              <Link
                to={`/menu/${fakeRestaurantId}`}
                className="btn btn-outline-secondary mt-auto"
                target="_blank"
              >
                Preview Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Later: analytics card, subscription, etc */}
      </div>
    </div>
  );
};

export default DashboardPage;
