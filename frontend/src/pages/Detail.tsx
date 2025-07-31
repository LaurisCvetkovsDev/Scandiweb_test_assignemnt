import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDataStore } from "../store";
import { ProductData } from "../types/ProductData";
import "../styles/Detail.css";
import DetailGallery from "../components/detailComponents/DetailGallery";
import DetailThumbnails from "../components/detailComponents/DetailThumbnails";
import DetailInfo from "../components/detailComponents/DetailInfo";

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
        <DetailThumbnails
          product={product}
          setSelectedImageIndex={setSelectedImageIndex}
          selectedImageIndex={selectedImageIndex}
        />

        <DetailGallery
          prevImage={prevImage}
          nextImage={nextImage}
          product={product}
          selectedImageIndex={selectedImageIndex}
        />

        <DetailInfo
          product={product}
          selectedAttributes={selectedAttributes}
          allAttributesSelected={allAttributesSelected}
          toKebabCase={toKebabCase}
          parseHtmlDescription={parseHtmlDescription}
          handleSelect={handleSelect}
          addToCart={addToCart}
          setToCartItem={setToCartItem}
        />
      </div>
    </div>
  );
};

export default Detail;
