

import React from "react";

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

import { Notifications } from "../Notifications";

import Api from "../../api/api";
import { array, element } from "prop-types";
import ToggleSwitch from "components/ToogleSwitch/ToggleSwitch";

import { setFormatMoneyBr, setFormatDecimal } from "../../helpers/formatNumber";

class VariacoesProduto extends React.Component {
    constructor(props){
      super(props);

      const { pro_id } = 0;

      this.state = {
        optionsRef: [],
        refId: null,
        optionsVar: [],
        refSelected: {},
        arrayVariations: [],
        arrayVariationsNew: [],
        loadingSend: false,
        pro_id: this.props.pro_id
      }

      this.notificacaoVar = React.createRef();

      this.handleChangeRef = this.handleChangeRef.bind(this);
      this.handleChangeVar = this.handleChangeVar.bind(this);

      this.handleChangeVariacao = this.handleChangeVariacao.bind(this);
      this.handleChangeValorVendaVariacao = this.handleChangeValorVendaVariacao.bind(this);
      this.submit = this.submit.bind(this);
      this.getKey = this.getKey.bind(this);
    }

    cartesian(arrays) {
      var r = [], max = arrays.length-1;
      max = max;
      function helper(arr, i) {
        console.log(arrays[i]);
          for (var j=0, l=arrays[i].length; j<l; j++) {
              var a = arr.slice(0); // clone arr
              a.push(arrays[i][j]);
              if (i==max)
                  r.push(a);
              else
                  helper(a, i+1);
          }
      }
      helper([], 0);
      return r;
    }

    handleChangeVar(e){

      let refSelected = this.state.refSelected;

      let sinal = 1;
      if ( refSelected[this.state.refId].length > e.length ) {
        sinal = -1;
      }

      refSelected[this.state.refId] = e;

      this.setState({refSelected});

      let arrays = this.getMergeArray(refSelected);

      arrays = this.cartesian(arrays);


      this.setState({arrayVariations: arrays});
      
      let newsArray = {};
      for (let index = 0; index < arrays.length; index++) {
        const element = arrays[index];
        
        let variacao = this.getKey(element);

        

        let keyExists = this.getKeyOld( this.state.arrayVariationsNew, variacao, sinal ) ;

        if (keyExists === null) {
          
          newsArray[variacao] = {
            codigoOld: new Date().getTime(),
            codigo: '',
            valor_venda: '',
            endereco: '',
            quantidade: 0,
            ativo: true,
            peso: 0,
            altura: 0, 
            largura: 0, 
            comprimento: 0,
            peso_id: this.state.pesos.length > 0 ? this.state.pesos[0].id : 0,
            unidade_medida_id: this.state.unidadesMedida.length > 0 ? this.state.unidadesMedida[0].id : 0,
            values: this.getTrVariacao(element),
            variacoes: this.getKeyArray(element),
            // pesos: [],
            // unidadesMedida: []
          };

        } else {
          newsArray[variacao] = {
            ...this.state.arrayVariationsNew[keyExists],
            values: this.getTrVariacao(element),
            variacoes: this.getKeyArray(element)
          };
        }


      }
      
      this.setState({arrayVariationsNew: newsArray});

      console.log( newsArray );

    }

    getKeyOld( array, variacao, sinal ){
      let keys = Object.keys(array);
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];

