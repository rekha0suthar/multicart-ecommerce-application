import React from "react";
import { Col, Container, Row } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import  {db} from '../firebase.config'
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const AllProduct = () => {
  const { data: productsData, loading } = useGetData("products");
  const deleteProduct = async(id) => {
    await deleteDoc(doc(db, 'products', id))
    toast.success('Product deleted')
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h3 className="py-5 text-center fw-bold">Loading.....</h3>
                ) : (
                  productsData?.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img src={product.imgUrl} alt="" />
                      </td>
                      <td>{product.productName}</td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>
                        <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AllProduct;
