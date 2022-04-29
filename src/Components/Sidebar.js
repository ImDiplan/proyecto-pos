// Developed by Luis Diplan All Rights Reserved 2022

import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import Cookies from "universal-cookie";
import '../Assets/Css/sidebar.css'

export default function Sidebar(props){
    const cookies = new Cookies();
    const role = cookies.get('role')
    const user = cookies.get('userName')
    const Logout = () => {
        cookies.remove('role',{path: "/"})
        cookies.remove('userName',{path: "/"})
        window.location.href='./'
    }
    const location = window.location.href;
    return(
        <div class="home">
        <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark navegacion" >
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <span class="fs-4">ProyectoPOS</span>
    </a>
    <hr/>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item ">
        <a href="/udashboard" class={location.includes('dashboard') ? "nav-link active" : "nav-link text-white"} aria-current="page">
        <i class="fa-solid fa-house"></i> Dashboard
        </a>
      </li>
      <li class="nav-item">
        <a href="/products" class={location.includes('products') ? "nav-link active" : "nav-link text-white"}>
        <i class="fa-solid fa-cart-flatbed"></i> Productos
        </a>
      </li>
      <li class="nav-item">
        <a href="/invoices" class={location.includes('invoices') ? "nav-link active" : "nav-link text-white"}>
        <i class="fa-solid fa-file-invoice-dollar"></i> Facturas
        </a>
      </li>
      <li class="nav-item">
        <a href="/users" class={role == 2 ? "hidden" : location.includes('users') ? "nav-link active" : "nav-link text-white"}>
        <i class="fa-solid fa-users"></i> Usuarios
        </a>
      </li>
    </ul>
    <hr/>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2" />
        <strong>{user}</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
        <li><a class="dropdown-item" onClick={Logout}>Sign out <i class="fa-solid fa-right-from-bracket"></i></a></li>
      </ul>
    </div>
  </div>
  <div id="page-wrapper">
        <div class="container-fluid">
            <div class="row" id="main" >
                <div class="col-sm-12 col-md-12 well" id="content">
                    {props.children}
                </div>
            </div>
        </div>
    </div>

  </div>
    )
}