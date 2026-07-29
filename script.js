const form = document.getElementById('formCadastro');
form.addEventListener('submit', async (event) =>{
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        
        const response = await fetch('http://localhost:4000/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, password })
        });

        const data = await response.json();

        if(!response.ok){
            alert(`Atenção: ${data}`); // Exibe a mensagem que seu backend retornou (ex: 'Este email já existe')
            return;
        }

        alert('Aluno cadastrado com sucesso!')
        form.reset();
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Não foi possível conetar ao servidor.')
        
    }
})