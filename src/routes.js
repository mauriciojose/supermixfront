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
import Dashboard from "views/Dashboard.js";
import Login from "views/Login/Login";

import Produtos from "views/Produtos/Produtos.js";
import FormProduto from "views/Produtos/FormProduto";
import FormEditProduto from "views/Produtos/FormEditProduto";

import Categorias from "views/Categorias/Categorias.js";
import FormCategoria from "views/Categorias/FormCategoria.js";
import FormEditCategoria from "views/Categorias/FormEditCategoria";

import SubCategorias from "views/SubCategorias/SubCategorias";
import FormSubCategoria from "views/SubCategorias/FormSubCategoria";
import FormEditSubCategoria from "views/SubCategorias/FormEditSubCategoria";

import Referencias from "views/Referencias/Referencias";
import FormReferencia from "views/Referencias/FormReferencia";

import Contas from "views/Contas/Contas";
import FormConta from "views/Contas/FormConta";

import Fretes from "views/Fretes/Fretes";
import FormFrete from "views/Fretes/FormFrete";

import Ingressos from "views/Ingressos/Ingressos";
import FormIngressos from "views/Ingressos/FormIngressos";

import Eventos from "views/Eventos/Eventos";
import FormEventos from "views/Eventos/FormEventos";

import Variacoes from "views/Variacoes/Variacoes";
import FormVariacao from "views/Variacoes/FormVariacao";

import { EditVariacoesProduto } from "views/Produtos/EditVariacoesProduto";

import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";

var routes = [
  {
    path: "/produtos",
    name: "Produtos",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Produtos,
    layout: "/admin",
  },
  {
    path: "/produtos/create/:pro_id/:etapa_param",
    name: "Produtos",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormProduto,
    layout: "/admin",
  },
  {
    path: "/produtos/edit/:produto_id",
    name: "Produtos",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormEditProduto,
    layout: "/admin",
  },
  {
    path: "/produto/variacao/edit/:produto_id",
    name: "Variações",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: EditVariacoesProduto,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Controle de Estoque",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/categorias",
    name: "Categorias",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Categorias,
    layout: "/admin",
  },
  {
    path: "/categorias/create",
    name: "Categorias",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormCategoria,
    layout: "/admin",
  },
  {
    path: "/categorias/edit/:categoria_id",
    name: "Categorias",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormEditCategoria,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    rtlName: "",
    sidebar: false,
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: Login,
    layout: "/admin",
  },
  {
    path: "/subcategorias",
    name: "SubCategorias",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: SubCategorias,
    layout: "/admin",
  },
  {
    path: "/subcategorias/create",
    name: "SubCategorias",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormSubCategoria,
    layout: "/admin",
  },
  {
    path: "/subcategorias/edit/:subcategoria_id",
    name: "Categorias",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormEditSubCategoria,
    layout: "/admin",
  },
  {
    path: "/variacoes",
    name: "Variações",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Variacoes,
    layout: "/admin",
  },
  {
    path: "/variacoes/create",
    name: "Variações",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormVariacao,
    layout: "/admin",
  },
  {
    path: "/referencias",
    name: "Referências",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Referencias,
    layout: "/admin",
  },
  {
    path: "/referencias/create",
    name: "Referências",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormReferencia,
    layout: "/admin",
  },
  {
    path: "/contas",
    name: "Contas",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Contas,
    layout: "/admin",
  },
  {
    path: "/contas/create",
    name: "Contas",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormConta,
    layout: "/admin",
  },
  {
    path: "/fretes_supermix",
    name: "Fretes",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Fretes,
    layout: "/admin",
  },
  {
    path: "/fretes_supermix/create",
    name: "Fretes",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormFrete,
    layout: "/admin",
  },
  {
    path: "/ingressos",
    name: "Ingressos",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Ingressos,
    layout: "/admin",
  },
  {
    path: "/ingressos/create",
    name: "Ingressos",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormIngressos,
    layout: "/admin",
  },
  {
    path: "/eventos",
    name: "Eventos",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Eventos,
    layout: "/admin",
  },
  {
    path: "/eventos/create",
    name: "Eventos",
    rtlName: "",
    visible: false,
    icon: "tim-icons icon-chart-pie-36",
    component: FormEventos,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Relatórios",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
];
export default routes;
