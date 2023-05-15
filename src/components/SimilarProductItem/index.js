import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {imageUrl, title, brand, price, rating} = item
  return (
    <li className="list-item">
      <img className="sp-img" alt={`similar product ${title}`} src={imageUrl} />
      <h1 className="sp-title">{title}</h1>
      <p className="sp-brand">by {brand}</p>
      <div className="sp-price-rating-container">
        <p className="sp-price">Rs {price}/-</p>
        <div className="sp-rating-container">
          <p className="sp-rating">{rating}</p>
          <img
            className="sp-star-img"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
