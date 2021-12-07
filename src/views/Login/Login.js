import React, {useState, useRef} from "react";

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
    Form, Spinner
  } from "reactstrap";

  import { Notifications } from "../Notifications";

  import Api from "../../api/api";
  import {login} from "../../api/auth";

function Login(props) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  const notificacao = useRef(null);

  const submit = (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    
    const data = {
      email, 
      password
    }
    
    Api.post(`/login`, data, {
    }).then(res => {
      console.log(res);
      login(res.data.token);
      setTimeout(function(){ 
        window.location = "/admin/dashboard";
      }, 500);
      
    }).catch((error) => {
        setLoading(false);
        if (error.response?.status == 401) {
            window.location = "/auth";
        } else{
            notificacao.current.notify("tr","danger", "Email ou senha incorretos!");
        }
    });

    // console.log(data);
  }

  return (
      <>
        <Notifications ref={notificacao}></Notifications>
        <div className="content" style={{padding: "78px 30px 30px 30px"}}>
          <Row style={{justifyContent: "center"}}>
              <Col md="6">
                <Form action="" onSubmit={e => submit(e)}>
                  <Card>
                    <CardHeader>
                      <h5 className="title">Login</h5>
                    </CardHeader>
                    <CardBody>
                      <Row style={{margin: "0"}}>
                        <Col className="pr-md-1" md="12">
                          <FormGroup>
                            <label>Email</label>
                            <Input
                            defaultValue=""
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row style={{margin: "0"}}>
                        <Col className="pr-md-1" md="12">
                          <FormGroup>
                            <label>Senha</label>
                            <Input
                            defaultValue=""
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Senha"
                            type="password"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row style={{margin: "0"}}>
                        <Col className="pr-md-1" md="12">
                          <Button type="submit" style={{width: "100%"}}>
                            {loading ? "Enviando..." : 'Entrar'}
                            {loading ? <Spinner color="primary" /> : null}
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
               </Form>
            </Col>
          </Row>
        </div>
      </>
  );
}

export default Login;