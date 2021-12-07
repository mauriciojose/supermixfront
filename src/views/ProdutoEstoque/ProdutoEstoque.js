import React, {useState, useRef, useEffect} from "react";

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

  import Tables  from "../TableList";

  import Api from "../../api/api";

  import { Notifications } from "../Notifications";

function ProdutoEstoque(props) {

    const [produto_estoque, setProdutosEstoque] = useState([]);
    const [loading, setLoading] = useState(true);

    const notificacao = useRef(null);

    useEffect(() => {
      
      Api.get(`/produto_estoque`,{}).then(res => {

          setProdutosEstoque(res.data);

      }).catch((error) => {
          if (error.response?.status == 401) {
              window.location = "/auth";
          } else{
              notificacao.current.notify("tr","danger", error.response?.error);
          }
      });

    },[loading]);

    const headers = ["Nome", "Data de Criação"];
    const incluir = ["nome", "created_at"];
    const datas = ["created_at"];
    
    return (
      <>
        <Notifications ref={notificacao}></Notifications>
        <div className="content">
          <Row>
            <Col xs="12">
                <Tables title="Produto no Estoque" headers={headers} incluir={incluir} datas={datas} bodys={referencias} button_title="Cadastrar Referência" location="referencias">
                </Tables>
            </Col>
        </Row> 
      </div>
    </>
  );
}

export default ProdutoEstoque;