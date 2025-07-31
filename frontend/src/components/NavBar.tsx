import Cart from "./cart/Cart.tsx";
import { useDataStore } from "../store";
import "../styles/NavBar.css";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const cart = useDataStore((state) => state.cart);
  const isCartOpen = useDataStore((state) => state.isCartOpen);
  const setCartOpen = useDataStore((state) => state.setCartOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-links">
            <Link
              to="/clothes"
              data-testid={
                isActive("/clothes") ? "active-category-link" : "category-link"
              }
              className={`navbar-link${isActive("/clothes") ? " active" : ""}`}
            >
              CLOTHES
            </Link>
            <Link
              to="/tech"
              data-testid={
                isActive("/tech") ? "active-category-link" : "category-link"
              }
              className={`navbar-link${isActive("/tech") ? " active" : ""}`}
            >
              TECH
            </Link>
            <Link
              to="/all"
              data-testid={
                isActive("/all") ? "active-category-link" : "category-link"
              }
              className={`navbar-link${isActive("/all") ? " active" : ""}`}
            >
              ALL
            </Link>
          </div>

          <div>
            <button
              data-testid="cart-btn"
              onClick={() => setCartOpen(!isCartOpen)}
              className="navbar-cart-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="navbar-cart-icon"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              {cart.length > 0 && (
                <span className="navbar-cart-badge">
                  {cart.length > 9 ? "9+" : cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isCartOpen && (
        <>
          <div
            className="navbar-cart-overlay"
            onClick={() => setCartOpen(false)}
          />

          <div
            data-testid="cart-overlay"
            className={`navbar-cart-drawer${isCartOpen ? " open" : ""}`}
          >
            <Cart />
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
