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

  import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
  import { Editor } from 'react-draft-wysiwyg';
  import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
  import { stateToHTML } from "draft-js-export-html";

function FormFrete(props) {
    const [nome, setNome] = useState('');
    const [cep, setCep] = useState('');
    const [prazo, setPazo] = useState(EditorState.createEmpty());

    const notificacao = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        
        Api.post(`/fretes_supermix`, {
            nome,
            cep: setNumber(cep),
            prazo: stateToHTML(prazo.getCurrentContent())
        }, {
        }).then(res => {

            notificacao.current.notify("tr","success", "Cadastrado com Sucesso");

            setNome('');
            setCep('');
            setPazo(EditorState.createEmpty());

        }).catch((error) => {
            if (error.response.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response.error);
            }
        });
        
    }

    const removeItens = (value, mascara) => {
        for (let index = 0; index < mascara.length; index++) {
            const element = mascara[index].toString();
            // console.log(typeof element, element, element.length, element != "#");
            if (element != "#") {
                // console.log("aquiiiiiii");
                let re = new RegExp(element, 'g');
                value = value.replace(element,"");
            }
        }
        return value;
    }
    
    const existeItem = (value, mascara) => {
        for (let index = 0; index < mascara.length; index++) {
            const element = mascara[index];
            if (value[value.length-1] == element && element != "#") {
                return value.substring(0, value.length-1);
            }
        }
        return value;
    }

    const mascara = (id, mask) => {
        id = removeItens(id, mask);
        console.log(id);
        let mascara = mask;
        for (let index = 0; index < id.length; index++) {
            mask = mask.replace("#",id[index]);
        }
        let retorno = '';
        for (let index = 0; index < mask.length; index++) {
            const element = mask[index];
            if (element != "#") {
                retorno += ""+element;
            }else{
                break;
            }
        }
        retorno = existeItem(retorno, mascara);
        return retorno;
    }

    const setNumber = (value) => {
        return value.replace(/[^0-9\.]/g,'');
    }

    const handleChangeMask = (event) => {
        event.preventDefault();
        let change = {};

        let isNumber = event.target.attributes.number;

        let mask = event.target.attributes.mask;
        let value = event.target.value;

        value = isNumber ? setNumber(value) : value;

        let valueMask =  !mask ? value :  mascara( value, mask.value.toString() );

        return valueMask;
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
                            <h5 className="title">Cadastrar Frete</h5>
                        </CardHeader>
                        <CardBody>

                            <Row style={{marginRight: '-5px'}}>
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
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>CEP</label>
                                        <Input
                                        defaultValue=""
                                        required
                                        maxLength="9" 
                                        minLength="9" 
                                        mask="#####-###" 
                                        number="true" 
                                        value={cep}
                                        onChange={e => setCep( handleChangeMask(e) )}
                                        placeholder="Nome do Titular"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row style={{marginRight: '-5px'}}>
                                <Col className="pr-md-1" md="12">
                                    <FormGroup>
                                        <label>Prazo</label>
                                        <Editor editorState={prazo} onEditorStateChange={setPazo} editorClassName="editor-class" />
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

export default FormFrete;