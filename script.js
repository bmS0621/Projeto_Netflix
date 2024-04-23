const imgForm = document.getElementById('img-form')
const uimgForm = document.getElementById('uimg-form')
const imgList = document.getElementById('img-list')
const containerCadastro = document.querySelector('.container-cadastro')
const containerEdit = document.querySelector('.container-edit')
const imgArray = 0
const addButton = document.getElementById('btn-add');

const url = 'http://localhost:3000/Imagens'

addButton.addEventListener('click', () => {
    containerCadastro.classList.add('active')
})

window.onclick = function (event) {
    if (event.target == containerCadastro) {
        containerCadastro.classList.remove('active');

    } else if (event.target == containerEdit) {
        containerEdit.classList.remove('active');
    }
}




function listImg() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            imgList.innerHTML = '';
            data.forEach(img => {
                console.log(data);
                const imgVar = document.createElement('img');
                imgVar.setAttribute("class","img-exibe")
                imgVar.src = img.link
                const li = document.createElement('li');
                li.innerHTML = `<p>${img.nomeDaImagem} - sobre: ${img.sobre}, id: ${img.id}</p>`;
                const deleteButton = document.createElement('button');
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar'
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => {
                    deleteImg(img.id)
                });
                editButton.addEventListener('click', () => {
                    containerEdit.classList.add('active')
                    editImg(img)
                });
                li.appendChild(imgVar);
                li.appendChild(deleteButton);
                li.appendChild(editButton);
                imgList.appendChild(li);
            });
        })
        .catch(error => console.error('Erro:', error));
}

imgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let id = imgArray + 1
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(img => {
                if (img.id == id) {
                    id++;
                }
            });

            const nomeDaImagem = document.getElementById('nomeDaImagem').value;
            const sobre = document.getElementById('sobre').value;
            // const id = document.getElementById('id').value;
            const link = document.getElementById('link').value;


            fetch('http://localhost:3000/Imagens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id, nomeDaImagem: nomeDaImagem, sobre: sobre, link: link })
            })
                .then(response => response.json())
                .then(() => {
                    imgUsers()
                    imgForm.reset()
                })
                .catch(error => console.error('Erro:', error))
        })
});

function editImg(img) {
    document.getElementById('uid').value = img.id;
    document.getElementById('unomeDaImagem').value = img.nomeDaImagem;
    document.getElementById('usobre').value = img.sobre;
    document.getElementById('ulink').value = img.link;

    uimgForm.addEventListener('submit', (e) => {
        e.preventDefault()
        update();
    });
}

function update() {
    const id = parseInt(document.getElementById('uid').value);
    const nomeDaImagem = document.getElementById('unomeDaImagem').value;
    const sobre = document.getElementById('usobre').value;
    const link = document.getElementById('ulink').value;

    fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id, nomeDaImagem: nomeDaImagem, sobre: sobre, link: link })
    })
        .then(response => response.json())
        .then(() => {
            // imgUsers()
            uimgForm.reset()
        })
        .catch(error => console.error('Erro:', error))
}

function deleteImg(img) {
    fetch(`${url}/${img}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(() => {
            imgUsers(); // Refresh the user list after deletion
        })
        .catch(error => console.error('Erro ao excluir imagem:', error));
}


listImg()