import { ProductData } from "../../types/ProductData";

type Props = {
  product: ProductData;
  selectedImageIndex: number;
  prevImage: () => void;
  nextImage: () => void;
};

const DetailGallery = ({
  prevImage,
  nextImage,
  product,
  selectedImageIndex,
}: Props) => {
  return (
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
  );
};

export default DetailGallery;
