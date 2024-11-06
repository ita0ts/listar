// Função para formatar a data em timestamp para a API
function getTimestamp(dateStr) {
    return Math.floor(new Date(dateStr).getTime() / 1000);
}

// Função para gerar a URL da API com os intervalos de data
function fetchAlbums(from, to, monthIndex, totalMonths, monthName) {
    const apiKey = 'e97ca135be347c4a86d57a2fe313f59e';
    const user = 'cefas1931';
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=${user}&api_key=${apiKey}&from=${from}&to=${to}&format=json`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayAlbums(data.weeklyalbumchart.album, monthName);
            updateLoadingProgress(monthIndex, totalMonths);
        })
        .catch(error => console.error('Erro ao buscar álbuns:', error));
}

// Função para carregar os álbuns para o mês selecionado
function loadAlbumsByMonth() {
    const loadButton = document.getElementById('load-button');
    const monthSelect = document.getElementById('month-select');
    const selectedMonth = monthSelect.value;

    if (!selectedMonth) {
        alert('Por favor, selecione um mês!');
        return;
    }

    loadButton.disabled = true; // Desabilita o botão enquanto carrega

    const months = [
        { month: '01', name: 'Janeiro' },
        { month: '02', name: 'Fevereiro' },
        { month: '03', name: 'Março' },
        { month: '04', name: 'Abril' },
        { month: '05', name: 'Maio' },
        { month: '06', name: 'Junho' },
        { month: '07', name: 'Julho' },
        { month: '08', name: 'Agosto' },
        { month: '09', name: 'Setembro' },
        { month: '10', name: 'Outubro' },
        { month: '11', name: 'Novembro' },
        { month: '12', name: 'Dezembro' }
    ];

    // Encontrar o mês selecionado
    const selectedMonthObj = months.find(m => m.month === selectedMonth);

    if (!selectedMonthObj) {
        alert('Mês inválido!');
        loadButton.disabled = false;
        return;
    }

    const fromDate = `2024-${selectedMonthObj.month}-01`;
    const toDate = `2024-${selectedMonthObj.month}-31`;

    const fromTimestamp = getTimestamp(fromDate);
    const toTimestamp = getTimestamp(toDate);

    // Exibe a barra de progresso
    document.getElementById('loading-bar-container').style.display = 'block';

    // Carregar os álbuns do mês selecionado
    fetchAlbums(fromTimestamp, toTimestamp, 0, 1, selectedMonthObj.name);
}

// Função para exibir os álbuns na página, incluindo o nome do mês
function displayAlbums(albums, monthName) {
    const albumsContainer = document.getElementById('albums');
    
    // Limpar o conteúdo anterior
    albumsContainer.innerHTML = '';

    // Cria um novo título h1 para o nome do mês
    const monthTitle = document.createElement('h1');
    monthTitle.textContent = `Álbuns de ${monthName}`;
    albumsContainer.appendChild(monthTitle);

    // Cria a lista de álbuns
    const albumList = document.createElement('ul');
    albumList.className = 'album-list';

    albums.slice(0, 50).forEach(album => {
        const albumItem = document.createElement('li');
        albumItem.className = 'album-item';
        albumItem.innerHTML = `
            <h2>${album.artist['#text']} - ${album.name}</h2>
            
        `;
        albumList.appendChild(albumItem);
    });

    albumsContainer.appendChild(albumList);
}

// Função para atualizar a barra de progresso de loading
function updateLoadingProgress(monthIndex, totalMonths) {
    const loadingBar = document.getElementById('loading-bar');
    const loadingMessage = document.getElementById('loading-message');
    const progress = ((monthIndex + 1) / totalMonths) * 100;

    loadingBar.style.width = `${progress}%`;
    loadingMessage.textContent = `Carregando... ${Math.round(progress)}%`;

    if (progress === 100) {
        loadingMessage.textContent = 'Carregamento concluído!';
    }
}
