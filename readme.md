# France Viagens

## Página de Login (Back-End)

Vamos criar uma página de login para clientes da agência de viagens France Viagens, utilizando as tecnologias Node.js, Next.js, Tailwind, MySQL e AWS.

Utilizando o VSCode, foi criado o repositório france_viagens com duas subpastas chamadas api e cliente, onde em `france_viagens/api` será armazenado o back-end com node.js e em `france_viagens/cliente` o front-end com Next.js.

Utilizando o terminal do VSCode, foi executado as seguintes linhas de comando no caminho `france_viagens/api` para inicialização do `package.json`, instalação das bibliotecas e dependências necessárias, tais como a conexão com banco de dados:

```bash
npm init
npm i express bcrypt body-parser cors dotenv jsonwebtoken mysql 
npm i --save-dev nodemon
```

As bibliotecas são armazenadas no diretório `france_viagens/api/node_modules`, no diretório `france_viagens/api` foi criado o arquivo `index.js` que é o arquivo principal. 

Em `package.json` foi realizada a troca da linha 7:
```javascript
"test": "echo \"Error: no test specified\" && exit 1"
```

Por:
```javascript
 "start": "nodemon index.js"
```

Foi adicionado também em package.json na última linha, com o objetivo de facilitar os imports:
```javascript
"type": "module"
```

Em seguida, em index.js para testar o servidor:
```javascript
import express from "express";

const app = express();

app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
```

No prompt de comando para confirmar o funcionamento: `npm start`

Para criação das rotas foi criado o diretório `france_viagens/api/routes` e arquivo user.js
```
import express from "express";
import { getUser } from "../controllers/users.js";

const router = express.Router();

router.get("/teste", getUser);

export default router;
```

E também foi adicionado o diretório france_viagens/api/controllers e arquivo users.js
```
export const getUser = (req, res)=>{
    res.status(200).json({msg: "funcionando!!!"})
}
```

Ao adicionar a rota do user.js no index.js temos:
```
import express from "express";
import userRouter from "./routes/user.js";

const app = express();

app.use("/api/user/", userRouter);

app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
```

Utilizando o Thunder Client como extensão do VS Code, foi criado uma collection chamada france-viagens e na mesma adicionada a requisição GET `http://localhost:8001/api/user/teste`

Que retornou a seguinte Resposta confirmando o funcionamento da requisição:
```
{
  "msg": "funcionando"
}
```

Em seguida, utilizando o XAMPP foi criado o banco de dados pelo MySQL e comando:
```SQL
CREATE DATABASE france_viagens;
USE france_viagens;
CREATE TABLE `france_viagens`.`user`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `USERNAME` VARCHAR(45) NOT NULL,
    `EMAIL` VARCHAR(100) NOT NULL,
    `PASSWORD` VARCHAR(200) NOT NULL,
    `USERIMG` VARCHAR(300) NULL,
    PRIMARY KEY(`ID`)
) AUTO_INCREMENT=1;
```

Em seguida, foi criado o arquivo das autenticações france_viagens/api/routes/auth.js para o registro dos logins
```javascript
import express from "express"
import {register} from "../controllers/auth.js"
import {login} from "../controllers/auth.js"

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

export default router;
```

E também o arquivo controller das autenticações france_viagens/api/controllers/auth.js
```javascript
export const register = (req, res) => {

}

export const login = (req, res) => {
    
}
```

Em seguida, para resguardar o sigilo dos dados de conexão com o banco de dados foi criado o arquivo .env e .gitignore, e para conexão com o banco foi criado o arquivo france_viagens/api/connect.js
```javascript
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({path: "./.env"})

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});
```

