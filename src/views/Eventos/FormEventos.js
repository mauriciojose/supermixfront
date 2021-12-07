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

  import Select from 'react-select';

  import ToggleSwitch  from "../../components/ToogleSwitch/ToggleSwitch";

  import { PreviewUploadImages } from "../../components/PreviewUploadImages/PreviewUploadImages";

  import { Notifications } from "../Notifications";

  import Api from "../../api/api";

  import "./evento.css";

  import { setFormatMoneyBr, setFormatDecimal, setFormatNumber } from "../../helpers/formatNumber";

  const cepPromise  = require("cep-promise");


function FormEventos(props) {
    
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [censura, setCensura] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [bairro, setBairro] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [local, setLocal] = useState('');
    const [optionsIngressos, setOptionsIngressos] = useState([]);

    const [loading, setLoading] = useState(true);
    
    const [ingressos, setIngressos] = useState({});

    const photos = useRef(null);
    const notificacao = useRef(null);

    useEffect(() => {
      
        Api.get(`/ingressos`,{}).then(res => {

            if (res.data?.length > 0) {
                let ingressos = res.data.map((value, index, array) => {
                  return {
                    value: value.id, label: value.nome
                  }
                });
                setOptionsIngressos(ingressos);
            }
  
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

        if (photos.current.state.files.length == 0) {
            notificacao.current.notify("tr","warning", "Selecione pelo menos uma imagem!");
            return;
        }

        let ingressosSend = [];

        for ( const key in ingressos ) {
            if (Object.hasOwnProperty.call(ingressos, key)) {
                
                let element = ingressos[key];

                let ingressoStruct = {
                    id_ingresso: element.id_ingresso, 
                    valor: element.valor/100, 
                    valor_venda: element.valor_venda/100, 
                    quantidade: element.quantidade
                };

                ingressosSend.push(ingressoStruct);
            }
        }

        if (ingressos.length == 0) {
            notificacao.current.notify("tr","warning", "Selecione pelo menos um Ingresso!");
            return;
        }
        
        const formData = new FormData();

        formData.append( 'nome', nome );
        formData.append( 'data', data );
        formData.append( 'hora', hora );
        formData.append( 'censura', censura );
        formData.append( 'cep', cep );
        formData.append( 'cidade', cidade );
        formData.append( 'estado', estado );
        formData.append( 'bairro', bairro );
        formData.append( 'endereco', endereco );
        formData.append( 'numero', numero );
        formData.append( 'local', local );
        
        formData.append( 'ingressos', JSON.stringify(ingressosSend) );
        // for (let index = 0; index < ingressosSend.length; index++) {
        //     const element = ingressosSend[index];
        // }
        
        let files = photos.current.state.files;
        for (const key of Object.keys(files)) {
            formData.append('photos', files[key]);
        }
        
        Api.post(`/eventos`, formData, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            window.location = "/admin/eventos";

        }).catch((error) => {
            if (error.response.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response.error);
            }
        });
        
    }

    const getCep = ( cep ) => {
        
        cep = cep.toString().replace(/[^\d]/g, "");
        
        cepPromise(`${cep}`).then(res => {

            console.log(res);
            setCidade(res.city);
            setEstado(res.state);
            setEndereco(res.street);
            setBairro(res.neighborhood);
            // setNome('');

        }).catch((error) => {
            // if (error.response?.status == 401) {
            //     window.location = "/auth";
            // } else{
            //     // notificacao.current.notify("tr","danger", error.response.error);
            // }
        });
    }

    const handleChangeIngresso = (e) => {
        console.log(e);
        let newIngressos = {};
        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            newIngressos[element.value] = {
                id_ingresso: element.value,
                label: element.label,
                valor: 0,
                valor_venda: 0,
                quantidade: 0
            };
        }
        setIngressos(newIngressos);
    }

    const handleChangeIngressoItem = (event) => {
        event.preventDefault();
        ingressos[event.target.dataset.codigo][event.target.name] = event.target.value;
        setIngressos(ingressos);
    }

    const handleChangeIngressoItemKey = (key, keyItem, value) => {
        
        ingressos[key][keyItem] = value;
        let newIngressos = {
            ...ingressos
        };
        setIngressos(newIngressos);
    }

    const getKeyItem = (e, value) => {
        
        if (e.key === "Backspace") {
            return value.toString().slice(0,-1).replace(/\D/g, "");
        } else {
            return value.toString()+e.key.toString().replace(/\D/g, "");
        }
    }

    const renderIngressos = () => {
        
        let arrayItens = [];

        for (const key in ingressos) {
            if (Object.hasOwnProperty.call(ingressos, key)) {
                const element = ingressos[key];

                console.log( element, element.valor_venda, setFormatMoneyBr(element.valor_venda) );

                arrayItens.push(
                    <div>
                        <Row style={{margin: '18px 4px'}}>

                            <Col md="3" style={{color: 'white', textAlign:'left'}}>{element.label}</Col>
                            <Col md="3">
                                <Input  
                                size={3}
                                value={setFormatNumber(element.quantidade)}
                                name = "quantidade"
                                data-codigo={key}
                                required
                                onKeyDown={e => handleChangeIngressoItemKey(key, 'quantidade', getKeyItem(e,element.quantidade))}
                                ></Input>
                            </Col>
                            <Col md="3">
                                <Input  
                                size={3}
                                value={setFormatMoneyBr(element.valor)}
                                name = "valor"
                                data-codigo={key}
                                required
                                onKeyDown={e => handleChangeIngressoItemKey(key, 'valor', getKeyItem(e,element.valor))}
                                ></Input>
                            </Col>
                            <Col md="3">
                                <Input  
                                size={3}
                                value={setFormatMoneyBr(element.valor_venda)}
                                name = "valor_venda"
                                data-codigo={key}
                                required
                                onKeyDown={e => handleChangeIngressoItemKey(key, 'valor_venda', getKeyItem(e,element.valor_venda))}
                                ></Input>
                            </Col>

                        </Row>
                    </div>
                );
            }
        }

        return arrayItens;

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
                            <h5 className="title">Cadastrar Evento</h5>
                        </CardHeader>
                        <CardBody>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="6">
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
                                <Col className="pr-md-1" md="2">
                                    <FormGroup>
                                        <label>Data</label>
                                        <Input
                                        defaultValue=""
                                        value={data}
                                        onChange={e => setData(e.target.value)}
                                        placeholder="Data"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="2">
                                    <FormGroup>
                                        <label>Hora</label>
                                        <Input
                                        defaultValue=""
                                        value={hora}
                                        onChange={e => setHora(e.target.value)}
                                        placeholder="Hora"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="2">
                                    <FormGroup>
                                        <label>Censura</label>
                                        <Input
                                        defaultValue=""
                                        value={censura}
                                        onChange={e => setCensura(e.target.value)}
                                        placeholder="Censura"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>CEP</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        value={cep}
                                        onChange={ ( e ) => {
                                                setCep(e.target.value);
                                                if ( e.target.value.toString().length === 8 ) {
                                                    getCep( e.target.value );
                                                }
                                            }
                                        }
                                        placeholder="CEP"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Cidade</label>
                                        <Input
                                        defaultValue=""
                                        value={cidade}
                                        onChange={e => setCidade(e.target.value)}
                                        placeholder="Cidade"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Estado</label>
                                        <Input
                                        defaultValue=""
                                        value={estado}
                                        onChange={e => setEstado(e.target.value)}
                                        placeholder="Estado"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Bairro</label>
                                        <Input
                                        defaultValue=""
                                        value={bairro}
                                        onChange={e => setBairro(e.target.value)}
                                        placeholder="Bairro"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Rua</label>
                                        <Input
                                        defaultValue=""
                                        value={endereco}
                                        onChange={e => setEndereco(e.target.value)}
                                        placeholder="Rua"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Número</label>
                                        <Input
                                        defaultValue=""
                                        value={numero}
                                        onChange={e => setNumero(e.target.value)}
                                        placeholder="Número"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="12">
                                    <FormGroup>
                                        <label>Local</label>
                                        <Input
                                        defaultValue=""
                                        value={local}
                                        onChange={e => setLocal(e.target.value)}
                                        placeholder="Ex: bar do tonho"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <PreviewUploadImages type="simple" ref={photos}></PreviewUploadImages>
                                </Col>
                            </Row>
                            <Row style={{marginTop: '20px'}}>
                                <Col md="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="title">Ingressos</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>Ingressos</label>
                                                        <Select options={optionsIngressos} onChange={handleChangeIngresso} isMulti/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                <div className="table">
                                                        <Row style={{margin: '20px 0 10px 0'}}>
                                                            <Col md="3" style={{paddingLeft: '0'}}>Ingresso</Col>
                                                            <Col md="3">Quantidade</Col>
                                                            <Col md="3">Valor</Col>
                                                            <Col md="3">Valor Venda</Col>
                                                        </Row>
                                                    <div style={{borderBottom: "1px solid white"}}></div>
                                                    {
                                                        renderIngressos()
                                                    }
                                                </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
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

export default FormEventos;