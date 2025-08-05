let consultas = {};
let diaSelecionado = null;
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function toggleTema() {
    document.body.classList.toggle('dark');
    localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function toggleSection(id) {
    document.getElementById(id).classList.toggle('oculto');
}

function showNotification(msg) {
    const notif = document.createElement("div");
    notif.textContent = msg;
    notif.style.position = "fixed";
    notif.style.top = "20px";
    notif.style.left = "50%";
    notif.style.transform = "translateX(-50%)";
    notif.style.backgroundColor = "var(--accent-primary)";
    notif.style.color = "white";
    notif.style.padding = "12px 24px";
    notif.style.borderRadius = "5px";
    notif.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    notif.style.zIndex = "1000";
    notif.style.display = "flex";
    notif.style.alignItems = "center";
    notif.style.gap = "10px";
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
}

function criarCalendario() {
    const calendario = document.getElementById("calendario");
    calendario.innerHTML = "";
    
    const consultasSalvas = localStorage.getItem('consultasPsicologo');
    if (consultasSalvas) {
        consultas = JSON.parse(consultasSalvas);
    }
    
    document.getElementById('mesAtual').textContent = `${meses[mesAtual]} ${anoAtual}`;
    
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    const cabecalhoMes = document.createElement('div');
    cabecalhoMes.className = 'cabecalho-mes';
    cabecalhoMes.textContent = `${meses[mesAtual]} ${anoAtual}`;
    calendario.appendChild(cabecalhoMes);
    
    diasSemana.forEach(dia => {
        const divDia = document.createElement("div");
        divDia.textContent = dia;
        divDia.style.fontWeight = "bold";
        calendario.appendChild(divDia);
    });
    
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
    
    for (let i = 0; i < primeiroDia; i++) {
        const diaVazio = document.createElement("div");
        diaVazio.className = "dia-vazio";
        calendario.appendChild(diaVazio);
    }
    
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const dataKey = `${dia}/${mesAtual + 1}/${anoAtual}`;
        const divDia = document.createElement("div");
        divDia.textContent = dia;
        divDia.className = "dia-calendario";
        
        if (consultas[dataKey]) {
            divDia.classList.add('dia-com-consulta');
            divDia.title = `Consulta com ${consultas[dataKey].paciente}\nHorário: ${consultas[dataKey].horario}\n${consultas[dataKey].observacoes || 'Sem observações'}`;
        }
        
        divDia.addEventListener("click", () => abrirModalConsulta(dataKey, dia));
        calendario.appendChild(divDia);
    }
}

function mudarMes(diferenca) {
    mesAtual += diferenca;
    
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    } else if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    
    criarCalendario();
}

