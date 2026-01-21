
// Função de expandir conteúdo com independência total
document.addEventListener('DOMContentLoaded', function() {
    // Configura todos os botões de expandir
    const expandButtons = document.querySelectorAll('.btn-expandir');
    
    // Função para expandir/recolher conteúdo COM INDEPENDÊNCIA
    expandButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Previne qualquer propagação
            
            const card = this.closest('.card-bento');
            const content = card.querySelector('.card-body, .texto');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                // Recolhe
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.expandir-texto').textContent = 'Ver mais';
                card.classList.remove('expanded');
                content.classList.remove('expanded');
                
                // Scroll suave para manter posição
                setTimeout(() => {
                    const scrollY = window.scrollY;
                    window.scrollTo(0, scrollY);
                }, 100);
            } else {
                // Expande APENAS este card
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.expandir-texto').textContent = 'Ver menos';
                card.classList.add('expanded');
                content.classList.add('expanded');
                
                // Ajusta posição se necessário
                setTimeout(() => {
                    const cardRect = card.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    
                    // Se o card expandido sair da viewport, faz scroll suave
                    if (cardRect.bottom > viewportHeight) {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                }, 50);
            }
        });
    });
    
    // Efeito de digitação no banner (opcional)
    const bannerText = document.querySelector('.banner-conteudo p');
    if (bannerText) {
        const originalText = bannerText.textContent;
        bannerText.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                bannerText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        }
        
        // Inicia após 500ms
        setTimeout(typeWriter, 500);
    }
    
    // Detectar tamanho da tela e mostrar layout apropriado
    function checkLayout() {
        const desktopLayout = document.querySelector('.bento-container.desktop-layout');
        const mobileLayout = document.querySelector('.bento-container.mobile-layout');
        
        if (window.innerWidth <= 992) {
            desktopLayout.style.display = 'none';
            mobileLayout.style.display = 'flex';
        } else {
            desktopLayout.style.display = 'flex';
            mobileLayout.style.display = 'none';
        }
    }
    
    // Verificar layout inicialmente e ao redimensionar
    checkLayout();
    window.addEventListener('resize', checkLayout);
    
    // Força altura independente para cards em desktop
    function adjustCardIndependence() {
        if (window.innerWidth > 992) {
            document.querySelectorAll('.card-bento').forEach(card => {
                card.style.height = 'auto'; // Remove qualquer altura fixa
            });
        }
    }
    
    adjustCardIndependence();
    window.addEventListener('resize', adjustCardIndependence);
});