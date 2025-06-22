import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../store";

interface ProductGridProps {
  category?: string;
  showAddToCart?: boolean;
}

const ProductGrid = ({ category }: ProductGridProps) => {
  const products = useDataStore((state) => state.products);
  const loading = useDataStore((state) => state.loading);
  const setAllProducts = useDataStore((state) => state.setAllProducts);
  const addToCart = useDataStore((state) => state.addToCart);
  const setCartOpen = useDataStore((state) => state.setCartOpen);

  useEffect(() => {
    console.log("ProductGrid: Starting to load products");
    setAllProducts();
  }, [setAllProducts]);

  useEffect(() => {
    console.log("ProductGrid: Products loaded", products.length, "items");
  }, [products]);

  const displayProducts =
    category && category !== "all"
      ? products.filter((product) => product.category === category)
      : products;

  // Функция для безопасного добавления в корзину
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Создаем selectedAttributes с первыми значениями для Quick Shop
    const selectedAttributes: { [key: string]: string } = {};
    if (product.attributes) {
      product.attributes.forEach((attr: any) => {
        if (attr.items && attr.items.length > 0) {
          selectedAttributes[attr.name] = attr.items[0].id;
        }
      });
    }

    // Фильтруем атрибуты для отображения только выбранных
    const filteredAttributes = product.attributes
      ? product.attributes.map((attr: any) => ({
          name: attr.name,
          type: attr.type,
          items: attr.items.filter(
            (item: any) => item.id === selectedAttributes[attr.name]
          ),
        }))
      : [];

    const cartItem = {
      ...product,
      attributes: filteredAttributes,
      selectedAttributes: selectedAttributes,
    };

    addToCart(cartItem);

    // Открываем корзину после добавления
    setCartOpen(true);
    console.log("Item added to cart, cart overlay opened");
  };

  const getCategoryTitle = () => {
    if (category === "clothes") return "CLOTHES";
    if (category === "tech") return "TECH";
    if (category === "all") return "ALL";
    return "CATEGORY";
  };

  const toKebabCase = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "400",
            marginBottom: "40px",
            color: "#333",
          }}
        >
          {getCategoryTitle()}
        </h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading products...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {displayProducts.map((item) => (
              <div
                key={item.id}
                data-testid={`product-${toKebabCase(item.name)}`}
                style={{
                  position: "relative",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  opacity: !item.inStock ? 0.6 : 1,
                }}
                className="product-card"
                onMouseEnter={(e) => {
                  if (item.inStock) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0,0,0,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.inStock) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {item.inStock ? (
                  <Link
                    to={`/Detail/${item.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        src={item.gallery[0]}
                        alt={item.name}
                      />

                      <div
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          right: "16px",
                          opacity: 1,
                          transition: "opacity 0.2s ease",
                        }}
                        className="product-cart-button"
                      >
                        <button
                          data-testid="add-to-cart"
                          onClick={(e) => handleAddToCart(e, item)}
                          style={{
                            backgroundColor: "#4ade80",
                            color: "white",
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#22c55e";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#4ade80";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
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
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: "20px" }}>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "300",
                          margin: "0 0 8px 0",
                          color: "#333",
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          margin: 0,
                          color: "#333",
                        }}
                      >
                        {item.prices[0]?.currency.symbol}
                        {item.prices[0]?.amount.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    to={`/Detail/${item.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          filter: "grayscale(100%)",
                        }}
                        src={item.gallery[0]}
                        alt={item.name}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          fontWeight: "400",
                          color: "#8D8F9A",
                          letterSpacing: "1px",
                        }}
                      >
                        OUT OF STOCK
                      </div>
                    </div>

                    <div style={{ padding: "20px" }}>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "300",
                          margin: "0 0 8px 0",
                          color: "#8D8F9A",
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          margin: 0,
                          color: "#8D8F9A",
                        }}
                      >
                        {item.prices[0]?.currency.symbol}
                        {item.prices[0]?.amount.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
