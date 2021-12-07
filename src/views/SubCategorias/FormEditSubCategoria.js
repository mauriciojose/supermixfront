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

  import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function FormSubCategoria(props) {
    
    const [categorias, setCategorias] = useState([]);
    const [categoria_id, setCategoria] = useState('');
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState(null);
    const [ativo, setAtivo] = useState(true);
    const [loading, setLoading] = useState(true);

    const { subcategoria_id } = useParams();

    const photos = useRef(null);
    const notificacao = useRef(null);

    useEffect(() => {

        Api.get(`/subcategorias/by/${subcategoria_id}`,{}).then(res => {
  
            console.log(res.data);

            setNome(res.data.nome);
            setCategoria(res.data.categoria_id);
            setAtivo(res.data.ativo);
            setCodigo(res.data.codigo);

            Api.get(`/categorias/by?key=ativo&value=true`,{}).then(res => {
  
                setCategorias(res.data);
      
            }).catch((error) => {
                if (error.response?.status == 401) {
                    window.location = "/auth";
                } else{
                    notificacao.current.notify("tr","danger", error.response?.error);
                }
            });
  
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
        
        const formData = new FormData();

        formData.append('nome', nome);
        formData.append('categoria_id', categoria_id);
        formData.append('ativo', ativo);
        let files = photos.current.state.files;
        for (const key of Object.keys(files)) {
            formData.append('photos', files[key]);
        }
        
        Api.put(`/subcategorias/${subcategoria_id}/${codigo}`, formData, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Atualizado com Sucesso");

            setTimeout(() => {
                window.location=`/admin/subcategorias`; 
            }, 1000);

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
                                <Col className="pr-md-1" md="4">
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
                                <Col md="3" style={{display: 'flex', alignItems: 'center'}}>
                                    <ToggleSwitch
                                        checked={ativo}
                                        text="Ativo"
                                        size={"default"}
                                        onChange={() => setAtivo(!ativo)}
                                        offstyle="btn-danger"
                                        onstyle="btn-success"
                                    />
                                </Col>
                                <Col className="pr-md-1" md="5">
                                    <FormGroup>
                                        <label>Categoria</label>
                                        <Input
                                        value={categoria_id}
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