Posteriormente, foi completado o export const register no auth.js do controllers, com as validações dos dados e criptografia da senha password
```javascript
import { db } from "../connect.js";
import bcrypt from "bcrypt";

export const register = (req, res) => {
    const {username, email, password, confirmPassword} = req.body
    if(!username){
        return res.status(422).json({msg:"O nome é obrigatório!"});
    }
    if(!email){
        return res.status(422).json({msg:"O email é obrigatório!"});
    }
    if(!password){
        return res.status(422).json({msg:"A senha é obrigatória!"});
    }
    if(password !== confirmPassword){
        return res.status(422).json({msg:"As senhas não são iguais"});
    }

    db.query(
        "SELECT email FROM user WHERE email = ?",
        [email],
        async (error, data) => {
            if (error) {
                console.log(error);
                return  res.status(500).json({
                    msg:"Aconteceu algum erro no servidor, tente novamente mais tardee",
                });
            }
            if (data.length > 0) {
                return res
                .status(409)
                .json({msg:"Este email já está sendo utilizado"});
            } else{
                const passwordHash = await bcrypt.hash(password, 8);
                db.query(
                    "INSERT INTO user SET ?",
                    { username, email, password: passwordHash },
                    (error) => {
                        if(error){
                            console.log(error);
                            return res.status(500).json({
                                msg:"Aconteceu algum erro no servidor, tente novamente mais tarde2",
                            });
                        } else{
                            return res.status(200).json({
                                msg:"Cadastro efetuado com sucesso!",
                            });
                        }
                    }
                );
            }
        }
    );
}

export const login = (req, res) => {
    
}
```

Atualizando o index.js com as rotas user.js e auth.js, adicionando também bodyParser para facilitar os testes no Thunder Client, temos então:
```javascript
import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded
app.use(bodyParser.urlencoded({extended: false}));

// Roteadores
app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);

// Inicia o servidor
app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
```

Testando novamente no Thunder Client foi adicionada a requisição POST http://localhost:8001/api/auth/register
Utilizando Form Encoded:
```
{
  "msg": "O nome é obrigatório!"
}
```
username teste
```
{
  "msg": "O email é obrigatório!"
}
```
email teste@teste.com
```
{
  "msg": "A senha é obrigatória!"
}
```
password teste123456
```
{
  "msg": "As senhas não são iguais"
}
```
confirmPassword teste123456
```
{
  "msg": "Cadastro efetuado com sucesso!"
}
```
Caso tente cadastrar um email já registado:
```
{
  "msg": "Este email já está sendo utilizado"
}
```

Foi criada duas chaves criptografadas (REFRESH e TOKEN) para proteção dos dados utilizando o comando abaixo no prompt de comando no diretório api:
`node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`

Em seguida foi desenvolvido no auth.js do controllers a parte do login:
```javascript
export const login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM user WHERE email = ?",
        [email],
        async (error, data) => {
            if (error) {
                console.log(error);
                return  res.status(500).json({
                    msg:"Aconteceu algum erro no servidor, tente novamente mais tarde"
                });
            }
            if (data.length == 0) {
                return res.status(404).json({
                    msg:"Usuário não encontrado!"
                });
            } else {
                const user = data[0];
                if (!user.PASSWORD) {
                    return res.status(500).json({
                        msg: "Erro no servidor: senha do usuário não encontrada"
                    });
                }
                const checkPassword = await bcrypt.compare(password, user.PASSWORD);
                if (!checkPassword) {
                    return res.status(422).json({
                        msg:"Senha incorreta!"
                    });
                }

                try {
                    const refreshToken = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                        id: user.password
                    },
                    process.env.REFRESH,
                    {algorithm: "HS256"}
                    );

                    const token = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 3600,
                        id: user.password
                    },
                    process.env.TOKEN,
                    {algorithm: "HS256"}
                    );

                    res.status(200).json({
                        msg:"Usuário logado com sucesso!", token, refreshToken
                    });

                } catch(err){
                    console.log(err);
                    return res.status(500).json({
                        msg:"Aconteceu algum erro no servidor, tente novamente mais tarde"
                    });
                }
            }
        }
    );
}
```

Finalizando os testes do back-end no Thunder Client, foi adicionada a requisição POST `http://localhost:8001/api/auth/login`  que retorna com sucesso a mensagem “Usuário Logado com sucesso!” e o “token” e “refreshToken” para autenticações.

# Página de login (Front-End)

Primeiramente foram executados os comandos abaixo para instalação do Next:
```
npx create-next-app@latest  
cd france-viagens
npm run dev
npm i axios
```

Foram criados os arquivos `client/src/register/page.tsx` e `client/src/login/page.tsc` para as páginas de Registro e Login, respectivamente.

