document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const emojiBtn = document.querySelector('.emoji-btn');
    const attachmentBtn = document.querySelector('.attachment-btn');
    
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message sent';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = `<p>${messageText}</p>`;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            
            const now = new Date();
            timeDiv.textContent = now.getHours().toString().padStart(2, '0') + ':' + 
                                 now.getMinutes().toString().padStart(2, '0');
            
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timeDiv);
            
            chatMessages.appendChild(messageDiv);
            chatInput.value = '';
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        
            setTimeout(() => {
                const responses = [
                    "Entendo. Podemos trabalhar isso na próxima sessão.",
                    "Como você está se sentindo em relação a isso?",
                    "Isso é interessante. Conte-me mais.",
                    "Vamos focar nos exercícios de respiração que combinamos.",
                    "Estou aqui para te ajudar. Podemos discutir isso com mais detalhes na nossa próxima consulta."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                const replyDiv = document.createElement('div');
                replyDiv.className = 'message received';
                
                const replyContent = document.createElement('div');
                replyContent.className = 'message-content';
                replyContent.innerHTML = `<p>${randomResponse}</p>`;
                
                const replyTime = document.createElement('div');
                replyTime.className = 'message-time';
                
                const replyNow = new Date();
                replyTime.textContent = replyNow.getHours().toString().padStart(2, '0') + ':' + 
                                      replyNow.getMinutes().toString().padStart(2, '0');
                
                replyDiv.appendChild(replyContent);
                replyDiv.appendChild(replyTime);
                
                chatMessages.appendChild(replyDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000 + Math.random() * 2000);
        }
    }
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    emojiBtn.addEventListener('click', function() {
        chatInput.focus();
        alert("Seletor de emojis seria aberto aqui");
    });
    
    attachmentBtn.addEventListener('click', function() {
        alert("Seletor de arquivos seria aberto aqui");
    });
    
    document.querySelector('.reschedule-btn').addEventListener('click', function() {
        alert("Funcionalidade de remarcar consulta seria aberta aqui");
    });
    
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        if (confirm("Tem certeza que deseja cancelar sua consulta?")) {
            alert("Consulta cancelada com sucesso");
        }
    });
    
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`Funcionalidade "${this.textContent.trim()}" seria aberta aqui`);
        });
    });
    
    document.querySelector('.call-btn').addEventListener('click', function() {
        alert("Chamada de voz seria iniciada");
    });
    
    document.querySelector('.video-btn').addEventListener('click', function() {
        alert("Chamada de vídeo seria iniciada");
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;

});
