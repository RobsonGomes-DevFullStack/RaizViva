// EXPANSÃO DOS CARDS
document.addEventListener('DOMContentLoaded', function() {
    const expandButtons = document.querySelectorAll('.btn-expandir');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card-bento');
            const content = card.querySelector('.card-body, .texto');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Recolhe
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.expandir-texto').textContent = 'Ver mais';
                content.classList.remove('expanded');
            } else {
                // Expande
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.expandir-texto').textContent = 'Ver menos';
                content.classList.add('expanded');
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
        
        setTimeout(typeWriter, 500);
    }
});