const ProductCard = ({ product, view }) => {
    return (
      <div
        className={`card h-100 shadow-sm ${
          view === "list" ? "flex-row align-items-center" : ""
        }`}
      >
        <div className={view === "list" ? "w-25" : ""}>
          {product.productUrl.endsWith(".mp4") ? (
            <video
              controls
              className="img-fluid rounded"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            >
              <source src={product.productUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={product.productUrl}
              alt={product.productName}
              className="img-fluid rounded"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          )}
        </div>
  
        <div className={`card-body ${view === "list" ? "w-75" : ""}`}>
          <h5 className="card-title">{product.productName}</h5>
          <p className="card-text text-muted">{product.productdescription}</p>
          <span className="badge bg-info text-dark mb-2">{product.pCategory}</span>
  
          <div>
            <span className="fw-bold me-2">${product.price}</span>
            {product.oldPrice && (
              <span className="text-decoration-line-through text-muted">
                ${product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductCard;
  