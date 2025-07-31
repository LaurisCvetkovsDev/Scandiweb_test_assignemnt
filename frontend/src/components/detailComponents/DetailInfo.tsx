import { ProductData } from "../../types/ProductData";

type Props = {
  product: ProductData;
  selectedAttributes: {
    [key: string]: string;
  };
  toKebabCase: (str: string) => string;
  handleSelect: (attrName: string, itemId: string) => void;
  addToCart: (product: ProductData) => void;
  setToCartItem: () => ProductData;
  allAttributesSelected: boolean;
  parseHtmlDescription: (html: string) => string;
};
const DetailInfo = ({
  product,
  selectedAttributes,
  allAttributesSelected,
  toKebabCase,
  handleSelect,
  addToCart,
  setToCartItem,
  parseHtmlDescription,
}: Props) => {
  return (
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
              const isSelected = selectedAttributes[attribute.name] === item.id;
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
                      ? `detail-color-button ${isSelected ? "selected" : ""}`
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
  );
};

export default DetailInfo;
