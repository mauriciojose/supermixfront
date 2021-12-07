import React, {useState, useRef, useEffect}  from "react";

import classNames from "classnames";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
  } from "reactstrap";

  import Tables  from "../TableListProduto";
  import Api from "../../api/api";

  import { Notifications } from "../Notifications";
  import ReactPaginate from "react-paginate";

function Produtos(props) {
    
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const notificacao = useRef(null);

  useEffect(() => {
    
    loadingProducts(currentPage);

  },[loading]);

  const loadingProducts = (page) => {
    Api.get(`/produtos?offset=${page}&limit=100`,{}).then(res => {

      console.log(res.data);
      setTotalPage(parseInt(res.data.count) / 100);
      setProdutos(res.data.produtos);

    }).catch((error) => {
        if (error.response?.status == 401) {
            window.location = "/auth";
        } else{
            notificacao.current.notify("tr","danger", error.response?.error);
        }
    });
  }

  const handlePageClick = (event) => {
    console.log(event.selected);
    setCurrentPage(event.selected);
    loadingProducts(event.selected);
  };

  const headers = ["Nome", "Data de Criação"];
  const incluir = ["nome", "created_at"];
  const datas = ["created_at"];
  
  return (
    <>
      <Notifications ref={notificacao}></Notifications>
      <div className="content">
        <Row>
          <Col xs="12">
              <Tables title="Produtos" headers={headers} incluir={incluir} datas={datas} bodys={produtos} button_title="Cadastrar Produtos" location="produtos/create/0/0">
              </Tables>
              <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPage}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
          </Col>
      </Row> 
    </div>
    </>
  );
}

export default Produtos;