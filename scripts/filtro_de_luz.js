
document.addEventListener('DOMContentLoaded', function() {
    // Cria a camada de filtro
    const filterLayer = document.createElement('div');
    filterLayer.id = 'warm-light-filter';
    filterLayer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* Permite cliques através do filtro */
        z-index: 9999;
        background: rgba(255, 160, 90, 0.8); /* Cor alaranjada suave */
        mix-blend-mode: multiply; /* Mistura com o conteúdo */
        opacity: 0.7; /* Intensidade do filtro */
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(filterLayer);
    
    // Opcional: toggle com tecla específica (ex: F10)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F10') {
            filterLayer.style.opacity = filterLayer.style.opacity === '0' ? '0.7' : '0';
        }
    });
});