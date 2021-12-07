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

function FormConta(props) {
    const [banco, setBanco] = useState('');
    const [agencia, setAgencia] = useState('');
    const [conta, setConta] = useState('');
    const [nome_titular, setNomeTitular] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [opcao, setOpcao] = useState('');

    const notificacao = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        
        Api.post(`/contas`, {
            banco,
            agencia,
            conta,
            nome_titular,
            cnpj,
            opcao
        }, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            setBanco('');
            setAgencia('');
            setConta('');
            setNomeTitular('');
            setCnpj('');
            setOpcao('');

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
                            <h5 className="title">Cadastrar Conta</h5>
                        </CardHeader>
                        <CardBody>
                            <Row style={{marginRight: '-5px'}}>
                                <Col className="pr-md-1" md="12">
                                    <FormGroup>
                                        <label>Banco</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={banco}
                                        onChange={e => setBanco(e.target.value)}
                                        placeholder="Banco"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight: '-5px'}}>
                                <Col className="pr-md-1" md="4">
                                    <FormGroup>
                                        <label>Agência</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={agencia}
                                        onChange={e => setAgencia(e.target.value)}
                                        placeholder="Agência"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Conta</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={conta}
                                        onChange={e => setConta(e.target.value)}
                                        placeholder="Conta"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="2">
                                    <FormGroup>
                                        <label>Opção</label>
                                        <Input
                                        defaultValue=""
                                        value={opcao}
                                        onChange={e => setOpcao(e.target.value)}
                                        placeholder="Opção"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight: '-5px'}}>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>CNPJ</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={cnpj}
                                        onChange={e => setCnpj(e.target.value)}
                                        placeholder="CNPJ"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Nome do Titular</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={nome_titular}
                                        onChange={e => setNomeTitular(e.target.value)}
                                        placeholder="Nome do Titular"
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

export default FormConta;