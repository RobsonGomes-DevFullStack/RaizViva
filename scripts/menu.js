document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. LÓGICA DE FILTROS CORRIGIDA
       ========================================================================== */
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const cardsPratos = document.querySelectorAll('.card-prato');
    let filtrosAtivos = new Set();

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            const filtro = botao.getAttribute('data-filter');

            if (filtro === 'todos') {
                filtrosAtivos.clear();
                botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
                botao.classList.add('ativo');
            } else {
                document.querySelector('[data-filter="todos"]').classList.remove('ativo');
                
                if (filtrosAtivos.has(filtro)) {
                    filtrosAtivos.delete(filtro);
                    botao.classList.remove('ativo');
                } else {
                    filtrosAtivos.add(filtro);
                    botao.classList.add('ativo');
                }

                if (filtrosAtivos.size === 0) {
                    document.querySelector('[data-filter="todos"]').classList.add('ativo');
                }
            }
            filtrarPratos();
        });
    });

    function filtrarPratos() {
        cardsPratos.forEach(card => {
            if (filtrosAtivos.size === 0) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                return;
            }
            
            const categoriasDoPrato = card.getAttribute('data-categoria').split(' ');
            
            // Se o card tem "todos", ele deve aparecer em qualquer filtro
            if (categoriasDoPrato.includes('todos')) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                return;
            }
            
            // Verifica se o card atende a TODOS os filtros ativos
            const atendeTodos = Array.from(filtrosAtivos).every(f => categoriasDoPrato.includes(f));
            
            card.style.display = atendeTodos ? 'block' : 'none';
            if (atendeTodos) card.classList.add('fade-in');
        });
    }

    /* ==========================================================================
       2. FLIP DOS CARDS
       ========================================================================== */
    document.addEventListener("click", (event) => {
        const back = event.target.closest(".card-back");
        const button = event.target.closest(".btn-flip");

        // Bloqueia cliques no verso que não sejam no botão
        if (back && !button) {
            event.stopPropagation();
            return;
        }

        if (!button) return;

        const action = button.dataset.action;
        if (!action) return;

        const card = button.closest(".card-prato");
        if (!card) return;

        const btnOpen = card.querySelector('.btn-flip[data-action="open"]');
        const btnClose = card.querySelector('.btn-flip[data-action="close"]');

        if (action === "open") {
            document.querySelectorAll(".card-prato.is-flipped").forEach((openCard) => {
                openCard.classList.remove("is-flipped", "is-unflipping");

                const o = openCard.querySelector('.btn-flip[data-action="open"]');
                const c = openCard.querySelector('.btn-flip[data-action="close"]');

                if (o) o.setAttribute("aria-expanded", "false");
                if (c) c.setAttribute("aria-expanded", "false");
            });

            const descricao = card.querySelector(".descricao-detalhada");
            if (descricao) descricao.scrollTop = 0;

            card.classList.add("is-flipped");

            if (btnOpen) btnOpen.setAttribute("aria-expanded", "true");
            if (btnClose) btnClose.setAttribute("aria-expanded", "true");
        }

        if (action === "close") {
            card.classList.add("is-unflipping");
            card.classList.remove("is-flipped");

            if (btnOpen) btnOpen.setAttribute("aria-expanded", "false");
            if (btnClose) btnClose.setAttribute("aria-expanded", "false");

            setTimeout(() => {
                card.classList.remove("is-unflipping");
            }, 1000);
        }
    });

    /* ==========================================================================
       3. CARROSSEL DE PARCEIROS (SLIDES & SWIPE)
       ========================================================================== */
    const carrossel = document.querySelector('.carrossel');
    if (carrossel) {
        const slides = carrossel.querySelectorAll('.slide');
        const btnPrev = carrossel.querySelector('.prev-btn');
        const btnNext = carrossel.querySelector('.next-btn');
        let slideAtual = 0;

        function mostrarSlide(index) {
            if (index >= slides.length) slideAtual = 0;
            else if (index < 0) slideAtual = slides.length - 1;
            else slideAtual = index;

            slides.forEach((slide, i) => {
                slide.style.display = (i === slideAtual) ? 'flex' : 'none';
                if (i === slideAtual) slide.classList.add('fade-in');
            });
        }

        btnNext?.addEventListener('click', () => mostrarSlide(slideAtual + 1));
        btnPrev?.addEventListener('click', () => mostrarSlide(slideAtual - 1));

        // Suporte a Swipe (Deslizar) no Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carrossel.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
        carrossel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) mostrarSlide(slideAtual + 1); // Deslizou p/ esquerda
            if (touchEndX - touchStartX > 50) mostrarSlide(slideAtual - 1); // Deslizou p/ direita
        });

        // Inicializa o primeiro slide
        mostrarSlide(0);
    }
    
    // Inicializa os filtros mostrando todos os cards
    filtrarPratos();
});