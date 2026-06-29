import { useState } from "react";
import './login.css';
import '../../global.css'
import ReciclaMais from "../../assets/ReciclaMais.png";
import Navbar from "../../components/navbar/Navbar";
import Rodape from '../../components/rodape/Rodape'

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function handleLogin(){
        alert(`Login com ${identifier}`);
    }

    return(
        <>         
        <Navbar />
        <div className="login-page"> 
            <div className="login-panel">       

                <h1>
                    Que bom ver <span>você</span> de novo!
                </h1>
                <p className="subtitle">
                    Entre na sua conta para registrar seus materiais,
                    acompanhar o ranking e transformar atitudes em pontos.
                </p>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="E-mail ou telefone"
                        value={identifier}
                        onChange={(e)=>setIdentifier(e.target.value)}
                    />

                </div>

                <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        className="show-password"
                        onClick={() => setShowPassword(!showPassword)}
                     >
                    </button>

                </div>

                <a href="/recuperar-senha" className="forgot">
                    Esqueceu sua senha?
                </a>

                <button
                    className="login-button"
                    onClick={handleLogin}
                >
                    Entrar
                </button>

                <p className="register">
                    Ainda não possui conta?
                    <a href="/cadastro"> Cadastre-se</a>
                </p>

            </div>

            <div className="imgLateral">
                <img src={ReciclaMais} alt="Incentivo Reciclagem" srcset="" />
            </div>

        </div>
        <Rodape />
    </>
    )
}
 export default Login;