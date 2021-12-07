import React, { useState, useEffect, useRef }  from "react";

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
    Form,
    CardFooter,
    
  } from "reactstrap";

  import ToggleSwitch  from "../../components/ToogleSwitch/ToggleSwitch";

  import { PreviewUploadImages } from "../../components/PreviewUploadImages/PreviewUploadImages";

  import { Notifications } from "../Notifications";

  import Api from "../../api/api";

function FormReferencia(props) {
    const [nome, setNome] = useState('');

    const notificacao = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        
        Api.post(`/referencias`, {
            nome
        }, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            setNome('');

        }).catch((error) => {
            if (error.response.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response.error);
            }
        });
        
    }

    return (
      <>
        <Notifications ref={notificacao}></Notifications>
        <div className="content">
        <Row>
            <Col md="12">
                <Form action="" onSubmit={e => submit(e)}>
                    <Card>
                        <CardHeader>
                            <h5 className="title">Cadastrar Referência</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Nome</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        placeholder="Nome"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button 
                                className="btn-fill" 
                                color="primary" 
                                type="submit"
                                >
                            Salvar
                            </Button>
                        </CardFooter>
                    </Card>
                </Form>
            </Col>
        </Row> 
      </div>
    </>
  );
}

export default FormReferencia;