        if ( sinal == 1 ) {
          
          if (variacao.includes(element)) {
            return element;
          }

        } else {
          
          if (element.includes(variacao)) {
            return element;
          }

        }

      }
      return null;
    }

    comparaArray( array1, array2 ){
      if (array1.sort().join('|') === array2.sort().join('|')) {
        console.log('The arrays are equal.');
      } else {
          console.log('The arrays are NOT equal.');
      }
    }

    getMergeArray(refSelected){
      let arrays = [];
      let object = refSelected;
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          
          let element = object[key];
          let arrayItem = [];
          for (const item of element) {
            arrayItem.push({
              variacao: item?.value,
              label: item?.label,
              referencia: key
            });
          }       
          if (arrayItem.length > 0) {
            arrays.push(arrayItem);   
          }
          
        }
      }
      return arrays;
    }

    handleChangeRef(e){
      // console.log(e, e.value);

      Api.get(`/variacoes/by?key=referencia_id&value=${e.value}`,{}).then(res => {

        if (res.data?.length > 0) {
            let referencias = res.data.map((value, index, array) => {
              return {
                value: value.id, label: value.nome
              }
            });
            this.setState({optionsVar: referencias});
        }

      }).catch((error) => {
          if (error.response?.status == 401) {
              window.location = "/auth";
          } else{
              this.notificacaoVar.current.notify("tr","danger", error.response?.error);
          }
      });

      this.setState({refId: e.value});

    }

    componentDidMount(){
      console.log(this.state);
      Api.get(`/referencias`,{}).then(res => {

        var refSelected = {}; 

        if (res.data?.length > 0) {
            let referencias = res.data.map((value, index, array) => {

              if ( refSelected[value.id]  === undefined ) {
                refSelected[value.id] = [];
              }

              return {
                value: value.id, label: value.nome
              }
            });
            // this.setState({refSelected});
            this.setState({optionsRef: referencias, refSelected});
        }

      }).catch((error) => {
          if (error.response?.status == 401) {
              window.location = "/auth";
          } else{
              this.notificacaoVar.current.notify("tr","danger", error.response?.error);
          }
      });

      Api.get(`/unidade_medidas`,{}).then(res => {
  
        // setUnidades();
        this.setState({
          unidadesMedida: res.data
        });
        // if (res.data?.length > 0) {
        //     setUnidade(res.data[0].id);
        // }

    }).catch((error) => {
        if (error.response?.status == 401) {
            window.location = "/auth";
        } else{
            // notificacao.current.notify("tr","danger", error.response?.error);
        }
    });
  
    Api.get(`/pesos`,{}).then(res => {

        // setPesos(res.data);
        this.setState({
          pesos: res.data
        });
        // if (res.data?.length > 0) {
        //     setPesoId(res.data[0].id);
        // }

    }).catch((error) => {
        if (error.response?.status == 401) {
            window.location = "/auth";
        } else{
            // notificacao.current.notify("tr","danger", error.response?.error);
        }
    });

    }

    submit(e){
      e.preventDefault();

      let variacoes = [];

      for (const key in this.state.arrayVariationsNew) {
        if (Object.hasOwnProperty.call(this.state.arrayVariationsNew, key)) {
          let element = {...this.state.arrayVariationsNew[key]};
          element.valor_venda = element.valor_venda/100; 
          element.peso = element.peso/100; 
          element.altura = element.altura/100; 
          element.largura = element.largura/100; 
          element.comprimento = element.comprimento/100; 
          element = {
            ...element,
            produto_id: this.state.pro_id
          }; 
          variacoes.push(element);
        }
      }

      // console.log(variacoes);
      // return false;

    
      this.setState({loadingSend: true});

        Api.post(`/variacoes_produto`, variacoes, {
        }).then(res => {

            this.notificacaoVar.current.notify("tr","success", "Cadastrado com Sucesso");
            this.setState({loadingSend:false});
            setTimeout(() => {
              window.location=`/admin/produtos/create/${this.state.pro_id}/2`; 
          }, 1000);
            
          }).catch((error) => {
            if (error.response.status == 401) {
              window.location = "/auth";
            } else{
              this.notificacaoVar.current.notify("tr","danger", error.response.error);
            }
            this.setState({loadingSend:false});
            
        });

      console.log(variacoes);

    }

    render(){
        return (
          <>
            <Notifications ref={this.notificacaoVar}></Notifications>
            <legend>VARIAÇÕES</legend>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Referência</label>
                    <Select options={this.state.optionsRef} onChange={this.handleChangeRef}/>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Variações</label>
                    <Select isMulti options={this.state.optionsVar} 
                    value={this.state.refSelected[this.state.refId]}
                    onChange={this.handleChangeVar} />
                </FormGroup>
              </Col>
            </Row>

            <h4 style={{marginTop:'20px', color:'white'}}>Lista de Variações</h4>
            <hr />
            <Form  action="" onSubmit={this.submit}>

            <Row>
                <Button 
                    className="btn-fill" 
                    color="primary" 
                    type={this.state.loadingSend ? '' : 'submit'}
                    >
                    {this.state.loadingSend ? "Enviando..." : 'Salvar e Continuar'}
                </Button>
              </Row>

              <div className="table">
                  {/* <thead> */}
                      <Row style={{margin: '20px 0 0 0'}}>
                          <Col md="3" style={{paddingLeft: '0'}}>Variacão</Col>
                          <Col md="3">Código</Col>
                          <Col md="1">Ativo</Col>
                          <Col md="2">Valor Venda</Col>
                          <Col md="3">Endereço</Col>
                      </Row>
                  <div style={{borderBottom: "1px solid white"}}></div>
                  {/* </thead> */}
                  {/* <tbody className="tbody"> */}
                    {
                      this.getVariacoes(this.state.arrayVariationsNew)
                    }
                  {/* </tbody> */}
              </div>
              
            </Form>

          </>
        );
    }

    handleChangeVariacao(event) {
      event.preventDefault();
      // console.log( this.state.arrayVariationsNew[event.target.dataset.codigo][event.target.name] );
      this.state.arrayVariationsNew[event.target.dataset.codigo][event.target.name] = event.target.value;
      this.setState({
        arrayVariationsNew: this.state.arrayVariationsNew
      });
    }

    handleChangeAtivoVariacao(key) {
      
      this.state.arrayVariationsNew[key]['ativo'] = !this.state.arrayVariationsNew[key]['ativo'];
      this.setState({
        arrayVariationsNew: this.state.arrayVariationsNew
      });
    }

    handleChangeValorVendaVariacao(key, valor) {
      // console.log(key, valor,this.state.arrayVariationsNew[key]['valor_venda']);
      this.state.arrayVariationsNew[key]['valor_venda'] = valor;
      this.setState({
        arrayVariationsNew: this.state.arrayVariationsNew
      });
    }

    handleChangeMedidas(key, valor, keyItem) {
      // console.log(key, valor,this.state.arrayVariationsNew[key]['valor_venda']);
      this.state.arrayVariationsNew[key][keyItem] = valor;
      this.setState({
        arrayVariationsNew: this.state.arrayVariationsNew
      });
    }

    getVariacoes( value ){
      
      let arrayItens = [];
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const element = value[key];
          arrayItens.push(<div>

            <Row style={{margin: '18px 4px'}}>
              <Col md="3">{element.values}</Col>
              <Col md="3">
                <Input
                  size={2}
                  defaultValue={''}
                  value ={element.codigo}
                  name = "codigo"
                  data-codigo={key}
                  required
                  onChange={this.handleChangeVariacao}
                ></Input>
              </Col>
              <Col md="1">
                <ToggleSwitch
                  checked={element.ativo}
                  text=""
                  size={"default"}
                  name = "ativo"
                  data-codigo={key}
                  onChange={ e => this.handleChangeAtivoVariacao(key)}
                  offstyle="btn-danger"
                  onstyle="btn-success"
                />
              </Col>
              <Col md="2">
              <Input  
                  size={2}
                  value={setFormatMoneyBr(element.valor_venda)}
                  name = "valor_venda"
                  data-codigo={key}
                  required
                  onKeyDown={e => this.handleChangeValorVendaVariacao(key, this.getKeyItem(e,element.valor_venda))}
                ></Input>
              </Col>
              <Col md="3">
                <Input
                  size={2}
                  value ={element.endereco}
                  name = "endereco"
                  data-codigo={key}
                  onChange={this.handleChangeVariacao}
                ></Input>
              </Col>
            </Row>

            <Row style={{marginRight:"-5px"}}>
              <Col className="pr-md-1" md="3">
                  <FormGroup>
                      <label>Peso</label>
                      <Row>
                          <Col md="7" style={{paddingRight: "0"}}>
                              <Input
                              placeholder="Peso"
                              type="text"
                              value={setFormatDecimal(element.peso)}
                              name = "peso"
                              data-codigo={key}
                              required
                              onKeyDown={e => this.handleChangeMedidas(key, this.getKeyItem(e,element.peso), 'peso')}
                              >
                              </Input>
                          </Col>
                          <Col md="5">
                              <Input
                              value={element.peso_id}
                              onChange={this.handleChangeVariacao}
                              placeholder="Selecione o Peso"
                              type="select"
                              required
                              name = "peso_id"
                              data-codigo={key}
                              >
                              {/* <option value="">Selecione o Peso</option> */}
                              {
                                  this.state.pesos.map((value, index, array) => {
                                      return <option value={value.id}>{value.nome}</option>;
                                  })
                              }
                          </Input>
                          </Col>
                      </Row>
                  </FormGroup>
              </Col>
              <Col className="pr-md-1" md="3">
                  <FormGroup>
                      <label>Altura</label>
                      <Row>
                          <Col md="7" style={{paddingRight: "0"}}>
                            <Input
                              placeholder="Altura"
                              type="text"
                              value={setFormatDecimal(element.altura)}
                              name = "altura"
                              data-codigo={key}
                              required
                              onKeyDown={e => this.handleChangeMedidas(key, this.getKeyItem(e,element.altura), 'altura')}
                            >
                            </Input>
                          </Col>
                          <Col md="5">
                              <Input
                              value={element.unidade_medida_id}
                              onChange={this.handleChangeVariacao}
                              placeholder="Selecione o Peso"
                              type="select"
                              required
                              name = "unidade_medida_id"
                              data-codigo={key}
                              >
                              {
                                  this.state.unidadesMedida.map((value, index, array) => {
                                      return <option value={value.id}>{value.nome}</option>;
                                  })
                              }
                              </Input>
                          </Col>
                      </Row>
                  </FormGroup>
              </Col>
              <Col className="pr-md-1" md="3">
                  <FormGroup>
                      <label>Comprimento</label>
                      <Row>
                          <Col md="7" style={{paddingRight: "0"}}>
                            <Input
                              placeholder="Comprimento"
                              type="text"
                              value={setFormatDecimal(element.comprimento)}
                              name = "comprimento"
                              data-codigo={key}
                              required
                              onKeyDown={e => this.handleChangeMedidas(key, this.getKeyItem(e,element.comprimento), 'comprimento')}
                            >
                            </Input>
                          </Col>
                          <Col md="5">
                              <Input
                              value={element.unidade_medida_id}
                              onChange={this.handleChangeVariacao}
                              placeholder="Selecione o Peso"
                              type="select"
                              required
                              name = "unidade_medida_id"
                              data-codigo={key}
                              >
                              {
                                  this.state.unidadesMedida.map((value, index, array) => {
                                      return <option value={value.id}>{value.nome}</option>;
                                  })
                              }
                              </Input>
                          </Col>
                      </Row>
                  </FormGroup>
              </Col>
              <Col className="pr-md-1" md="3">
                  <FormGroup>
                      <label>Largura</label>
                      <Row>
                          <Col md="7" style={{paddingRight: "0"}}>
                            <Input
                              placeholder="Largura"
                              type="text"
                              value={setFormatDecimal(element.largura)}
                              name = "largura"
                              data-codigo={key}
                              required
                              onKeyDown={e => this.handleChangeMedidas(key, this.getKeyItem(e,element.largura), 'largura')}
                            >
                            </Input>
                          </Col>
                          <Col md="5">
                              <Input
                              value={element.unidade_medida_id}
                              onChange={this.handleChangeVariacao}
                              placeholder="Selecione o Peso"
                              type="select"
                              required
                              name = "unidade_medida_id"
                              data-codigo={key}
                              >
                              {
                                  this.state.unidadesMedida.map((value, index, array) => {
                                      return <option value={value.id}>{value.nome}</option>;
                                  })
                              }
                              </Input>
                          </Col>
                      </Row>
                  </FormGroup>
              </Col>
            </Row>

            <div style={{borderBottom: "1px solid white"}}></div>

          </div>);
        }
      }
      return arrayItens;

    }

    getKeyItem(e, value){
      console.log(e.key);
      if (e.key === "Backspace") {
          return value.toString().slice(0,-1).replace(/\D/g, "");
      } else {
          return value.toString()+e.key.toString().replace(/\D/g, "");
      }
    }

    getTrVariacao(value){
      
      let arrayItens = '';
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const element = value[key];
          arrayItens += element.label+' * ';
        }
      }
      return arrayItens;
    }

    getKey(value){
      
      let arrayItens = '';
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const element = value[key];
          arrayItens += element.referencia+' * '+element.variacao+' ';
        }
      }
      return arrayItens;
    }

    getKeyArray(value){
      
      let arrayItens = [];
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const element = value[key];
          arrayItens.push(element.variacao);
        }
      }
      return arrayItens;
    }
}

export {VariacoesProduto};