// A URL base para suas funções Netlify.
// O nome da função será adicionado no final (ex: /.netlify/functions/confirmar-presenca).
const FUNCTIONS_URL = '/.netlify/functions/';

// --- Lógica para Confirmação de Presença ---

const formConfirmacao = document.getElementById('form-confirmacao');
const mensagemConfirmacao = document.getElementById('mensagem_confirmacao');

formConfirmacao.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome_convidado').value;
    mensagemConfirmacao.textContent = 'Enviando sua confirmação...';

    try {
        const response = await fetch(FUNCTIONS_URL + 'confirmar-presenca', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome }),
        });

        const data = await response.json();

        if (response.ok) {
            mensagemConfirmacao.textContent = data.message;
            mensagemConfirmacao.style.color = 'green';
            formConfirmacao.reset(); // Limpa o formulário
        } else {
            mensagemConfirmacao.textContent = 'Ocorreu um erro: ' + data.message;
            mensagemConfirmacao.style.color = 'red';
        }
    } catch (error) {
        mensagemConfirmacao.textContent = 'Erro de conexão. Por favor, tente novamente.';
        mensagemConfirmacao.style.color = 'red';
        console.error('Erro:', error);
    }
});
// A URL base para suas funções Netlify.
const FUNCTIONS_URL = '/.netlify/functions/';

// --- Lógica para Exibir a Lista de Presentes ---

const listaItensPresentes = document.getElementById('lista_itens_presentes');

async function carregarListaDePresentes() {
    try {
        const response = await fetch(FUNCTIONS_URL + 'listar-presentes');
        const presentes = await response.json();

        listaItensPresentes.innerHTML = ''; // Limpa a mensagem "Carregando..."

        if (presentes.length === 0) {
            listaItensPresentes.innerHTML = '<li>Nenhum presente na lista ainda.</li>';
            return;
        }

        presentes.forEach(presente => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${presente.item}</span>
                <div class="presente-status"></div>
            `;

            // Adiciona a classe CSS 'item-escolhido' se o status for 'escolhido'
            if (presente.status === 'escolhido') {
                li.classList.add('item-escolhido');
                li.querySelector('.presente-status').textContent = `Já escolhido por: ${presente.escolhido_por}`;
            } else {
                // Adiciona o botão de escolha se o item estiver disponível
                const botaoEscolha = document.createElement('button');
                botaoEscolha.textContent = 'Eu Quero!';
                li.appendChild(botaoEscolha);

                // Adiciona o formulário de escolha
                const formularioEscolha = document.createElement('form');
                formularioEscolha.style.display = 'none'; // Escondido por padrão
                formularioEscolha.innerHTML = `
                    <p>Qual é o seu nome?</p>
                    <input type="text" placeholder="Seu nome completo" required>
                    <button type="submit">Confirmar</button>
                    <button type="button" class="cancelar-escolha">Cancelar</button>
                    <p class="mensagem-escolha"></p>
                `;
                li.appendChild(formularioEscolha);

                // Lógica de mostrar/esconder o formulário
                botaoEscolha.addEventListener('click', () => {
                    botaoEscolha.style.display = 'none';
                    formularioEscolha.style.display = 'block';
                });

                formularioEscolha.querySelector('.cancelar-escolha').addEventListener('click', () => {
                    botaoEscolha.style.display = 'block';
                    formularioEscolha.style.display = 'none';
                    formularioEscolha.querySelector('.mensagem-escolha').textContent = '';
                });

                // Lógica de envio do formulário de escolha
                formularioEscolha.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const nome = formularioEscolha.querySelector('input').value;
                    const mensagem = formularioEscolha.querySelector('.mensagem-escolha');
                    mensagem.textContent = 'Confirmando...';

                    try {
                        const response = await fetch(FUNCTIONS_URL + 'escolher-presente', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ item_id: presente._id.$oid, nome }),
                        });

                        const data = await response.json();

                        if (response.ok) {
                            mensagem.textContent = data.message;
                            mensagem.style.color = 'green';
                            li.classList.add('item-escolhido');
                            botaoEscolha.remove(); // Remove o botão "Eu Quero!"
                            formularioEscolha.remove(); // Remove o formulário
                            li.querySelector('.presente-status').textContent = `Já escolhido por: ${nome}`;
                        } else {
                            mensagem.textContent = data.message;
                            mensagem.style.color = 'red';
                        }
                    } catch (error) {
                        mensagem.textContent = 'Erro ao conectar. Tente novamente.';
                        mensagem.style.color = 'red';
                        console.error('Erro:', error);
                    }
                });
            }
            listaItensPresentes.appendChild(li);
        });

    } catch (error) {
        listaItensPresentes.innerHTML = '<li>Não foi possível carregar a lista de presentes.</li>';
        console.error('Erro:', error);
    }
}

// Lógica de Confirmação de Presença
// ... (o código que já fizemos para o formulário de RSVP permanece aqui) ...

document.addEventListener('DOMContentLoaded', carregarListaDePresentes);