// Developed by Luis Diplan All Rights Reserved 2022

import {React, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "universal-cookie";
import Sidebar from "../Components/Sidebar"
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function Users(props){
    const MySwal = withReactContent(Swal)
    const cookies = new Cookies();
    const role = cookies.get('role')
    const user = cookies.get('userName')
    const baseUrl = "http://apiusers.somee.com/api"
    const [data,setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [modalInsertar,setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar]=useState(false);
    const [modalEliminar, setModalEliminar]=useState(false);
    const [selectedUser, setSelectedUser] = useState({
        id: '',
        userName: '',
        mail: '',
        password:'',
        role: '',
    });
    const [searchInput, setSearchInput] = useState("");
    const handleChange = e =>{
        const {name,value} = e.target;
        setSelectedUser({
          ...selectedUser,
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
                return (x.userName.toString().toLowerCase().includes(search.toLowerCase()) || x.id.toString().toLowerCase().includes(search.toLowerCase()) || !search)
            }
        }
    

      const peticionGet=async()=>{
        await axios.get(baseUrl+"/GetUsers").then(response=>{
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
        delete selectedUser.id;
        selectedUser.role=parseInt(selectedUser.role);
        await axios.post(baseUrl+"/InsertUser/", {...selectedUser})
        .then(response=>{
          console.log(response.data)
          peticionGet();
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
        console.log(selectedUser);
        await axios.put(baseUrl+"/UpdateUser", {...selectedUser}, { params: { id: selectedUser.id}})
        .then(response=>{
          var respuesta=response.data;
          var dataAuxiliar=data;
          dataAuxiliar.map(userData=>{
            if(userData.id===selectedUser.id){
              userData.userName=respuesta.userName;
              userData.mail = respuesta.mail;
              userData.password = respuesta.password;
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
          await axios.delete(baseUrl+"/DeleteUser", {params: { id: selectedUser.id}})
          .then(response=>{
           setData(data.filter(userData=>userData.id!==response.data));
            abrirCerrarModalEliminar();
            MySwal.fire({
              title:'Eliminado satisfactoriamente!',
              icon:'success',
              button:'Ok'
              })
              peticionGet()
          }).catch(error=>{
            MySwal.fire({
              title:'Error de Servidor',
              icon:'error',
              text:error,
              button:'Ok'
              })
          })
        }
      
      const seleccionarUserData=(userData,caso)=>{
        setSelectedUser(userData);
        (caso==="Editar")?
        abrirCerrarModalEditar(): abrirCerrarModalEliminar();
      }
    useEffect(()=>{
        if(role == 2){
            window.location.href='./udashboard';
        } else if(role == undefined){
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
      <button className = "btn btn btn-dark btn-new" onClick={()=>abrirCerrarModalInsertar()}> Nuevo Usuario <i className="fa fa-user-plus"></i></button>
      </div>
      <table className="table table-striped">
        <thead className = "">
          <tr>
            <th>ID</th>
            <th>Nombre De Usuario</th>
            <th>Correo Electrónico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data && 
          data.filter(filterSearch(searchInput)).map(userElement =>(
            <tr key={userElement.id}>
              <td>{userElement.id}</td>
              <td>{userElement.userName}</td>
              <td>{userElement.mail}</td>
              <td>{userElement.role == 1 ? 'Administrador' : 'Usuario Estándar'}</td>
              <td>
                <button class="btn btn-success"onClick={()=>seleccionarUserData(userElement, "Editar")}> <i className="fa fa-edit"></i></button> {" "}
                <button class="btn btn-danger"onClick={()=>seleccionarUserData(userElement, "Eliminar")}> <i className="fa fa-trash"></i></button> {" "}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <Modal isOpen = {modalInsertar} >
      <ModalHeader>Insertar nuevo usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="userName" onChange={handleChange} />
          <br />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="mail"onChange={handleChange}/>
          <br />
          <label>Contraseña: </label>
          <br />
          <input type="password" className="form-control" name="password"onChange={handleChange}/>
          <input type="text" className="form-control" hidden value='2' />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-dark"onClick={()=>peticionPost()}>Insertar</button>{" "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen = {modalEditar} >
      <ModalHeader> Editar Usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label> Id: </label>
          <br />
          <input type="text" className="form-control" readOnly value={selectedUser && selectedUser.id} />
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="userName" onChange={handleChange} value={selectedUser && selectedUser.userName}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="text" className="form-control" name="mail"onChange={handleChange} value={selectedUser && selectedUser.mail}/>
          <br />
          <label>Contraseña: </label>
          <br />
          <input type="password" className="form-control" name="password"onChange={handleChange} value={selectedUser && selectedUser.password}/>
          <br />
          <br />
          <label>Rol: </label>
          <input type="text" className="form-control" readOnly value={selectedUser && selectedUser.role == 1 ? 'Administrador' : 'Usuario Estándar'} />
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
        ¿Estás seguro que deseas eliminar el usuario ({selectedUser && selectedUser.userName})?
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