import { Link, useLocation } from "react-router-dom";
import Cart from "./cart.tsx";
import { useState } from "react";
import { useDataStore } from "../store";

const NavBar = () => {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useDataStore((state) => state.cart);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        style={{
          background: "white",
          padding: "20px 40px",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Left Navigation */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
            <Link
              to="/clothes"
              data-testid={
                isActive("/clothes") ? "active-category-link" : "category-link"
              }
              style={{
                textDecoration: "none",
                color: isActive("/clothes") ? "#4ade80" : "#333",
                fontWeight: isActive("/clothes") ? "600" : "400",
                fontSize: "16px",
                borderBottom: isActive("/clothes")
                  ? "2px solid #4ade80"
                  : "2px solid transparent",
                paddingBottom: "8px",
                transition: "all 0.2s ease",
              }}
            >
              CLOTHES
            </Link>
            <Link
              to="/tech"
              data-testid={
                isActive("/tech") ? "active-category-link" : "category-link"
              }
              style={{
                textDecoration: "none",
                color: isActive("/tech") ? "#4ade80" : "#333",
                fontWeight: isActive("/tech") ? "600" : "400",
                fontSize: "16px",
                borderBottom: isActive("/tech")
                  ? "2px solid #4ade80"
                  : "2px solid transparent",
                paddingBottom: "8px",
                transition: "all 0.2s ease",
              }}
            >
              TECH
            </Link>
            <Link
              to="/"
              data-testid={
                isActive("/") ? "active-category-link" : "category-link"
              }
              style={{
                textDecoration: "none",
                color: isActive("/") ? "#4ade80" : "#333",
                fontWeight: isActive("/") ? "600" : "400",
                fontSize: "16px",
                borderBottom: isActive("/")
                  ? "2px solid #4ade80"
                  : "2px solid transparent",
                paddingBottom: "8px",
                transition: "all 0.2s ease",
              }}
            >
              ALL
            </Link>
          </div>

          {/* Right Cart */}
          <div>
            <button
              data-testid="cart-btn"
              onClick={() => setCartOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {/* Cart Icon SVG */}
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
                style={{ color: "#1f2937" }}
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              {/* Cart Badge */}
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    border: "2px solid white",
                  }}
                >
                  {cart.length > 9 ? "9+" : cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Overlay */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1999,
            }}
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Sidebar */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "400px",
              backgroundColor: "white",
              zIndex: 2000,
              transform: cartOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            <Cart onClose={() => setCartOpen(false)} />
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
