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

function FormVariacao(props) {
    
    const [referencias, setReferencias] = useState([]);
    const [referencia_id, setReferencia] = useState('');
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(true);

    const notificacao = useRef(null);

    useEffect(() => {
      
        Api.get(`/referencias/by?key=ativo&value=true`,{}).then(res => {
  
            setReferencias(res.data);
  
        }).catch((error) => {
            if (error.response?.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response?.error);
            }
        });
  
      },[loading]);

    const submit = (e) => {
        e.preventDefault();
        
        Api.post(`/variacoes`, {
            nome, referencia_id
        }, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            setNome('');
            setReferencia('');

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
                            <h5 className="title">Cadastrar Variação</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className="pr-md-1" md="5">
                                    <FormGroup>
                                        <label>Nome</label>
                                        <Input
                                        defaultValue=""
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        placeholder="Nome"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Referência</label>
                                        <Input
                                        value={referencia_id}
                                        onChange={e => setReferencia(e.target.value)}
                                        placeholder="Selecione a Referência"
                                        type="select"
                                        required
                                        >
                                            <option value="">Selecione a Referência</option>
                                            {
                                                referencias.map((value, index, array) => {
                                                    return <option value={value.id}>{value.nome}</option>;
                                                })
                                            }
                                        </Input>
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

export default FormVariacao;