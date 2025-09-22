
import { Galleria } from 'primereact/galleria';
import { serverPort } from './Constants';

export default function ImageGallery({
  images = [],
  numVisible = 9,
  showThumbnails = true,
  circular = true,
  autoPlay = true,
  transitionInterval = 3000,
  maxWidth = "700px",
  style = {},
  selected = null,
  onItemSelect = () => { },
}) {
  const responsiveOptions = [
    { breakpoint: "991px", numVisible: 7 },
    { breakpoint: "767px", numVisible: 5 },
    { breakpoint: "575px", numVisible: 4 },
  ];

  const activeIndex = selected
    ? images.findIndex((img) => img.thumbnailId === selected.thumbnailId)
    : 0;

  const itemTemplate = (item) => (
    <img
      onContextMenu={(e) => e.preventDefault()}
      loading='lazy'
      src={serverPort + item.thumbnailUrl}
      alt="thumbnail-preview-image"
      style={{
        width: "100%",
        display: "block",
      }}
    />
  );

  const thumbnailTemplate = (item) => (
    <img
      onContextMenu={(e) => e.preventDefault()}
      loading='lazy'
      src={serverPort + item.thumbnailUrl}
      alt={item.thumbnailImageName || "thumbnail"}
      style={{
        width: "60px",
        height: "50px",
        objectFit: "cover",
      }}
    />
  );

  const handleItemChange = (e) => {
    const newSelected = images[e.index];
    onItemSelect(newSelected, e.index);
  };

  return (
    <Galleria
      value={images}
      responsiveOptions={responsiveOptions}
      numVisible={numVisible}
      circular={circular}
      showThumbnails={showThumbnails}
      showIndicators={false}
      autoPlay={autoPlay}
      transitionInterval={transitionInterval}
      item={itemTemplate}
      thumbnail={thumbnailTemplate}
      activeIndex={activeIndex}
      style={{ maxWidth, ...style }}
    />
  );
}
