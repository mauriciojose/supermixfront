
import React from "react";

import { Notifications } from "../Notifications";

import Api from "../../api/api";

import { PreviewUploadImages } from "../../components/PreviewUploadImagesProduto/PreviewUploadImages";

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

class ProdutoFotos extends React.Component {
    constructor(props){
      super(props);

      this.photos = React.createRef();

      this.state = {
        loadingSend: false,
        pro_id: this.props.pro_id,
        codigo: ""
      }

      this.notificacaoImg = React.createRef();

      this.submit = this.submit.bind(this);

    }

    submit(e){
        e.preventDefault();

        if (this.photos.current.state.files.length == 0) {
            this.notificacaoImg.current.notify("tr","warning", "Selecione pelo menos uma imagem!");
            return;
        }
        
        const formData = new FormData();

        formData.append('produto_id', this.state.pro_id);
        formData.append('codigo', this.state.codigo);

        let files = this.photos.current.state.files;
        for (const key of Object.keys(files)) {
            formData.append('photos', files[key]);
        }
        
        Api.post(`/produto_images/${this.state.pro_id}/${this.state.codigo}`, formData, {
        }).then(res => {

            this.notificacaoImg.current.notify("tr","success", "Cadastrado com Sucesso");

            window.location = "/admin/produtos";

        }).catch((error) => {
            if (error.response.status == 401) {
                window.location = "/auth";
            } else{
                this.notificacaoImg.current.notify("tr","danger", error.response.error);
            }
        });
    }

    componentDidMount(){
        Api.get(`/produtos/by?key=id&value=${this.state.pro_id}`,{}).then(res => {

            this.setState({ codigo: res.data.codigo_unico });
            console.log(res.data);
              
        }).catch((error) => {
            if (error.response?.status == 401) {
                window.location = "/auth";
            } else{
                this.notificacaoImg.current.notify("tr","danger", error.response?.error);
            }
        });
      }

    render(){
        return(
            <>
                <Notifications ref={this.notificacaoImg}></Notifications>
                <Form action="" onSubmit={this.submit}>
                    <Row>
                        <Col md="12">
                            <PreviewUploadImages ref={this.photos}></PreviewUploadImages>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                        <Button 
                            className="btn-fill" 
                            color="primary" 
                            type={this.state.loadingSend ? '' : 'submit'}
                            >
                            {this.state.loadingSend ? "Enviando..." : 'Salvar e Continuar'}
                        </Button>
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }

}

export {ProdutoFotos};