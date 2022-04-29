// Developed by Luis Diplan All Rights Reserved 2022

import {React, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "universal-cookie";
import Sidebar from "../Components/Sidebar";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import axios from "axios";
import Users from "./Users";
export default function AdminDashboard(){
    const cookies = new Cookies();
    const role = cookies.get('role')
    const user = cookies.get('userName')
    const [users, setUsers] = useState([])
    const [invoices, setInvoices] = useState([])
    const [products, setProducts] = useState([])
    const options = {
        chart:{
            type:'line'
        },
        title: {
            text: 'Precios de Productos en Stock'
          },
          colors:['#000'],
          series: [{
            name: "Precio de producto",
            data: products.map(x=> x.price)
          }],
          xAxis:{
              categories:products.map(x=> x.itemName)
          },
          yAxis: {
            title: {
                text: 'Precios'
              }
          }  
      }
      const options1 = {
        title: {
            text: 'Cantidad de Productos en Stock'
          },
          chart:{
            type: 'pie'
          },
          series: [{
                name: 'Cantidad',
                data: products.map(product=> {
                  return ({
                    name: product.itemName,
                    y: product.qty
                  })
                })
          }],
 
      }   
      const options2 = {
        title: {
            text: 'Factura'
          },
          chart:{
            type: 'bar'},
          
          series: [{
              name: "Total",
            data: invoices.map(x=> x.total)
          },{
            name: "Subtotal",
          data: invoices.map(x=> x.subtotal)

        },{
            name: "Impuestos",
          data: invoices.map(x=> x.tax)
        }],
          xAxis:{
              categories:invoices.map(x=> x.id)
          },
          yAxis: {
              title: {
                  text: 'Dinero facturado'
                }
            }  
      }
      const getUsers = async ()=>{
        await axios.get('http://apiusers.somee.com/api/GetUsers').then(response=>{
          setUsers(response.data)
        })
      }
      const getInvoices = async ()=>{
        await axios.get('http://diplan0120-001-site1.itempurl.com/api/Invoices').then(response=>{
            setInvoices(response.data)
        })
      }
      const getProducts = async ()=>{
        await axios.get('http://mainserviceapi.somee.com/api/Items').then(response=>{
            setProducts(response.data)
        })
      }
    useEffect(()=>{
        getUsers();
        getProducts();
        getInvoices();
        if(role == 2){
            window.location.href='./udashboard';
        } else if(role == undefined){
            window.location.href='./';
        }
        
    },[])
    
    return(
        <Sidebar>
            <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-lg-3 col-sm-6">
                <div class="card-box bg-blue">
                    <div class="inner">
                        <h3> {products.length} </h3>
                        <p> Productos </p>
                    </div>
                    <div class="icon">
                    <i class="fa-solid fa-cart-flatbed"></i>
                    </div>
                    <a href="/products" class="card-box-footer">Ver más <i className="fa fa-arrow-circle-right"></i></a>
                </div>
            </div>

            <div class="col-lg-3 col-sm-6">
                <div class="card-box bg-green">
                    <div class="inner">
                        <h3> {invoices.length} </h3>
                        <p> Ventas Facturadas </p>
                    </div>
                    <div class="icon">
                    <i class="fa-solid fa-file-invoice-dollar"></i>

                    </div>
                    <a href="/invoices" class="card-box-footer">Ver más <i className="fa fa-arrow-circle-right"></i></a>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="card-box bg-orange">
                    <div class="inner">
                        <h3> {users.length} </h3>
                        <p> Usuarios Creados </p>
                    </div>
                    <div class="icon">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    </div>
                    <a href="/users" class="card-box-footer">Ver más <i className="fa fa-arrow-circle-right"></i></a>
                </div>
            </div>
        </div>
    </div>
    <div className="row">
        <div className="col-md-6     card">
        <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
        </div>
        <div className="col-md-6 card">
        <HighchartsReact
    highcharts={Highcharts}
    options={options1}
  />
        </div>      
    </div>
        <div className="center">
        <center>
        <div className="col-md-6 card">
        <HighchartsReact
    highcharts={Highcharts}
    options={options2}
  />
        </div>   
        </center>
        </div>
        </Sidebar>
    )
}