function atualizarProntuario(dataKey) {
    const container = document.getElementById('infoPacienteSelecionado');
    
    if (dataKey && consultas[dataKey]) {
        const consulta = consultas[dataKey];
        const [dia, mes, ano] = dataKey.split('/');
        const dataFormatada = `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
        
        container.innerHTML = `
            <div class="prontuario-paciente">
                <div class="avatar-paciente">
                    <i class="fas fa-user"></i>
                </div>
                <div class="prontuario-info">
                    <h4>${consulta.paciente}</h4>
                    <div class="prontuario-meta">
                        <span class="prontuario-meta-item">
                            <i class="fas fa-calendar"></i> ${dataFormatada}
                        </span>
                        <span class="prontuario-meta-item">
                            <i class="fas fa-clock"></i> ${consulta.horario}
                        </span>
                    </div>
                    ${consulta.observacoes ? `
                    <div class="prontuario-observacoes">
                        <h5>Observações:</h5>
                        <p>${consulta.observacoes}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="nenhum-paciente">
                <i class="fas fa-calendar-alt"></i>
                <p>Selecione uma consulta no calendário para ver os detalhes do paciente</p>
            </div>
        `;
    }
}

function abrirModalConsulta(dataKey, dia) {
    const modal = document.getElementById('modalConsulta');
    const dataInput = document.getElementById('modalData');
    const pacienteInput = document.getElementById('modalPaciente');
    const horarioInput = document.getElementById('modalHorario');
    const observacoesInput = document.getElementById('modalObservacoes');
    
    const dataFormatada = `${dia} de ${meses[mesAtual]} de ${anoAtual}`;
    
    dataInput.value = dataFormatada;
    diaSelecionado = dataKey;
    
    if (consultas[dataKey]) {
        pacienteInput.value = consultas[dataKey].paciente || '';
        horarioInput.value = consultas[dataKey].horario || '09:00';
        observacoesInput.value = consultas[dataKey].observacoes || '';
    } else {
        pacienteInput.value = '';
        horarioInput.value = '09:00';
        observacoesInput.value = '';
    }
    
    modal.classList.add('mostrar');
    modal.classList.remove('oculto');
    
    atualizarProntuario(dataKey);
    
    setTimeout(() => {
        pacienteInput.focus();
    }, 300);
}

function fecharModal() {
    const modal = document.getElementById('modalConsulta');
    modal.classList.remove('mostrar');
    setTimeout(() => {
        modal.classList.add('oculto');
    }, 300);
}

function salvarConsulta(event) {
    event.preventDefault();
    
    const paciente = document.getElementById('modalPaciente').value.trim();
    const horario = document.getElementById('modalHorario').value;
    const observacoes = document.getElementById('modalObservacoes').value.trim();
    
    if (!paciente) {
        showNotification('Por favor, informe o nome do paciente');
        return;
    }
    
    if (!horario) {
        showNotification('Por favor, informe o horário da consulta');
        return;
    }

    consultas[diaSelecionado] = {
        paciente,
        horario,
        observacoes,
        dataCadastro: new Date().toISOString()
    };

    localStorage.setItem('consultasPsicologo', JSON.stringify(consultas));
    
    fecharModal();
    criarCalendario();
    showNotification('Consulta salva com sucesso!');
}

function removerConsulta() {
    if (confirm('Tem certeza que deseja remover esta consulta?')) {
        delete consultas[diaSelecionado];
        localStorage.setItem('consultasPsicologo', JSON.stringify(consultas));
        fecharModal();
        criarCalendario();
        atualizarProntuario();
        showNotification('Consulta removida com sucesso!');
    }
}

function inicializarUploadFoto() {
    const fotoPerfil = document.getElementById('fotoPerfil');
    const uploadFoto = document.getElementById('uploadFoto');
    
    const fotoSalva = localStorage.getItem('fotoPerfil');
    if (fotoSalva) {
        fotoPerfil.src = fotoSalva;
    }
    
    uploadFoto.addEventListener('change', function(e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        
        if (!arquivo.type.match('image.*')) {
            showNotification('Por favor, selecione uma imagem (JPEG, PNG)');
            return;
        }
        
        if (arquivo.size > 2 * 1024 * 1024) {
            showNotification('A imagem deve ter menos de 2MB');
            return;
        }
        
        const leitor = new FileReader();
        leitor.onload = function(evento) {
            fotoPerfil.src = evento.target.result;
            localStorage.setItem('fotoPerfil', evento.target.result);
            showNotification('Foto de perfil atualizada com sucesso!');
        };
        leitor.readAsDataURL(arquivo);
    });
}

function carregarPerfil() {
    const perfilSalvo = JSON.parse(localStorage.getItem('perfilPsicologo')) || {
        nome: 'Dr. Psicólogo',
        especialidade: 'Terapia Cognitivo-Comportamental'
    };
    
    document.getElementById('inputNome').value = perfilSalvo.nome;
    document.getElementById('inputEspecialidade').value = perfilSalvo.especialidade;
    
    atualizarExibicaoPerfil(perfilSalvo);
}

function atualizarExibicaoPerfil(dados) {
    document.getElementById('nomePsicologo').textContent = dados.nome;
    document.getElementById('especialidadePsicologo').textContent = dados.especialidade;
}

function salvarPerfil(event) {
    event.preventDefault();
    
    const novoPerfil = {
        nome: document.getElementById('inputNome').value.trim(),
        especialidade: document.getElementById('inputEspecialidade').value.trim()
    };
    
    if (!novoPerfil.nome || !novoPerfil.especialidade) {
        showNotification('Por favor, preencha todos os campos');
        return;
    }

    localStorage.setItem('perfilPsicologo', JSON.stringify(novoPerfil));
    
    atualizarExibicaoPerfil(novoPerfil);
    
    toggleSection('editarPerfil');
    showNotification('Perfil atualizado com sucesso!');
}

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem('tema') === 'dark') {
        document.body.classList.add('dark');
    }
    
    document.getElementById('tituloAreaPsicologo').addEventListener('click', toggleTema);
    
    criarCalendario();
    
    inicializarUploadFoto();
    
    carregarPerfil();
    
    document.getElementById('formPerfil').addEventListener('submit', salvarPerfil);
    document.getElementById('formConsulta').addEventListener('submit', salvarConsulta);
    
    setTimeout(() => {
        showNotification("👋 Bem-vindo à área do psicólogo!");
    }, 1000);
});
