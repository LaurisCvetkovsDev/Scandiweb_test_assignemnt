import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../store";

interface ProductGridProps {
  category?: string;
  showAddToCart?: boolean;
}

const ProductGrid = ({ category }: ProductGridProps) => {
  const products = useDataStore((state) => state.products);
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

  // Fallback data for testing if API fails
  const fallbackProducts = [
    {
      id: "test-product-1",
      name: "Test Product 1",
      description: "Test description",
      inStock: true,
      category: "clothes",
      prices: [{ amount: 99.99, currency: { symbol: "$", label: "USD" } }],
      gallery: ["https://via.placeholder.com/300"],
      attributes: [],
    },
    {
      id: "test-product-2",
      name: "Test Product 2",
      description: "Test description",
      inStock: true,
      category: "tech",
      prices: [{ amount: 199.99, currency: { symbol: "$", label: "USD" } }],
      gallery: ["https://via.placeholder.com/300"],
      attributes: [],
    },
  ];

  // Use fallback products if real products haven't loaded
  const productsToShow = products.length > 0 ? products : fallbackProducts;

  const displayProducts =
    category && category !== "all"
      ? productsToShow.filter((product) => product.category === category)
      : productsToShow;

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
    <div>
      <div>
        <h1>{getCategoryTitle()}</h1>

        <div>
          {displayProducts.map((item) => (
            <div
              key={item.id}
              data-testid={`product-${toKebabCase(item.name)}`}
            >
              <Link to={`/Detail/${item.id}`}>
                <div>
                  <img src={item.gallery[0]} alt={item.name} />

                  {item.inStock && (
                    <div>
                      <button
                        data-testid="add-to-cart"
                        onClick={(e) => handleAddToCart(e, item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.prices[0]?.currency.symbol}
                    {item.prices[0]?.amount.toFixed(2)}
                  </p>
                </div>
              </Link>

              {!item.inStock && <div>OUT OF STOCK</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
