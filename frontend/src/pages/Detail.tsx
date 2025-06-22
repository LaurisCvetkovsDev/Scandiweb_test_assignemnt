import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDataStore } from "../store";
import { ProductData } from "../types/ProductData";
import Cart from "../components/cart";

const Detail = () => {
  const params = useParams();
  const { id } = params;
  const product = useDataStore((state) => state.product);
  const setProduct = useDataStore((state) => state.setProduct);
  const addToCart = useDataStore((state) => state.addToCart);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setProduct(id);
    }
  }, [id, setProduct]);

  useEffect(() => {
    if (product && product.attributes) {
      // Не устанавливаем атрибуты по умолчанию - пользователь должен выбрать их сам
      setSelectedAttributes({});
    }
  }, [product]);

  if (!product) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  const handleSelect = (attrName: string, itemId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attrName]: itemId,
    }));
  };

  const setToCartItem = (): ProductData => {
    const filteredAttributes = product.attributes
      .filter((attr) => selectedAttributes[attr.name])
      .map((attr) => ({
        name: attr.name,
        type: attr.type,
        items: attr.items.filter(
          (item) => item.id === selectedAttributes[attr.name]
        ),
      }));

    const toCartItem: ProductData = {
      id: product.id,
      name: product.name,
      description: product.description,
      inStock: product.inStock,
      category: product.category,
      prices: product.prices,
      gallery: product.gallery,
      attributes: filteredAttributes,
      selectedAttributes: selectedAttributes,
    };

    return toCartItem;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-#]/g, ""); // Сохраняем # для цветов
  };

  // Safe HTML parsing (forbidden to use dangerouslySetInnerHTML)
  const parseHtmlDescription = (html: string) => {
    // Simple HTML parsing without dangerouslySetInnerHTML
    return html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');
  };

  // Check if all required attributes are selected
  const allAttributesSelected = product.attributes.every(
    (attr) => selectedAttributes[attr.name]
  );

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
          display: "grid",
          gridTemplateColumns: "auto 1fr 400px",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Thumbnail Gallery */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100px",
          }}
        >
          {product.gallery.map((item, index) => (
            <div
              key={index}
              style={{
                cursor: "pointer",
                border:
                  selectedImageIndex === index
                    ? "2px solid #4ade80"
                    : "2px solid transparent",
                borderRadius: "4px",
                overflow: "hidden",
              }}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={item}
                alt={`Thumbnail ${index}`}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div
          data-testid="product-gallery"
          style={{
            position: "relative",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <img
            src={product.gallery[selectedImageIndex]}
            alt="Selected"
            style={{
              width: "100%",
              height: "600px",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Navigation Arrows */}
          {product.gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Product Info */}
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "8px",
            height: "fit-content",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "600",
              margin: "0 0 30px 0",
              color: "#333",
            }}
          >
            {product.name}
          </h1>

          {/* Attributes */}
          {product.attributes.map((attribute) => (
            <div
              key={attribute.name}
              style={{ marginBottom: "30px" }}
              data-testid={`product-attribute-${toKebabCase(attribute.name)}`}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#333",
                  textTransform: "uppercase",
                }}
              >
                {attribute.name}:
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {attribute.items.map((item) => {
                  const isSelected =
                    selectedAttributes[attribute.name] === item.id;
                  const isColor = attribute.name.toLowerCase() === "color";

                  return (
                    <button
                      key={item.id}
                      data-testid={`product-attribute-${toKebabCase(
                        attribute.name
                      )}-${toKebabCase(
                        item.value || item.displayValue || item.id
                      )}`}
                      onClick={() => handleSelect(attribute.name, item.id)}
                      style={{
                        ...(isColor
                          ? {
                              width: "40px",
                              height: "40px",
                              backgroundColor: item.value,
                              border: isSelected
                                ? "3px solid #333"
                                : "1px solid #ccc",
                              borderRadius: "4px",
                              cursor: "pointer",
                              outline: "none",
                            }
                          : {
                              padding: "12px 24px",
                              border: isSelected
                                ? "2px solid #333"
                                : "1px solid #333",
                              backgroundColor: isSelected ? "#333" : "white",
                              color: isSelected ? "white" : "#333",
                              fontSize: "16px",
                              fontWeight: "400",
                              cursor: "pointer",
                              borderRadius: "4px",
                              outline: "none",
                              transition: "all 0.2s ease",
                            }),
                      }}
                    >
                      {isColor ? "" : item.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Price */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "8px",
                color: "#333",
                textTransform: "uppercase",
              }}
            >
              Price:
            </h3>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>
              {product.prices.map((price, index) => (
                <span key={index}>
                  {price.currency.symbol}
                  {price.amount.toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            data-testid="add-to-cart"
            onClick={() => {
              addToCart(setToCartItem());
              setCartOpen(true);
            }}
            disabled={!product.inStock || !allAttributesSelected}
            style={{
              width: "100%",
              backgroundColor:
                product.inStock && allAttributesSelected ? "#4ade80" : "#ccc",
              color: "white",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "600",
              textTransform: "uppercase",
              borderRadius: "4px",
              marginBottom: "24px",
              border: "none",
              cursor:
                product.inStock && allAttributesSelected
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            {!product.inStock ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Product Description */}
          <div
            data-testid="product-description"
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#666",
            }}
          >
            {parseHtmlDescription(product.description)}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Detail;
