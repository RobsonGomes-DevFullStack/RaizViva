/**
 * Carrossel de Parceiros - Raíz Viva
 * Versão refatorada com melhorias de performance e acessibilidade
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const slides = document.querySelectorAll('.slide-parceiro');
    const btnPrev = document.querySelector('.btn-nav.prev');
    const btnNext = document.querySelector('.btn-nav.next');
    const indicators = document.querySelectorAll('.slide-indicator');
    const carrossel = document.querySelector('.carrossel-parceiros');
    
    // Estado do carrossel
    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Configurações
    const SWIPE_THRESHOLD = 50;
    const ANIMATION_DURATION = 600;

    /**
     * Mostra um slide específico com animação
     * @param {number} targetIndex - Índice do slide a ser mostrado
     * @param {string} direction - Direção da animação ('left' ou 'right')
     */
    function showSlide(targetIndex, direction = 'right') {
        // Prevenir múltiplas animações simultâneas
        if (isAnimating) return;
        isAnimating = true;
        
        // Calcular índice real com loop
        const newIndex = (targetIndex + slides.length) % slides.length;
        
        // Remover classes do slide atual
        slides[currentIndex].classList.remove('ativo', 'slide-left', 'slide-right');
        
        // Adicionar classes ao novo slide
        const newSlide = slides[newIndex];
        newSlide.classList.remove('slide-left', 'slide-right');
        
        // Trigger reflow para reiniciar animação
        void newSlide.offsetWidth;
        
        // Aplicar animação e mostrar slide
        newSlide.classList.add(`slide-${direction}`, 'ativo');
        currentIndex = newIndex;
        
        // Atualizar indicadores e acessibilidade
        updateIndicators();
        updateAccessibility();
        
        // Resetar flag de animação após duração
        setTimeout(() => {
            isAnimating = false;
        }, ANIMATION_DURATION);
    }

    /**
     * Atualiza os indicadores de slide
     */
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            const isActive = index === currentIndex;
            
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
            
            // Feedback tátil para indicador ativo
            if (isActive) {
                indicator.style.transform = 'scale(1.2)';
            } else {
                indicator.style.transform = 'scale(1)';
            }
        });
    }

    /**
     * Atualiza informações de acessibilidade
     */
    function updateAccessibility() {
        const activeSlide = slides[currentIndex];
        const slideTitle = activeSlide.querySelector('h3').textContent;
        const slideDescription = activeSlide.querySelector('p').textContent;
        
        // Criar ou atualizar região de anúncio
        let liveRegion = document.getElementById('slide-announce');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announce';
            liveRegion.className = 'visually-hidden';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            carrossel.appendChild(liveRegion);
        }
        
        // Atualizar conteúdo com delay para leitores de tela
        setTimeout(() => {
            liveRegion.textContent = `Slide ${currentIndex + 1} de ${slides.length}: ${slideTitle}. ${slideDescription}`;
        }, 300);
        
        // Atualizar título da página para screen readers
        document.title = `Parceiros - ${slideTitle} | Raíz Viva`;
    }

    /**
     * Navega para o próximo slide
     */
    function nextSlide() {
        showSlide(currentIndex + 1, 'right');
    }

    /**
     * Navega para o slide anterior
     */
    function prevSlide() {
        showSlide(currentIndex - 1, 'left');
    }

    /**
     * Inicializa o carrossel
     */
    function initCarousel() {
        if (slides.length === 0) return;
        
        // Configurar indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (index === currentIndex) return;
                
                const direction = index > currentIndex ? 'right' : 'left';
                showSlide(index, direction);
            });
            
            // Adicionar rótulo de acessibilidade dinâmico
            const slideTitle = slides[index].querySelector('h3').textContent;
            indicator.setAttribute('aria-label', `Ir para slide ${index + 1}: ${slideTitle}`);
        });
        
        // Configurar botões de navegação
        btnPrev?.addEventListener('click', prevSlide);
        btnNext?.addEventListener('click', nextSlide);
        
        // Configurar navegação por teclado
        setupKeyboardNavigation();
        
        // Configurar suporte a swipe
        setupSwipeSupport();
        
        // Inicializar primeiro slide
        showSlide(0);
    }

    /**
     * Configura navegação por teclado
     */
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Só processar se o foco está no carrossel
            const isFocusInCarousel = e.target.closest('.carrossel-parceiros');
            if (!isFocusInCarousel) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                    
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    showSlide(0, 'left');
                    break;
                    
                case 'End':
                    e.preventDefault();
                    showSlide(slides.length - 1, 'right');
                    break;
                    
                case ' ':
                case 'Enter':
                    // Se o foco está em um indicador, ativar
                    if (e.target.classList.contains('slide-indicator')) {
                        e.preventDefault();
                        const index = parseInt(e.target.getAttribute('data-slide'));
                        showSlide(index);
                    }
                    break;
            }
        });
    }

    /**
     * Configura suporte a gestos de swipe
     */
    function setupSwipeSupport() {
        if (!carrossel) return;
        
        carrossel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchEndX = touchStartX;
        }, { passive: true });
        
        carrossel.addEventListener('touchmove', (e) => {
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carrossel.addEventListener('touchend', () => {
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                if (diff > 0) {
                    // Swipe para a esquerda = próximo
                    nextSlide();
                } else {
                    // Swipe para a direita = anterior
                    prevSlide();
                }
            }
        }, { passive: true });
    }

    /**
     * Configura auto-play opcional
     */
    function setupAutoplay() {
        let autoplayInterval;
        let autoplayDelay = 5000; // 5 segundos
        
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Iniciar auto-play
        startAutoplay();
        
        // Pausar ao interagir
        carrossel?.addEventListener('mouseenter', stopAutoplay);
        carrossel?.addEventListener('mouseleave', startAutoplay);
        carrossel?.addEventListener('touchstart', stopAutoplay);
        carrossel?.addEventListener('focusin', stopAutoplay);
        carrossel?.addEventListener('focusout', () => {
            setTimeout(startAutoplay, 1000);
        });
        
        // Retomar auto-play após 10 segundos de inatividade
        let inactivityTimer;
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            stopAutoplay();
            inactivityTimer = setTimeout(startAutoplay, 10000);
        }
        
        // Monitorar interações
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keydown', resetInactivityTimer);
        document.addEventListener('touchstart', resetInactivityTimer);
    }

    // Inicializar carrossel
    initCarousel();
    
    // Para habilitar auto-play, descomente a linha abaixo:
    // setupAutoplay();
    
    // Log de inicialização (opcional para debug)
    console.log(`Carrossel de Parceiros inicializado com ${slides.length} slides`);
});