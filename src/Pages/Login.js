import {React, useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Assets/Css/login.css';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function Login(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = values => ValidateUser(values.userName, values.password);
    const baseUrl = "http://apiusers.somee.com/"
    const cookies = new Cookies();
    const role = cookies.get('role')
    const MySwal = withReactContent(Swal)

    useEffect(()=>{
      if(role == 1){
        window.location.href="./adashboard"
      } else if(role == 2){
        window.location.href=`./udashboard`
      }
    }, [])
    const ValidateUser = (userName, password) => {
        axios.get(baseUrl+`api/AuthenticateUser?userName=${userName}&password=${password}`).then(response=>{
            const {userExists, userRole} = response.data;
            if(userExists){
                cookies.set('role', userRole, {path: "/"})
                cookies.set('userName', userName, {path: "/"})
                if(userRole == 1){
                    window.location.href="./adashboard"
                } else{
                    window.location.href=`./udashboard`
                }
            } else {
              MySwal.fire({
                title:'Error de Autenticación',
                icon:'warning',
                text:'Usuario o contraseña incorrectos',
                button:'Ok'
                })
            }    
        }).catch(err=>{
          MySwal.fire({
            title:'Error de Autenticación',
            icon:'warning',
            text:err,
            button:'Ok'
            })
        })
    };
    return (
<div className="container-fluid ps-md-0 main-container-login">
  <div className="row g-0">
    <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
    <div className="col-md-8 col-lg-6">
      <div className="login d-flex align-items-center py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-lg-8 mx-auto">
              <center>
              <h2 className="login-heading mb-4">Iniciar Sesión</h2>
              </center>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                  <input type="text" {...register("userName", {
                      required: {
                          value: true,
                          message: "El campo es requerido"
                      }   
                  })} className="form-control" id="floatingInput" placeholder="name@example.com" />
                  <label for="floatingInput">Nombre de Usuario</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" {...register("password", {
                      required: {
                          value: true,
                          message: "El campo es requerido"
                      },
                      minLength: {
                          value: 4,
                          message: "La contraseña debe tener al menos 4 caracteres",
                      }   
                  })} className="form-control" id="floatingPassword" placeholder="Password" />
                  <label for="floatingPassword">Contraseña</label>
                </div>

                <div className="d-grid">
                  <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" type="submit">Sign in</button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}