document.addEventListener('DOMContentLoaded', function() {
    const username = 'douglas565';
    const projectsContainer = document.getElementById('projects-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Função para buscar repositórios do GitHub
    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
            const data = await response.json();
            
            if (response.ok) {
                displayProjects(data);
            } else {
                throw new Error(data.message || 'Erro ao buscar projetos');
            }
        } catch (error) {
            projectsContainer.innerHTML = `
                <div class="col-12 no-projects">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h3>Ocorreu um erro ao carregar os projetos</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
    
    // Função para exibir os projetos
    function displayProjects(repos) {
        // Filtra apenas repositórios que não são forks e não estão vazios
        const filteredRepos = repos.filter(repo => !repo.fork && repo.size > 0);
        
        if (filteredRepos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="col-12 no-projects">
                    <i class="fas fa-folder-open fa-3x mb-3"></i>
                    <h3>Nenhum projeto público encontrado</h3>
                    <p>Meus repositórios privados ou forks não são exibidos aqui.</p>
                </div>
            `;
            return;
        }
        
        let projectsHTML = '';
        
        filteredRepos.forEach(repo => {
            // Determina a linguagem principal ou define como "Outro"
            const language = repo.language || 'Other';
            
            // Cria uma cor de fundo baseada na linguagem
            const langClass = getLanguageClass(language);
            
            // Formata a descrição (remove emojis e limita o tamanho)
            let description = repo.description || 'Sem descrição';
            description = description.replace(/:[a-z_]+:/g, '').substring(0, 120);
            if (description.length >= 120) description += '...';
            
            // Formata a data da última atualização
            const updatedAt = new Date(repo.updated_at).toLocaleDateString('pt-BR');
            
            projectsHTML += `
                <div class="col-md-6 col-lg-4 project-item" data-languages="${language.toLowerCase()}">
                    <div class="project-card card h-100">
                        <div class="card-img-top d-flex align-items-center justify-content-center" style="background-color: ${getLanguageColor(language)};">
                            <i class="fab fa-github fa-5x" style="color: white; opacity: 0.7;"></i>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${repo.name}</h5>
                            <p class="card-text flex-grow-1">${description}</p>
                            <div>
                                <span class="badge rounded-pill ${langClass}">${language}</span>
                            </div>
                            <div class="github-stats mt-2">
                                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                <span><i class="fas fa-calendar-alt"></i> ${updatedAt}</span>
                            </div>
                            <a href="${repo.html_url}" target="_blank" class="btn btn-outline-primary mt-3">Ver Projeto</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        projectsContainer.innerHTML = projectsHTML;
        
        // Adiciona eventos de filtro
        setupFilterButtons();
    }
    
    // Função para configurar os botões de filtro
    function setupFilterButtons() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Ativa o botão clicado e desativa os outros
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter').toLowerCase();
                const projectItems = document.querySelectorAll('.project-item');
                
                projectItems.forEach(item => {
                    const languages = item.getAttribute('data-languages');
                    
                    if (filter === 'all' || languages.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Função para obter a classe CSS baseada na linguagem
    function getLanguageClass(language) {
        const lang = language.toLowerCase();
        if (lang.includes('javascript')) return 'bg-javascript';
        if (lang.includes('html') || lang.includes('css')) return 'bg-html';
        if (lang.includes('python')) return 'bg-python';
        return 'bg-other';
    }
    
    // Função para obter uma cor baseada na linguagem
    function getLanguageColor(language) {
        const lang = language.toLowerCase();
        const colors = {
            javascript: '#f1e05a',
            typescript: '#3178c6',
            python: '#3572A5',
            html: '#e34c26',
            css: '#563d7c',
            java: '#b07219',
            php: '#4F5D95',
            ruby: '#701516',
            c: '#555555',
            'c++': '#f34b7d',
            'c#': '#178600',
            go: '#00ADD8',
            rust: '#dea584',
            swift: '#ffac45',
            kotlin: '#F18E33',
            default: '#6e5494' // Cor padrão (GitHub purple)
        };
        
        if (lang.includes('javascript')) return colors.javascript;
        if (lang.includes('typescript')) return colors.typescript;
        if (lang.includes('python')) return colors.python;
        if (lang.includes('html')) return colors.html;
        if (lang.includes('css')) return colors.css;
        if (colors[lang]) return colors[lang];
        
        return colors.default;
    }
    
    // Inicia a busca dos repositórios
    fetchGitHubRepos();
});