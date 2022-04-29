import {React, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Cookies from "universal-cookie";
import Sidebar from "../Components/Sidebar"
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function Invoices(props){
    const MySwal = withReactContent(Swal)
    const cookies = new Cookies();
    const role = cookies.get('role')
    const user = cookies.get('userName')
    const baseUrl = "http://diplan0120-001-site1.itempurl.com/api/Invoices"
    const [data,setData] = useState([]);
    const [detail, setDetail] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [modalView, setModalView]=useState(false);
    const [modalDelete, setModalDelete]=useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState({
        id: '',
        items: '',
        tax: 0,
        subtotal:0,
        total:0,
        invoiceDate: '',
    });
    const [searchInput, setSearchInput] = useState("");
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })
    const handleChange = e =>{
        const {name,value} = e.target;
        setSelectedInvoice({
          ...selectedInvoice,
          [name]:value
        });
      
      }

      const openModalView=()=>{
        setModalView(!modalView);
      }
       const openModalDelete=()=>{
        setModalDelete(!modalDelete);
      }
      const handleSearch=e=>{
        setSearchInput(e.target.value);
      }

      const filterSearch=(search)=>{
            return function(x){
                return (x.id.toString().toLowerCase().includes(search.toLowerCase()) || !search)
            }
        }
    
      const deserializeJSON = jsonString =>{
          const json =  JSON.parse(jsonString);
          setDetail(json); 
      }  
      const Get=async()=>{
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
      
      const GetDate = dateString =>{
          const date = new Date(dateString);
          return date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear()
      }
      
        const Delete=async()=>{
          await axios.delete(baseUrl+"/"+selectedInvoice.id)
          .then(response=>{
           setData(data.filter(invoice=>invoice.id!==response.data));
            openModalDelete();
            MySwal.fire({
              title:'Eliminado satisfactoriamente!',
              icon:'success',
              button:'Ok'
              })
          }).catch(error=>{
            console.log(error);
          })
        }
      
      const setInvoice=(invoice, option)=>{
        setSelectedInvoice(invoice);
        deserializeJSON(invoice.items);  
        (option==="View")? 
        openModalView() : openModalDelete(); 
      }

    useEffect(()=>{
        if(role == undefined){
            window.location.href='./';
        }
        Get();
    },[])
    return(
        <Sidebar>
            <div className="action-btn">
        <div class="input-group sm-7">
            <input type="text" class="form-control" onChange={handleSearch} value={searchInput} placeholder="Buscar" aria-label="Buscar" aria-describedby="basic-addon2" />
            <span class="input-group-text search btn-primary" id="basic-addon2"><i className="fa fa-search"></i></span>
        </div>  
      <a className = "btn btn btn-dark btn-new" href="./newInvoice"> Nueva Factura <i className="fa fa-plus-square"></i></a>
      </div>
      <table className="table table-striped">
        <thead className = "">
          <tr>
            <th># de Factura</th>
            <th>Fecha</th>
            <th>Subtotal</th>
            <th>Impuestos</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data && 
          data.filter(filterSearch(searchInput)).map(invoice =>(
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{GetDate(invoice.invoiceDate)}</td>
              <td>{formatter.format(invoice.subtotal.toFixed(2))}</td>
              <td>{formatter.format(invoice.tax.toFixed(2))}</td>
              <td>{formatter.format(invoice.total.toFixed(2))}</td>
              <td>
                <button class="btn btn-success"  onClick={()=>setInvoice(invoice, "View")}><i class="fa-solid fa-eye"></i></button>{" "}
                <button class="btn btn-danger" onClick={()=>setInvoice(invoice, "Delete")}><i class="fa-solid fa-trash"></i></button> {" "}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <Modal isOpen = {modalView}>
      <ModalHeader> Detalle de factura</ModalHeader>
      <ModalBody>
        <div className="container">
            <table className="table table-striped table-borderless" >
                <thead className="table-header">
                    <th># Producto</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Impuesto</th>
                    <th>Total</th>
                </thead>
                <tbody>
                {detail && detail.map(item=>{
                    console.log(detail)
                    return(
                        <tr>
                            <td>{item.id}</td>
                            <td>{item.itemName}</td>
                            <td>{item.qty}</td>
                            <td>{formatter.format(item.price)}</td>
                            <td>{formatter.format((item.price * item.qty)* 0.18)}</td>
                            <td>{formatter.format((item.price * item.qty) + ((item.price * item.qty) * 0.18))}</td>
                        </tr>
                    )
                })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" className="text-right"><strong>Total: </strong></td>
                        <td>{formatter.format(selectedInvoice.subtotal.toFixed(2))}</td>
                        <td>{formatter.format(selectedInvoice.tax.toFixed(2))}</td>
                        <td>{formatter.format(selectedInvoice.total.toFixed(2))}</td>

                    </tr>
                </tfoot>
            </table>
        </div>
      </ModalBody>
      <ModalFooter>
          <button className="btn btn-primary" onClick={()=>openModalView()}>Confirmar</button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={modalDelete}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar la factura # ({selectedInvoice && selectedInvoice.id})?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>Delete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>openModalDelete()}>
            No
          </button>
        </ModalFooter>
      </Modal>
        </Sidebar>
    )
}