document.addEventListener('DOMContentLoaded', function() {
    const message = "Como fundador da Dialogo+, meu objetivo é transformar o acesso à saúde mental no Brasil. Acredito que cuidar da mente deve ser tão natural quanto cuidar do corpo. Nossa plataforma foi criada para eliminar barreiras e conectar pessoas a psicólogos qualificados de forma simples, segura e acessível. Juntos, estamos construindo um futuro onde o bem-estar emocional é prioridade para todos.";
    const typingElement = document.getElementById('typing-effect');
    let i = 0;
    
    function typeWriter() {
        if (i < message.length) {
            typingElement.innerHTML += message.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    }
    
    const featureCards = document.querySelectorAll('.feature-card');
    
    function checkScroll() {
        featureCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.classList.add('visible');
            }
        });
        
        const timeline = document.querySelector('.timeline-items');
        const timelineProgress = document.querySelector('.timeline-progress');
        
        if (timeline.getBoundingClientRect().top < window.innerHeight) {
            const timelineItems = document.querySelectorAll('.timeline-item');
            const totalHeight = timeline.offsetHeight;
            const visibleHeight = window.innerHeight - timeline.getBoundingClientRect().top;
            const progress = (visibleHeight / totalHeight) * 100;
            
            timelineProgress.style.height = `${Math.min(progress, 100)}%`;
        }
    }
    
    setTimeout(typeWriter, 1000);
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    
    document.querySelector('.scroll-down').addEventListener('click', function() {
        window.scrollBy({
            top: window.innerHeight - 100,
            behavior: 'smooth'
        });
    });
});