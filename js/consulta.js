document.addEventListener("DOMContentLoaded", function () {
    const input_cep = document.getElementById('cep');
    const input_logradouro = document.getElementById('logradouro');
    const input_numero = document.getElementById('numero');
    const input_bairro = document.getElementById('bairro');
    const input_cidade = document.getElementById('localidade');
    const input_uf = document.getElementById('uf');
    const input_ddd = document.getElementById('ddd');
    const input_ibge = document.getElementById('ibge');

    function onlyNumbers(event) {
        let value = event.target.value.replace(/\D/g, '');
        if (event.target.id === 'ddd' && value.length > 2) {
            value = value.slice(0, 2);
        } else if (event.target.id === 'ibge' && value.length > 7) {
            value = value.slice(0, 7);
        }
        event.target.value = value;
    }

    input_cep.addEventListener('input', onlyNumbers);
    input_numero.addEventListener('input', onlyNumbers);
    input_ddd.addEventListener('input', onlyNumbers);
    input_ibge.addEventListener('input', onlyNumbers);

    input_cep.addEventListener('blur', () => {
        let cep = input_cep.value;

        if (cep.length !== 8) {
            alert("Por favor, preencha 8 números.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(resposta => resposta.json())
            .then(json => {
                if (json.erro) {
                    alert("CEP inválido.");
                    return;
                }
                input_logradouro.value = json.logradouro;
                input_bairro.value = json.bairro;
                input_cidade.value = json.localidade;
                input_uf.value = json.uf;
                input_ddd.value = json.ddd;
                input_ibge.value = json.ibge;
            })
            .catch(() => alert("Erro ao buscar o CEP. Tente novamente."));
    });

    function cadEndereco(cep, logradouro, numero, bairro, localidade, uf, ddd, ibge) {
        if (!cep || !logradouro || !numero || !bairro || !localidade || !uf || !ddd || !ibge) {
            alert("ERRO! Todos os campos têm que ser preenchidos.");
            return;
        }

        const tabela = document.getElementById("tbendereco");
        const qtdlinhas = tabela.rows.length;
        const linha = tabela.insertRow(qtdlinhas);

        linha.insertCell(0).innerHTML = qtdlinhas;
        linha.insertCell(1).innerHTML = cep;
        linha.insertCell(2).innerHTML = logradouro;
        linha.insertCell(3).innerHTML = numero;
        linha.insertCell(4).innerHTML = bairro;
        linha.insertCell(5).innerHTML = localidade;
        linha.insertCell(6).innerHTML = uf;
        linha.insertCell(7).innerHTML = ddd;
        linha.insertCell(8).innerHTML = ibge;
        const acaoCell = linha.insertCell(9);
        acaoCell.innerHTML = '<button class="btn btn-primary btn-sm" onclick="excluirEndereco(this)"><i class="bi bi-trash3"></i></button>';
    }

    function salvar() {
        const endereco = {
            cep: input_cep.value,
            logradouro: input_logradouro.value,
            numero: input_numero.value,
            bairro: input_bairro.value,
            cidade: input_cidade.value,
            uf: input_uf.value,
            ddd: input_ddd.value,
            ibge: input_ibge.value
        };

        for (const key in endereco) {
            if (!endereco[key]) {
                alert("ERRO! Todos os campos são obrigatórios.");
                return;
            }
        }

        if (endereco.ddd.length !== 2) {
            alert("O DDD deve conter exatamente 2 números.");
            return;
        }

        const enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
        enderecos.push(endereco);
        localStorage.setItem('enderecos', JSON.stringify(enderecos));
        alert("Endereço salvo com sucesso!");

        const form = document.getElementById('cad-endereco-form');
        form.reset();
        carregarDadosLocalStorage();
    }

    window.cadEndereco = cadEndereco;
    window.salvar = salvar;
    window.excluirEndereco = function (button) {
        const row = button.parentNode.parentNode;
        const index = row.rowIndex - 1; 
        row.parentNode.removeChild(row);

        const enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
        enderecos.splice(index, 1);
        localStorage.setItem('enderecos', JSON.stringify(enderecos));
        carregarDadosLocalStorage();
    }

    function carregarDadosLocalStorage() {
        let dados = localStorage.getItem("enderecos");
        let tabela = document.getElementById("tbendereco");
        tabela.innerHTML = '<tr><th>#</th><th>CEP</th><th>Logradouro</th><th>Número</th><th>Bairro</th><th>Cidade</th><th>UF</th><th>DDD</th><th>IBGE</th><th>Ações</th></tr>';

        if (dados !== null) {
            dados = JSON.parse(dados);

            for (let endereco of dados) {
                const qtdlinhas = tabela.rows.length;
                const linha = tabela.insertRow(qtdlinhas);

                linha.insertCell(0).innerHTML = qtdlinhas;
                linha.insertCell(1).innerHTML = endereco.cep;
                linha.insertCell(2).innerHTML = endereco.logradouro;
                linha.insertCell(3).innerHTML = endereco.numero;
                linha.insertCell(4).innerHTML = endereco.bairro;
                linha.insertCell(5).innerHTML = endereco.cidade;
                linha.insertCell(6).innerHTML = endereco.uf;
                linha.insertCell(7).innerHTML = endereco.ddd;
                linha.insertCell(8).innerHTML = endereco.ibge;
                const acaoCell = linha.insertCell(9);
                acaoCell.innerHTML = '<button class="btn btn-primary btn-sm" onclick="excluirEndereco(this)"><i class="bi bi-trash3"></i></button>';
            }
        }
    }

    window.onload = function () {
        carregarDadosLocalStorage();
    };
});


