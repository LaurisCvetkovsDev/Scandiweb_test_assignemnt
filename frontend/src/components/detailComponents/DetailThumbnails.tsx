import { ProductData } from "../../types/ProductData";

type Props = {
  product: ProductData;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
};

const DetailThumbnails = ({
  product,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) => {
  return (
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
  );
};

export default DetailThumbnails;
