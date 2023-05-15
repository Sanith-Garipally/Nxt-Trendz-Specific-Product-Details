import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productItem: {},
    similarProducts: [],
    itemInCart: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    try {
      this.setState({
        apiStatus: apiStatusConstants.inProgress,
      })
      const {match} = this.props
      const {params} = match
      const {id} = params
      const jwtToken = Cookies.get('jwt_token')

      const apiUrl = `https://apis.ccbp.in/products/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const data = await response.json()
        const productItem = {
          id: data.id,
          imageUrl: data.image_url,
          title: data.title,
          brand: data.brand,
          totalReviews: data.total_reviews,
          price: data.price,
          description: data.description,
          rating: data.rating,
          availability: data.availability,
        }
        const similarProducts = data.similar_products.map(object => ({
          id: object.id,
          imageUrl: object.image_url,
          style: object.style,
          title: object.title,
          brand: object.brand,
          totalReviews: object.total_reviews,
          price: object.price,
          description: object.description,
          rating: object.rating,
          availability: object.availability,
        }))
        this.setState({
          productItem,
          similarProducts,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleIncrement = () => {
    this.setState(prevState => ({itemInCart: prevState.itemInCart + 1}))
  }

  handleDecrement = () => {
    const {itemInCart} = this.state

    if (itemInCart > 1) {
      this.setState(prevState => ({itemInCart: prevState.itemInCart - 1}))
    }
  }

  replacePath = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        className="error-img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
      />
      <h1 className="fl-head">Product Not Found</h1>
      <button className="fl-btn" type="button" onClick={this.replacePath}>
        Continue Shopping
      </button>
    </div>
  )

  renderProductItem = () => {
    const {productItem, similarProducts, itemInCart} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      description,
      availability,
      rating,
      totalReviews,
    } = productItem

    return (
      <div className="bg-container-pid">
        <div className="content-container">
          <img className="product-img" alt="product" src={imageUrl} />
          <div className="product-details-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-para-container">
                <p className="rating-para">{rating}</p>
                <img
                  className="star-img"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="review-para">{totalReviews} Reviews</p>
            </div>
            <p className="desc">{description}</p>
            <p className="av-brand-para">
              <span className="av-brand-span">Available</span>: {availability}
            </p>
            <p className="av-brand-para">
              <span className="av-brand-span">Brand</span>: {brand}
            </p>
            <hr />
            <div className="button-container">
              <button
                onClick={this.handleDecrement}
                className="plus-minus-btn"
                data-testid="minus"
                type="button"
              >
                <BsDashSquare />
              </button>
              <p className="cart-items-count">{itemInCart}</p>
              <button
                onClick={this.handleIncrement}
                className="plus-minus-btn"
                data-testid="plus"
                type="button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="atc-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="sp-container">
          <h1 className="sp-head">Similar Products</h1>
          <ul className="sp-list-container">
            {similarProducts.map(object => (
              <SimilarProductItem key={object.id} item={object} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        {(() => {
          switch (apiStatus) {
            case apiStatusConstants.inProgress:
              return this.renderLoader()
            case apiStatusConstants.success:
              return this.renderProductItem()
            case apiStatusConstants.failure:
              return this.renderFailure()
            default:
              return null
          }
        })()}
      </>
    )
  }
}

export default ProductItemDetails
