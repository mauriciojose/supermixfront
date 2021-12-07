/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";

import { useHistory } from "react-router-dom";

import "./tables.css";

function Tables(props) {

  const history = useHistory();

  const routeChange = () =>{ 
    let path = props.location+"/create"; 
    history.push(path);
  }

  const routeChangeEdit = (id) =>{ 
    let path = props.location+"/edit/"+id; 
    history.push(path);
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  <Row>
                    <Col md="8">{props.title}</Col>
                    <Col md="4">
                      <Button onClick={routeChange}>{props.button_title}</Button>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      {
                        props.headers?.map((value, index, array) => {
                          return <th>{value}</th>
                        })
                      }
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        props.bodys?.map((value, index, array) => {
                          return <tr key={value}>
                            {
                              props.incluir?.map((value_includes, index_includes, array_includes) => {
                                console.log(value,value_includes,value[value_includes]);

                                return <td>{ props.datas?.includes(value_includes) ? new Date(value[value_includes]).toLocaleDateString('pt-br') : value[value_includes] }</td>

                              })
                            }
                            <td><Button onClick={()=> routeChangeEdit(value.id)}>{"Editar"}</Button></td>
                          </tr>
                        })
                    }
                    {/* <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr> */}
                    
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;
