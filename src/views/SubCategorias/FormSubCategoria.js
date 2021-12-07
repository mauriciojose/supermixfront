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

function FormSubCategoria(props) {
    
    const [categorias, setCategorias] = useState([]);
    const [categoria_id, setCategoria] = useState('');
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(true);

    const photos = useRef(null);
    const notificacao = useRef(null);

    useEffect(() => {
      
        Api.get(`/categorias/by?key=ativo&value=true`,{}).then(res => {
  
            setCategorias(res.data);
  
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

        console.log(nome, categoria_id);
        if (photos.current.state.files.length == 0) {
            notificacao.current.notify("tr","warning", "Selecione pelo menos uma imagem!");
            return;
        }
        
        const formData = new FormData();

        formData.append('nome', nome);
        formData.append('categoria_id', categoria_id);
        let files = photos.current.state.files;
        for (const key of Object.keys(files)) {
            formData.append('photos', files[key]);
        }
        
        Api.post(`/subcategorias`, formData, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            setNome('');
            setCategoria('');
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
                            <h5 className="title">Cadastrar SubCategoria</h5>
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
                                        <label>Categoria</label>
                                        <Input
                                        onChange={e => setCategoria(e.target.value)}
                                        placeholder="Selecione a Categoria"
                                        type="select"
                                        required
                                        >
                                            <option value="">Selecione a Categoria</option>
                                            {
                                                categorias.map((value, index, array) => {
                                                    return <option value={value.id}>{value.nome}</option>;
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
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

export default FormSubCategoria;