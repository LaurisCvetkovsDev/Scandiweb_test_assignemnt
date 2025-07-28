import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDataStore } from "../store";
import { ProductData } from "../types/ProductData";
import "./Detail.css";

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

  useEffect(() => {
    if (id) {
      setProduct(id);
    }
  }, [id, setProduct]);

  useEffect(() => {
    if (product && product.attributes) {
      setSelectedAttributes({});
    }
  }, [product]);

  if (!product) {
    return <div className="detail-loading">Loading...</div>;
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
      attributes: product.attributes,
      selectedAttributes: filteredAttributes,
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
    return str.toLowerCase().replace(/\s+/g, "-");
  };

  const parseHtmlDescription = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');
  };

  const allAttributesSelected = product.attributes.every(
    (attr) => selectedAttributes[attr.name]
  );

  return (
    <div className="detail-container">
      <div className="detail-content">
        <div className="detail-thumbnails">
          {product.gallery.map((item, index) => (
            <div
              key={index}
              className={`detail-thumbnail ${
                selectedImageIndex === index ? "selected" : ""
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img src={item} alt={`Thumbnail ${index}`} />
            </div>
          ))}
        </div>

        <div data-testid="product-gallery" className="detail-gallery">
          <img src={product.gallery[selectedImageIndex]} alt="Selected" />

          {product.gallery.length > 1 && (
            <>
              <button onClick={prevImage} className="detail-nav-button prev">
                <svg width="200" height="200" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button onClick={nextImage} className="detail-nav-button next">
                <svg width="200" height="200" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{product.name}</h1>

          {product.attributes.map((attribute) => (
            <div
              key={attribute.name}
              className="detail-attribute"
              data-testid={`product-attribute-${toKebabCase(attribute.name)}`}
            >
              <h3 className="detail-attribute-title">{attribute.name}:</h3>

              <div className="detail-attribute-options">
                {attribute.items.map((item) => {
                  const isSelected =
                    selectedAttributes[attribute.name] === item.id;
                  const isColor = attribute.name.toLowerCase() === "color";

                  return (
                    <button
                      key={item.id}
                      data-testid={`product-attribute-${toKebabCase(
                        attribute.name
                      )}-${item.value}`}
                      onClick={() => handleSelect(attribute.name, item.id)}
                      className={
                        isColor
                          ? `detail-color-button ${
                              isSelected ? "selected" : ""
                            }`
                          : `detail-attribute-button ${
                              isSelected ? "selected" : ""
                            }`
                      }
                      style={isColor ? { backgroundColor: item.value } : {}}
                    >
                      {isColor ? "" : item.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="detail-price-section">
            <h3 className="detail-price-title">Price:</h3>
            <div className="detail-price">
              {product.prices.map((price, index) => (
                <span key={index}>
                  {price.currency.symbol}
                  {price.amount.toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          <button
            data-testid="add-to-cart"
            onClick={() => addToCart(setToCartItem())}
            disabled={!product.inStock || !allAttributesSelected}
            className="detail-add-to-cart"
          >
            {!product.inStock ? "Out of Stock" : "Add to Cart"}
          </button>

          <div data-testid="product-description" className="detail-description">
            {parseHtmlDescription(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
