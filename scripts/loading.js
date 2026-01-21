// loading.js - Versão mais suave com garantia de visualização
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    
    // Tempo MÍNIMO para mostrar o loading (para garantir que a animação apareça)
    const minLoadingTime = 1500; // 1.5 segundos (aumentei para garantir visualização)
    const startTime = Date.now();
    
    // Força a exibição imediata do loading
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    
    // Adiciona classe para preparar animação do conteúdo
    body.classList.add('body-content-loading');
    
    function hideLoadingScreen() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(function() {
            // Primeiro garante que o conteúdo principal fique visível
            body.classList.remove('body-content-loading');
            
            // Pequeno delay antes de começar o fade-out do loading
            setTimeout(function() {
                // Adiciona classe para fade-out do loading
                if (loadingScreen) {
                    loadingScreen.classList.add('fade-out');
                }
                
                // Remove completamente o loading do DOM após a animação
                setTimeout(function() {
                    if (loadingScreen && loadingScreen.parentNode) {
                        loadingScreen.style.display = 'none';
                    }
                }, 1200); // Tempo da transição CSS
            }, 300); // Pequeno delay para suavidade
        }, remainingTime);
    }
    
    // Otimização: verifica se a página já está carregada
    function checkPageLoaded() {
        // Se a página já estiver completamente carregada
        if (document.readyState === 'complete') {
            // Ainda assim, aguarda o tempo mínimo
            setTimeout(hideLoadingScreen, minLoadingTime);
        }
    }
    
    // Inicia a verificação
    checkPageLoaded();
    
    // Escuta o evento load (quando tudo carrega)
    window.addEventListener('load', function() {
        // Já conta o tempo desde o DOMContentLoaded, então usa hideLoadingScreen normalmente
        hideLoadingScreen();
    });
    
    // Fallback: esconde o loading após 4 segundos no máximo (aumentei)
    setTimeout(hideLoadingScreen, 4000);
    
    // Adiciona transição suave para links internos
    document.querySelectorAll('a[href^="#"], a[href*="/pages/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Para links internos, adiciona uma transição suave
            if (!this.getAttribute('href').startsWith('http')) {
                body.classList.add('body-content-loading');
                setTimeout(() => {
                    body.classList.remove('body-content-loading');
                }, 800);
            }
        });
    });
});
