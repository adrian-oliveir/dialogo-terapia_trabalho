import sqlite3

def criar_banco_dados():
    try:
        conn = sqlite3.connect(':memory:')
        cursor = conn.cursor()

        tabelas = [
            """CREATE TABLE usuarios (
                usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE,
                senha TEXT NOT NULL,
                tipo_usuario TEXT NOT NULL,
                status TEXT DEFAULT 'ativo',
                foto_perfil TEXT,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ultimo_login TIMESTAMP,
                cpf TEXT UNIQUE
            )""",
            
            """CREATE TABLE enderecos (
                endereco_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                rua TEXT NOT NULL,
                numero TEXT,
                cidade TEXT NOT NULL,
                estado TEXT NOT NULL,
                cep TEXT NOT NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE psicologos (
                psicologo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL UNIQUE,
                especialidade TEXT,
                biografia TEXT,
                valor_consulta REAL,
                modo_atendimento TEXT,
                crp TEXT UNIQUE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE disponibilidade (
                disponibilidade_id INTEGER PRIMARY KEY AUTOINCREMENT,
                psicologo_id INTEGER NOT NULL,
                dia_semana TEXT NOT NULL,
                hora_inicio TEXT NOT NULL,
                hora_fim TEXT NOT NULL,
                FOREIGN KEY (psicologo_id) REFERENCES psicologos(psicologo_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE pacientes (
                paciente_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL UNIQUE,
                data_nascimento TEXT,
                genero TEXT,
                telefone TEXT,
                ocupacao TEXT,
                estado_civil TEXT,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE plano_terapia (
                plano_id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                psicologo_id INTEGER NOT NULL,
                objetivo_geral TEXT,
                tecnicas_usadas TEXT,
                data_inicio TEXT NOT NULL,
                data_termino TEXT,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
                FOREIGN KEY (psicologo_id) REFERENCES psicologos(psicologo_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE consultas (
                consulta_id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                psicologo_id INTEGER NOT NULL,
                data_hora TEXT NOT NULL,
                duracao_minutos INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'agendada',
                plano_id INTEGER,
                observacoes TEXT,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
                FOREIGN KEY (psicologo_id) REFERENCES psicologos(psicologo_id) ON DELETE CASCADE,
                FOREIGN KEY (plano_id) REFERENCES plano_terapia(plano_id) ON DELETE SET NULL
            )""",
            
            """CREATE TABLE pagamentos (
                pagamento_id INTEGER PRIMARY KEY AUTOINCREMENT,
                consulta_id INTEGER NOT NULL,
                valor REAL NOT NULL,
                metodo_pagamento TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pendente',
                data_pagamento TEXT,
                comprovante_url TEXT,
                FOREIGN KEY (consulta_id) REFERENCES consultas(consulta_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE arquivos (
                arquivo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                consulta_id INTEGER,
                tipo_arquivo TEXT NOT NULL,
                url TEXT NOT NULL,
                nome_arquivo TEXT NOT NULL,
                data_upload TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
                FOREIGN KEY (consulta_id) REFERENCES consultas(consulta_id) ON DELETE SET NULL
            )""",
            
            """CREATE TABLE avaliacoes (
                avaliacao_id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                psicologo_id INTEGER NOT NULL,
                consulta_id INTEGER NOT NULL,
                nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
                comentario TEXT,
                data_avaliacao TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
                FOREIGN KEY (psicologo_id) REFERENCES psicologos(psicologo_id) ON DELETE CASCADE,
                FOREIGN KEY (consulta_id) REFERENCES consultas(consulta_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE historico_clinico (
                historico_id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                psicologo_id INTEGER NOT NULL,
                descricao TEXT NOT NULL,
                data_registro TEXT DEFAULT CURRENT_TIMESTAMP,
                tipo_registro TEXT NOT NULL,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id) ON DELETE CASCADE,
                FOREIGN KEY (psicologo_id) REFERENCES psicologos(psicologo_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE notificacoes (
                notificacao_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                mensagem TEXT NOT NULL,
                tipo TEXT NOT NULL CHECK (tipo IN ('sistema', 'consulta', 'mensagem')),
                visualizado INTEGER DEFAULT 0,
                data_envio TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE mensagens (
                mensagem_id INTEGER PRIMARY KEY AUTOINCREMENT,
                remetente_id INTEGER NOT NULL,
                destinatario_id INTEGER NOT NULL,
                conteudo TEXT NOT NULL,
                tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'arquivo', 'imagem')),
                data_envio TEXT DEFAULT CURRENT_TIMESTAMP,
                lida INTEGER DEFAULT 0,
                FOREIGN KEY (remetente_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
                FOREIGN KEY (destinatario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
            )""",
            
            """CREATE TABLE logs_sistema (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER,
                descricao TEXT NOT NULL,
                data_hora TEXT DEFAULT CURRENT_TIMESTAMP,
                ip_usuario TEXT,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
            )""",
            
            """CREATE TABLE feedback_app (
                feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                mensagem TEXT NOT NULL,
                nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
                tipo_feedback TEXT NOT NULL,
                data_envio TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
            )"""
        ]

        for tabela in tabelas:
            cursor.execute(tabela)

        conn.commit()
        print("Banco de dados criado com sucesso!")
        return conn

    except sqlite3.Error as e:
        print(f"Erro ao criar banco de dados: {e}")
        return None

def inserir_dados_exemplo(conn):
    try:
        cursor = conn.cursor()
        
        cursor.execute("INSERT INTO usuarios (nome, email, senha, tipo_usuario, cpf) VALUES ('João Psicólogo', 'joao@email.com', '123456', 'psicologo', '12345678901')")
        cursor.execute("INSERT INTO usuarios (nome, email, senha, tipo_usuario, cpf) VALUES ('Maria Paciente', 'maria@email.com', '123456', 'paciente', '98765432109')")
        cursor.execute("INSERT INTO psicologos (usuario_id, especialidade, valor_consulta, crp) VALUES (1, 'Ansiedade e Depressão', 150.00, '12345/SP')")
        cursor.execute("INSERT INTO pacientes (usuario_id, telefone) VALUES (2, '11999999999')")
        
        conn.commit()
        print("Dados de exemplo inseridos com sucesso!")
        
    except sqlite3.Error as e:
        print(f"Erro ao inserir dados: {e}")

if __name__ == "__main__":
    conexao = criar_banco_dados()
    if conexao:
        inserir_dados_exemplo(conexao)
        conexao.close()
