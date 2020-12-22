const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var path = require('path');
var cors = require('cors');
const App = express();
const bodyParser = require('body-parser');

App.use(cors());  
const jsonParser = bodyParser.json()


App.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    return res.sendFile(path.resolve('main-page.html'));
});

App.get('/get_clients', async (req, res) => {
    const fs = require('fs');
    fs.readFile('clients_data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }

        let json_content = JSON.parse(jsonString);
        return res.status(200).json(json_content);
    });
});

App.post('/set_client', jsonParser, async (req, res) => {
    const fs = require('fs');
    fs.readFile('clients_data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }

        const entries = req.body;
        let json_content = JSON.parse(jsonString);

        new_client =
        {
            "cpf": entries.cpf,
            "nome": entries.nome,
            "telefone": entries.telefone,
            "email": entries.email,
            "nascimento": entries.nascimento,
            "estadoCivil": entries.estadoCivil,
            "sexo": entries.sexo,
            "cep": entries.cep,
            "cidade": entries.cidade,
            "bairro": entries.bairro,
            "valorSolicitado": entries.valorsolicitado,
            "rua": entries.rua,
            "estado": entries.estado,
            "emprego": entries.emprego,
            "renda": entries.renda,
            "convenio": entries.convenio,
            "banco": entries.banco,
            "conta": entries.conta,
            "agencia": entries.agencia,
            "status": "Solicitação Enviada"
        }

        json_content.clientes[entries.cpf] = new_client;

        const fs = require('fs');
        const newJsonString = JSON.stringify(json_content)
        fs.writeFile('clients_data.json', newJsonString, err => {});

        return res.status(200).json(new_client);
    });
});

App.get('/set_client_status', async (req, res) => {
    const fs = require('fs');
    fs.readFile('clients_data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }

        const entries = req.headers;
        let json_content = JSON.parse(jsonString);

        json_content.clientes[entries.cpf].status = entries.status;

        const fs = require('fs');
        const newJsonString = JSON.stringify(json_content)
        fs.writeFile('clients_data.json', newJsonString, err => {});

        return res.status(200).json();
    });
});

App.get('/get_client_status', async (req, res) => {
    const fs = require('fs');
    fs.readFile('clients_data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }

        const entries = req.headers;
        let json_content = JSON.parse(jsonString);

        if(json_content.clientes[entries.cpf] && json_content.clientes[entries.cpf].nascimento == entries.nascimento)
            return res.status(200).json(json_content.clientes[entries.cpf].status);
        else
            return res.status(300).json("Dados incorretos!");
    });
});

var porta = process.env.PORT || 8080;
App.listen(porta);
