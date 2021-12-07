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

  import Select from 'react-select';

  import "./produto.css";

  import { setFormatMoneyBr, setFormatDecimal } from "../../helpers/formatNumber";

  import { VariacoesProduto } from "./VariacoesProduto";
  import { ProdutoFotos } from "./ProdutoFotos";

  import { useParams } from "react-router";

function FormEditProduto(props) {
    
    let { etapa_param, pro_id } = useParams();

    const [subCategoriasMount, setSubCategoriasMount] = useState([]);
    const [subcategorias, setSubCategorias] = useState([]);
    const [unidadesMedida, setUnidades] = useState([]);
    const [pesos, setPesos] = useState([]);
    const [peso_id, setPesoId] = useState(''); 
    const [unidade_id, setUnidade] = useState(''); 
    const [nome, setNome] = useState(''); 
    const [codigo, setCodigo] = useState(''); 
    const [endereco_produto, setEndereco] = useState(''); 
    const [ativo, setAtivo] = useState(true); 
    const [home, setHome] = useState(true); 
    const [variacao, setVariacao] = useState(true); 
    const [peso, setPeso] = useState(0); 
    const [altura, setAltura] = useState(0); 
    const [largura, setLargura] = useState(0); 
    const [comprimento, setComprimento] = useState(0); 
    const [prioridade, setPrioridade] = useState(0); 
    const [quantidade, setQuantidade] = useState(0); 
    const [valor_venda, setValorVenda] = useState(0); 
    const [lucro, setLucro] = useState(0); 
    const [frete_super_mix, setFreteSuperMix] = useState(0); 
    const [pag_seguro, setPagSeguro] = useState(0); 
    const [tags, setTags] = useState(''); 
    const [fotos, setFotos] = useState(''); 
    
    const [descricao, setDescricao] = useState(EditorState.createEmpty());
    const [descricao_detalhada, setDescricaoDetalhada] = useState(EditorState.createEmpty());
    
    const [loading, setLoading] = useState(true);
    const [loadingSend, setLoadingSend] = useState(false);
    
    const [step, setStep] = useState(etapa_param);

    const notificacao = useRef(null);

    const { produto_id } = useParams();

    useEffect(() => {
      
        Api.get(`/unidade_medidas`,{}).then(res => {
  
            setUnidades(res.data);
            if (res.data?.length > 0) {
                setUnidade(res.data[0].id);
            }
  
        }).catch((error) => {
            if (error.response?.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response?.error);
            }
        });
      
        Api.get(`/pesos`,{}).then(res => {
  
            setPesos(res.data);
            if (res.data?.length > 0) {
                setPesoId(res.data[0].id);
            }
  
        }).catch((error) => {
            if (error.response?.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response?.error);
            }
        });
      
      
        Api.get(`/produtos/by?key=id&value=${produto_id}`,{}).then(res => {


            setPesoId(res.data.peso_id);
            setUnidade(res.data.unidade_medida_id);
            setNome(res.data.nome);
            setCodigo(res.data.codigo);
            setEndereco(res.data.endereco_produto);
            setAtivo(res.data.ativo);
            setHome(res.data.home);
            setVariacao(res.data.variacao);

            setPeso( preparaValor( res.data.peso ));
            setAltura( preparaValor( res.data.altura ));
            setLargura( preparaValor( res.data.largura ));
            setComprimento( preparaValor( res.data.comprimento ));

            setPrioridade(res.data.prioridade);
            setQuantidade(res.data.quantidade);

            setValorVenda( preparaValor( res.data.valor_venda ));
            setLucro( preparaValor( res.data.lucro ));
            setFreteSuperMix( preparaValor( res.data.frete_super_mix ));
            setPagSeguro( preparaValor( res.data.pag_seguro ));

            setTags(res.data.tags);
            setFotos(res.data.fotos);

            const blocksFromHTML = convertFromHTML(res.data.descricao);
            const content = ContentState.createFromBlockArray(blocksFromHTML);
            setDescricao(EditorState.createWithContent(content));
            
            const blocksFromHTML1 = convertFromHTML(res.data.descricao_detalhada);
            const content1 = ContentState.createFromBlockArray(blocksFromHTML1);
            setDescricaoDetalhada(EditorState.createWithContent(content1));
            //setDescricaoDetalhada(res.data.descricao_detalhada);

            var subcategoriasSelected = res.data.subcategorias;

            Api.get(`/subcategorias?key=ativo&value=true`,{}).then(response => {
                // subcategorias, setSubCategorias
                setSubCategorias([]);
                if (response.data?.length > 0) {
                    let newSubcateorias = response.data.map((value, index, array) => {
                        if (subcategoriasSelected.includes(value.id.toString())) {
                            subcategorias.push({
                                value: value.id, 
                                label: value.nome
                            });
                            setSubCategorias(subcategorias);
                        }
                      return {
                        value: value.id, 
                        label: value.nome
                      }
                    });
                    
                    setSubCategoriasMount(newSubcateorias);
                }
                // console.log(subcategorias, subcategoriasSelected);
      
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
                //notificacao.current.notify("tr","danger", error.response?.error);
            }
        });

        
  
      },[loading]);

      const preparaValor = (value) => {
        value = value == undefined || value == null ? 0 : value;
        value = parseFloat(value) == 0 ? 0 : parseFloat(value).toFixed(2);
        return value * 100;
      }

    const submit = (e) => {
        e.preventDefault();

        if ( subcategorias.length == 0 ) {
            notificacao.current.notify("tr","warning", "Selecione pelo menos uma categoria.");
            return false;
        }
        // console.log(peso);
        // return;
        let produto = {
            codigo,
            nome,
            descricao: stateToHTML(descricao.getCurrentContent()),
            descricao_detalhada: stateToHTML(descricao_detalhada.getCurrentContent()),
            tags,
            fotos,
            valor_venda: valor_venda/100,
            quantidade,
            ativo,
            home,
            variacao,
            peso: peso/100,
            altura: altura/100,
            largura: largura/100,
            comprimento: comprimento/100,
            lucro: lucro/100,
            endereco_produto,
            frete_super_mix: frete_super_mix/100,
            pag_seguro: pag_seguro/100,
            prioridade,
            peso_id,
            unidade_medida_id: unidade_id,
            subcategorias: subcategorias.map( (value, index, array) => {
                return value.value
            } )
        };
        

        setLoadingSend(true);

        Api.put(`/produtos/${produto_id}`, produto, {
        }).then(res => {
            setLoadingSend(false);
            
            notificacao.current.notify("tr","success", "Atualizado com Sucesso");

            setTimeout(() => {
                window.location=`/admin/produtos`; 
            }, 1000);

        }).catch((error) => {
            if (error.response.status == 401) {
                window.location = "/auth";
            } else{
                notificacao.current.notify("tr","danger", error.response.error);
            }
            setLoadingSend(false);
        });
        
    }

    const getKey = (e, value) => {
        // console.log(e.key);
        if (e.key === "Backspace") {
            return value.toString().slice(0,-1).replace(/\D/g, "");
        } else {
            return value.toString()+e.key.toString().replace(/\D/g, "");
        }
    }

    const stepOne = () =>{
        console.log(subcategorias);
        return <Row>
            <Col md="12">
                <Form action="" onSubmit={e => submit(e)}>
                    <Card>
                        <CardHeader>
                            <h5 className="title">Cadastrar Produto</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label>Prioridade</label>
                                                <Input
                                                value={prioridade}
                                                onChange={e => setPrioridade(e.target.value)}
                                                placeholder="Selecione a Prioridade"
                                                type="select"
                                                required
                                                >
                                                    <option value="0">Nenhuma</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <label>Tags</label>
                                                <Input
                                                defaultValue=""
                                                value={tags}
                                                onChange={e => setTags(e.target.value)}
                                                placeholder="Tags"
                                                type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                                
                                <Col className="pr-md-1" md="6" style={{margin: "auto"}}>
                                    <Row>
                                        <Col md="3">
                                            <ToggleSwitch
                                                checked={ativo}
                                                text="Ativo"
                                                size={"default"}
                                                onChange={() => setAtivo(!ativo)}
                                                offstyle="btn-danger"
                                                onstyle="btn-success"
                                            />
                                        </Col>
                                        <Col md="4">
                                            <ToggleSwitch
                                                checked={home}
                                                text="Exibe na Home"
                                                size={"default"}
                                                onChange={() => setHome(!home)}
                                                offstyle="btn-danger"
                                                onstyle="btn-success"
                                            />
                                        </Col>
                                        <Col md="4">
                                            <ToggleSwitch
                                                checked={variacao}
                                                text="Tem Variação"
                                                size={"default"}
                                                onChange={() => setVariacao(!variacao)}
                                                offstyle="btn-danger"
                                                onstyle="btn-success"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

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
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Código</label>
                                        <Input
                                        defaultValue=""
                                        value={codigo}
                                        onChange={e => setCodigo(e.target.value)}
                                        placeholder="Código"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Endereço</label>
                                        <Input
                                        defaultValue=""
                                        value={endereco_produto}
                                        onChange={e => setEndereco(e.target.value)}
                                        placeholder="Endereço"
                                        type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="12">
                                <FormGroup>
                                    <label>SubCategorias</label>
                                    <Select isMulti options={subCategoriasMount} 
                                    value={subcategorias}
                                    onChange={setSubCategorias} />
                                </FormGroup>
                                </Col>
                            </Row>

                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="12">
                                    <FormGroup>
                                        <label>Descrição</label>
                                        <Editor editorState={descricao} onEditorStateChange={setDescricao} editorClassName="editor-class" />
                                    </FormGroup> 
                                    {/* <FormGroup>
                                        <label>Descrição</label>
                                        <Input
                                        defaultValue=""
                                        value={descricao}
                                        onChange={e => setDescricao(e.target.value)}
                                        placeholder="Descrição"
                                        type="text"
                                        required
                                        />
                                    </FormGroup> */}
                                </Col>
                            </Row>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="12">
                                    <FormGroup>
                                        <label>Descrição Detalhada</label>
                                        <Editor editorState={descricao_detalhada} onEditorStateChange={setDescricaoDetalhada} editorClassName="editor-class" />
                                        {/* <Input
                                        defaultValue=""
                                        value={descricao_detalhada}
                                        onChange={e => setDescricaoDetalhada(e.target.value)}
                                        placeholder="Descrição Detalhada"
                                        type="text"
                                        /> */}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Peso</label>
                                        <Row>
                                            <Col md="7" style={{paddingRight: "0"}}>
                                                <Input
                                                value={setFormatDecimal(peso)}
                                                onKeyDown={e => setPeso(getKey(e,peso))}
                                                placeholder="Peso"
                                                type="text"
                                                required
                                                >
                                                </Input>
                                            </Col>
                                            <Col md="5">
                                                <Input
                                                value={peso_id}
                                                onChange={e => setPesoId(e.target.value)}
                                                placeholder="Selecione o Peso"
                                                type="select"
                                                required
                                                >
                                                <option value="">Selecione o Peso</option>
                                                {
                                                    pesos.map((value, index, array) => {
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
                                                    value={setFormatDecimal(altura)}
                                                    onKeyDown={e => setAltura(getKey(e,altura))}
                                                    placeholder="Altura"
                                                    type="text"
                                                    required
                                                    >
                                                </Input>
                                            </Col>
                                            <Col md="5">
                                                <Input
                                                value={unidade_id}
                                                onChange={e => setUnidade(e.target.value)}
                                                placeholder="Selecione o Unidade de Medida"
                                                type="select"
                                                required
                                                >
                                                {
                                                    unidadesMedida.map((value, index, array) => {
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
                                                    value={setFormatDecimal(comprimento)}
                                                    onKeyDown={e => setComprimento(getKey(e,comprimento))}
                                                    placeholder="Comprimento"
                                                    type="text"
                                                    required
                                                    >
                                                </Input>
                                            </Col>
                                            <Col md="5">
                                                <Input
                                                value={unidade_id}
                                                onChange={e => setUnidade(e.target.value)}
                                                placeholder="Selecione o Unidade de Medida"
                                                type="select"
                                                required
                                                >
                                                {
                                                    unidadesMedida.map((value, index, array) => {
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
                                                    value={setFormatDecimal(largura)}
                                                    onKeyDown={e => setLargura(getKey(e,largura))}
                                                    placeholder="Largura"
                                                    type="text"
                                                    required
                                                    >
                                                </Input>
                                            </Col>
                                            <Col md="5">
                                                <Input
                                                value={unidade_id}
                                                onChange={e => setUnidade(e.target.value)}
                                                placeholder="Selecione o Unidade de Medida"
                                                type="select"
                                                required
                                                >
                                                {
                                                    unidadesMedida.map((value, index, array) => {
                                                        return <option value={value.id}>{value.nome}</option>;
                                                    })
                                                }
                                                </Input>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{marginRight:"-5px"}}>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Valor de Venda</label>
                                        <Input
                                        defaultValue=""
                                        value={setFormatMoneyBr(valor_venda)}
                                        onKeyDown={(e) => { setValorVenda( getKey(e,valor_venda) ) } }
                                        // onChange={e => setValorVenda(e.target.value)}
                                        placeholder="Valor Venda"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>MARGEM DE LUCRO</label>
                                        <Input
                                        defaultValue=""
                                        value={setFormatDecimal(lucro)}
                                        onKeyDown={ ( e ) => { setLucro(getKey(e,lucro)) } }
                                        placeholder="MARGEM DE LUCRO"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Frete Super Mix</label>
                                        <Input
                                        defaultValue=""
                                        value={setFormatDecimal(frete_super_mix)}
                                        onKeyDown={e => setFreteSuperMix(getKey(e,frete_super_mix))}
                                        placeholder="Frete Super Mix"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="3">
                                    <FormGroup>
                                        <label>Taxa Cartão</label>
                                        <Input
                                        defaultValue=""
                                        value={setFormatDecimal(pag_seguro)}
                                        onKeyDown={e => setPagSeguro(getKey(e,pag_seguro))}
                                        placeholder="Taxa Cartão"
                                        type="text"
                                        required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button 
                                className="btn-fill" 
                                color="primary" 
                                type={loadingSend ? '' : 'submit'}
                                >
                                {loadingSend ? "Enviando..." : 'Salvar e Continuar'}
                            </Button>
                        </CardFooter>
                    </Card>
                </Form>
            </Col>
        </Row> 
    }

    return (
        <>
            <Notifications ref={notificacao}></Notifications>
            <div className="content">
                { stepOne() }
            </div>
        </>
    );
}

export default FormEditProduto;