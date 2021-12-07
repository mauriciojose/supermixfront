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

function Contas(props) {

    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);

    const notificacao = useRef(null);

    useEffect(() => {
      
      Api.get(`/contas`,{}).then(res => {

          setContas(res.data);

      }).catch((error) => {
          if (error.response?.status == 401) {
              window.location = "/auth";
          } else{
              notificacao.current.notify("tr","danger", error.response?.error);
          }
      });

    },[loading]);

    const headers = ["Banco","Agência","Conta", "Data de Criação"];
    const incluir = ["banco", "agencia", "conta", "created_at"];
    const datas = ["created_at"];
    
    return (
      <>
        <Notifications ref={notificacao}></Notifications>
        <div className="content">
          <Row>
            <Col xs="12">
                <Tables title="Contas" headers={headers} incluir={incluir} datas={datas} bodys={contas} button_title="Cadastrar Conta" location="contas">
                </Tables>
            </Col>
        </Row> 
      </div>
    </>
  );
}

export default Contas;