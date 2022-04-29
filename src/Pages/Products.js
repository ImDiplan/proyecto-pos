// Developed by Luis Diplan All Rights Reserved 2022

import {React, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "universal-cookie";
import Sidebar from "../Components/Sidebar"
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'


export default function Products(props){
    const MySwal = withReactContent(Swal)
    const cookies = new Cookies();
    const role = cookies.get('role')
    const user = cookies.get('userName')
    const baseUrl = "http://mainserviceapi.somee.com/api/Items"
    const [data,setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [modalInsertar,setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar]=useState(false);
    const [modalEliminar, setModalEliminar]=useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState({
        id: '',
        itemName: '',
        qty: '',
        price:''
    });
    const [searchInput, setSearchInput] = useState("");
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })
    const handleChange = e =>{
        const {name,value} = e.target;
        setProductoSeleccionado({
          ...productoSeleccionado,
          [name]:value
        });
      
      }
      
      const abrirCerrarModalInsertar=()=>{
        setModalInsertar(!modalInsertar);
      }
      
      const abrirCerrarModalEditar=()=>{
        setModalEditar(!modalEditar);
      }
      
       const abrirCerrarModalEliminar=()=>{
        setModalEliminar(!modalEliminar);
      }
      const handleSearch=e=>{
        setSearchInput(e.target.value);
      }

      const filterSearch=(search)=>{
            return function(x){
                return (x.itemName.toString().toLowerCase().includes(search.toLowerCase()) || x.id.toString().toLowerCase().includes(search.toLowerCase()) || !search)
            }
        }
    

      const peticionGet=async()=>{
        await axios.get(baseUrl).then(response=>{
          setData(response.data);
          setTableData(response.data);
          console.log(response);
      }).catch(e=>{
        MySwal.fire({
            title:'Error de Servidor',
            icon:'error',
            text:e,
            button:'Ok'
            })
      })
      }
      
      const peticionPost=async()=>{
        delete productoSeleccionado.id;
        productoSeleccionado.qty=parseInt(productoSeleccionado.qty);
        productoSeleccionado.price=parseInt(productoSeleccionado.price);
        await axios.post(baseUrl, productoSeleccionado)
        .then(response=>{
          setData(data.concat(response.data));
          abrirCerrarModalInsertar();
          MySwal.fire({
            title:'Insertado satisfactoriamente!',
            icon:'success',
            button:'Ok'
            })
        }).catch(error=>{
            MySwal.fire({
                title:'Error de Servidor',
                icon:'error',
                text:error,
                button:'Ok'
                })
          
        })
      }
      
      const peticionPut=async()=>{
        await axios.put(baseUrl+"/"+productoSeleccionado.id, productoSeleccionado)
        .then(response=>{
          var respuesta=response.data;
          var dataAuxiliar=data;
          dataAuxiliar.map(producto=>{
            if(producto.id===productoSeleccionado.id){
              producto.itemName=respuesta.itemName;
              producto.qty = respuesta.qty;
              producto.price = respuesta.price;
              }
            });
            abrirCerrarModalEditar();
            MySwal.fire({
              title:'Actualizado satisfactoriamente!',
              icon:'success',
              button:'Ok'
              })
          }).catch(error=>{
            MySwal.fire({
                title:'Error de Servidor',
                icon:'error',
                text:error,
                button:'Ok'
                })
          })
        }
      
        const peticionDelete=async()=>{
          await axios.delete(baseUrl+"/"+productoSeleccionado.id)
          .then(response=>{
           setData(data.filter(producto=>producto.id!==response.data));
            abrirCerrarModalEliminar();
            MySwal.fire({
              title:'Eliminado satisfactoriamente!',
              icon:'success',
              button:'Ok'
              })
          }).catch(error=>{
            console.log(error);
          })
        }
      

      const seleccionarProducto=(producto,caso)=>{
        setProductoSeleccionado(producto);
        (caso==="Editar")?
        abrirCerrarModalEditar(): abrirCerrarModalEliminar();
      }

    useEffect(()=>{
        if(role == undefined){
            window.location.href='./';
        }
        peticionGet();
    },[])

    return(
        <Sidebar>

      <div className="action-btn">
        <div class="input-group sm-7">
            <input type="text" class="form-control" onChange={handleSearch} value={searchInput} placeholder="Buscar" aria-label="Buscar" aria-describedby="basic-addon2" />
            <span class="input-group-text search btn-primary" id="basic-addon2"><i className="fa fa-search"></i></span>
        </div>  
      <button className = "btn btn btn-dark btn-new" onClick={()=>abrirCerrarModalInsertar()}> Nuevo producto <i className="fa fa-plus-square"></i></button>
      </div>
      <table className="table table-striped">
        <thead className = "">
          <tr>
            <th># de Producto</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data && 
          data.filter(filterSearch(searchInput)).map(producto =>(
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.itemName}</td>
              <td>{producto.qty}</td>
              <td>{formatter.format(producto.price.toFixed(2))}</td>
              <td>
              <button class="btn btn-success"onClick={()=>seleccionarProducto(producto, "Editar")}> <i class="fa-solid fa-edit"></i></button> {" "}
                <button class="btn btn-danger"onClick={()=>seleccionarProducto(producto, "Eliminar")}> <i class="fa-solid fa-trash"></i></button> {" "}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <Modal isOpen = {modalInsertar} >
      <ModalHeader>Insertar nuevo producto</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="itemName" onChange={handleChange}/>
          <br />
          <label>Cantidad: </label>
          <br />
          <input type="text" className="form-control" name="qty"onChange={handleChange}/>
          <br />
          <label>Precio: </label>
          <br />
          <input type="text" className="form-control" name="price"onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-dark"onClick={()=>peticionPost()}>Insertar</button>{" "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen = {modalEditar} >
      <ModalHeader> Editar producto</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label> Id: </label>
          <br />
          <input type="text" className="form-control" readOnly value={productoSeleccionado && productoSeleccionado.id} />
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="itemName" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.itemName}/>
          <br />
          <label>Cantidad: </label>
          <br />
          <input type="text" className="form-control" name="qty"onChange={handleChange} value={productoSeleccionado && productoSeleccionado.qty}/>
          <br />
          <label>Precio: </label>
          <br />
          <input type="text" className="form-control" name="price"onChange={handleChange} value={productoSeleccionado && productoSeleccionado.price}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-dark" onClick = {()=>peticionPut()} >Editar</button>{" "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el producto ({productoSeleccionado && productoSeleccionado.itemName})?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}>
            No
          </button>
        </ModalFooter>
      </Modal>

        </Sidebar>
    )
}