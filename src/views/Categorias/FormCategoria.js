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

function FormCategoria(props) {
    
    const [checkedSubCategoria, setSubCategoria] = useState(true);
    const [nome, setNome] = useState('');

    const photos = useRef(null);
    const notificacao = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        if (photos.current.state.files.length == 0) {
            notificacao.current.notify("tr","warning", "Selecione pelo menos uma imagem!");
            return;
        }
        
        const formData = new FormData();

        formData.append('nome', nome);
        formData.append('mostra_subcategoria', checkedSubCategoria);
        let files = photos.current.state.files;
        for (const key of Object.keys(files)) {
            formData.append('photos', files[key]);
        }
        
        Api.post(`/categorias`, formData, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            setNome('');
            setSubCategoria(true);
            photos.current.resetFiles();

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
                            <h5 className="title">Cadastrar Categoria</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Nome</label>
                                        <Input
                                        defaultValue=""
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        placeholder="Nome"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" style={{display: 'flex', alignItems: 'center'}}>
                                    <ToggleSwitch
                                        checked={checkedSubCategoria}
                                        text="Mostrar Sub Categoria"
                                        size={"default"}
                                        onChange={() => setSubCategoria(!checkedSubCategoria)}
                                        offstyle="btn-danger"
                                        onstyle="btn-success"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <PreviewUploadImages type="simple" ref={photos}></PreviewUploadImages>
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

export default FormCategoria;