Na página de Login foi utilizada a seguinte lógica de programação para o login do usuário na página:
```javascript
const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e:any)=>{
        e.preventDefault()
        axios
            .post("http://localhost:8001/api/auth/login", {email,password})
            .then((res)=>{
            console.log(res.data)
            })
            .catch((err)=>{
            console.log(err)
            })
    }
```

Foram criados dois componentes `AuthPage.tsx` e `AuthInput.tsx`, armazenados na pasta `client/src/components/AuthPage.tsx`.

Temos na construção do AuthPage a parte da autenticação no front-end:
```javascript
function AuthPage({children}:{children:React.ReactNode}) {
    return (
        <main className="bg-[url('https://zagblogmedia.s3.amazonaws.com/wp-content/uploads/2020/02/10140728/viagem-a-trabalho-scaled.jpg')] bg-no-repeat bg-cover flex min-h-screen flex-col items-center justify-center">
            <form className="flex flex-col bg-white px-6 py-14 rounded-2xl gap-11 text-gray-600 w-1/4">
                {children}
            </form>
        </main>
    );
}

export default AuthPage;
```

E `AuthInput.tsx` para a entrada da autenticação:
```javascript
interface AuthInputProps {
    newState: (state:string) => void,
    label:string
    IsPassword?:boolean
}
function AuthInput(props:AuthInputProps) {
    return (
        <div className="flex flex-col justify-between items-start">
        <label>{props.label}</label>
            <input 
                type={props.IsPassword?"password":"text"} 
                onChange={(e)=>props.newState(e.currentTarget.value)}
                className="border-gray-400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none"
            />
        </div>
    );
}

export default AuthInput;
```

Em seguida, foi construida a página de Login:
```javascript
"use client"

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import AuthInput from "@/components/AuthInput";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e:any)=>{
        e.preventDefault()
        axios
            .post("http://localhost:8001/api/auth/login", {email,password})
            .then((res)=>{
            console.log(res.data);
            setError('');
            })
            .catch((err)=>{
            console.log(err);
            setError(err.response.data.msg)
            })
    }

    return (
        <AuthPage>
            <h1 className="font-bold text-2xl">LOGIN</h1>
            <AuthInput label="Email:" newState={setEmail}/>
            <AuthInput label="Password" newState={setPassword} IsPassword/>
            {error.length>0 && <span className="text-red-600">*{error}</span>}
            <button 
                className="bg-blue-600 py-3 font-bold text-white rounded-lg hover:bg-blue-800" 
                onClick={(e)=>handleLogin(e)}
            >
                ENTRAR
            </button>
            <Link href="/register" className="text-center underline">
                Cadastrar-se
            </Link>
        </AuthPage>
    );
}

export default Login;
```

Posteriormente, construída a página de registro:
```javascript
import AuthInput from "@/components/AuthInput";
import AuthPage from "@/components/AuthPage";
import {useState} from "react";
import axios from "axios";
import Link from "next/link";

function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirPassword, setConfirPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8001/api/auth/register",{
            username, 
            email, 
            password, 
            confirPassword
        })
        .then((res)=>{
            console.log(res.data);
            setSuccess(res.data.msg);
            setError('');
        })
        .catch((err)=>{
            console.log(err);
            setError(err.response.data.msg);
            setSuccess('');
        });
    }

    return (
        <AuthPage>
            <h1 className="font-bold text-2xl">REGISTER</h1>
            <AuthInput label="Nome:" newState={setUsername}/>
            <AuthInput label="Email:" newState={setEmail}/>
            <AuthInput label="Senha:" newState={setPassword} IsPassword/>
            <AuthInput label="Confirme a senha:" newState={setConfirPassword} IsPassword/>
            {error.length>0 && <span className="text-red-600">*{error}</span>}
            {success.length>0 && <span className="text-green-600">*{success}</span>}
            <button 
                className="bg-blue-600 py-3 font-bold text-white rounded-lg hover:bg-blue-800" 
                onClick={(e)=>handleRegister(e)}
            >
                Cadastrar-se
            </button>
            <Link href="/login" className="text-center underline">
                Entrar
            </Link>
        </AuthPage>

    );
}

export default Register;
```

Concluindo assim a página de Login da France Viagens.










