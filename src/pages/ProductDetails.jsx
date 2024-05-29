import React, { useEffect, useRef, useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Col, Container, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import ProductList from "../components/UI/ProductList";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import  {db} from '../firebase.config'
import { getDoc, doc} from "firebase/firestore"
import useGetData from "../custom-hooks/useGetData";

const ProductDetails = () => {
  const [product, setProduct] = useState({})
  const [tab, setTab] = useState("desc");
  const [rating, setRating] = useState(null);

  const reviewUser = useRef('')
  const reviewMsg = useRef('')

  const dispatch = useDispatch()

  const { id } = useParams();

  const {data: products} = useGetData('products')

  const docRef = doc(db, 'products', id)
  useEffect(() => {
    const getProduct = async () => {
      const docSnap = await getDoc(docRef)
      if(docSnap.exists()) {
        setProduct(docSnap.data())
      } else {
        console.log('no product')
      }
    }
    getProduct()
  }, [docRef])
  const {
    imgUrl,
    productName,
    price,
    // avgRating,
    // reviews,
    description,
    shortDesc,
    category,
  } = product;

  const relatedProducts = products.filter((item) => item.category === category);

  const submitHandler = (e) => {
    e.preventDefault()
    const reviewUserName = reviewUser.current.value
    const reviewUserMsg = reviewMsg.current.value

    const reveiwObj = {
      userName: reviewUserName,
      text: reviewUserMsg,
      rating
    }
    console.log(reveiwObj)
    toast.success('Review submitted ')
  }

  const addToCart = () => {
    dispatch(cartActions.addItem({
      id,
      imageUrl: imgUrl,
      productName,
      price
    }))
    toast.success('Product added successfully')
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [product])

  return (
    <Helmet title={productName}>
      <CommonSection title={productName} />
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={imgUrl} alt="" />
            </Col>
            <Col lg="6">
              <div className="product_details">
                <h2>{productName}</h2>
                <div className="product_rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-half-s-fill"></i>
                    </span>
                  </div>
                  {/* <p>({avgRating})</p> */}
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product_price">{price}</span>
                  <span>Category: {category}</span>
                </div>
                <p className="mt-3">{shortDesc}</p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy_btn" onClick={addToCart}>
                  Add to Cart
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab_wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active_tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active_tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab_content mt-5">
                  <p>{description}</p>
                </div>
              ) : (
                <div className="product_review mt-5">
                  <div className="review_wrapper">
                    <ul>
                      {/* {reviews.map((item, index) => (
                        <li key={index} className="mb-4">
                          <h6>Ryen</h6>
                          <span>{item.rating}</span>
                          <p>{item.text}</p>
                        </li>
                      ))} */}
                    </ul>
                    <div className="review_form">
                      <h4>Leave your experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form_group">
                          <input type="text" placeholder="Enter name" ref={reviewUser}/>
                        </div>
                        <div className="form_group d-flex align-items-center gap-5 rating_group">
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(1)}>
                            1<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(2)}>
                            2<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(3)}>
                            3<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(4)}>
                            4<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{ scale: 1.2 }} onClick={() => setRating(5)}>
                            5<i class="ri-star-s-fill"></i>
                          </motion.span>
                        </div>
                        <div className="form_group">
                          <textarea
                            rows={4}
                            type="text"
                            placeholder="Review message"
                            ref={reviewMsg}
                          />
                        </div>
                        <motion.button type="submit" className="buy_btn">
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="12">
              <h2 className="related_title">You might like this also</h2>
            </Col>
            <ProductList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
