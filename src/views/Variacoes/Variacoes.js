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

function Variacoes(props) {

    const [variacoes, setVariacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    const notificacao = useRef(null);

    useEffect(() => {
      
      Api.get(`/variacoes`,{}).then(res => {

          setVariacoes(res.data);

      }).catch((error) => {
          if (error.response?.status == 401) {
              window.location = "/auth";
          } else{
              notificacao.current.notify("tr","danger", error.response?.error);
          }
      });

    },[loading]);

    const headers = ["Nome", "Referência", "Data de Criação"];
    const incluir = ["nome", "ref_nome","created_at"];
    const datas = ["created_at"];
    
    return (
      <>
        <Notifications ref={notificacao}></Notifications>
        <div className="content">
          <Row>
            <Col xs="12">
                <Tables title="Variações" headers={headers} incluir={incluir} datas={datas} bodys={variacoes} button_title="Cadastrar Variação" location="variacoes">
                </Tables>
            </Col>
        </Row> 
      </div>
    </>
  );
}

export default Variacoes;