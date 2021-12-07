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

function Ingressos(props) {

    const [ingressos, setIngressos] = useState([]);
    const [loading, setLoading] = useState(true);

    const notificacao = useRef(null);

    useEffect(() => {
      
      Api.get(`/ingressos`,{}).then(res => {

          setIngressos(res.data);

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
                <Tables title="Ingressos" headers={headers} incluir={incluir} datas={datas} bodys={ingressos} button_title="Cadastrar Ingresso" location="ingressos">
                </Tables>
            </Col>
        </Row> 
      </div>
    </>
  );
}

export default Ingressos;