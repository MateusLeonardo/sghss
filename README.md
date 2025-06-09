# Sistema de Gestão de Consultas Médicas

## Descrição

Bem-vindo ao **Sistema de Gestão de Consultas Médicas**! Este é um sistema desenvolvido utilizando **NestJS** que visa simplificar o agendamento de consultas médicas e a gestão de registros médicos. Ele foi desenvolvido para ser robusto e escalável, oferecendo uma interface de backend bem estruturada para o gerenciamento de usuários (pacientes, médicos, atendentes e administradores).

O sistema também integra um controle de permissões avançado usando **CASL (Code Access Security Layer)** para garantir que cada usuário só tenha acesso às funcionalidades que são permitidas pelo seu papel.

---

## Funcionalidades Principais

- **Gestão de Usuários**: Administra os usuários com diferentes papéis (ADMIN, DOCTOR, PATIENT, ATTENDANT).
- **Gestão de Consultas**: Permite o agendamento, leitura, atualização e cancelamento de consultas.
- **Gestão de Registros Médicos**: Permite a criação, leitura, atualização e remoção de registros médicos.
- **Autenticação e Autorização**: Utiliza **JWT** para autenticação e **CASL** para definir permissões de acesso a recursos do sistema com base no papel do usuário.

---

## Estrutura de Permissões com CASL

As permissões de acesso são definidas com base no **papel** do usuário e nos **recursos** que ele pode acessar. As permissões são configuradas utilizando a biblioteca **CASL**, permitindo uma implementação flexível e altamente configurável.

### Tipos de Ação

- **manage**: Permite gerenciar completamente o recurso.
- **create**: Permite criar o recurso.
- **read**: Permite ler o recurso.
- **update**: Permite atualizar o recurso.
- **delete**: Permite excluir o recurso.

### Recursos Autorizados

- **Appointment**: Agendamentos de consultas.
- **MedicalRecord**: Registros médicos.
- **User**: Usuários do sistema.
- **Patient**: Pacientes do sistema.
- **Doctor**: Médicos do sistema.
- **Attendant**: Atendentes do sistema.
- **all**: Todos os recursos.

---

## Papéis e Permissões

O sistema tem a seguinte configuração de permissões com base nos papéis dos usuários:

### **ADMIN**

O **ADMIN** tem acesso total ao sistema e pode **gerenciar** todos os recursos.

```typescript
can('manage', 'all');
```

### **DOCTOR**

O **DOCTOR** pode:

- **Ler** e **atualizar** consultas em que ele seja o médico responsável.
- **Criar** registros médicos.
- **Ler** e **atualizar** seus próprios registros médicos.
- **Ler** informações de pacientes e médicos.

```typescript
can(['read', 'update'], 'Appointment', { doctorId: user.doctor?.id });
can('create', 'MedicalRecord');
can(['read', 'update'], 'MedicalRecord', { doctorId: user.doctor?.id });
can('read', 'Patient');
can('read', 'Doctor', { id: user.doctor?.id });
```

### **PATIENT**

O **PATIENT** pode:

- **Ler** as consultas em que ele seja o paciente.
- **Ler** e **atualizar** seus próprios dados.
- **Ler** seus próprios registros médicos.

```typescript
can('read', 'Appointment', { patientId: user.patient?.id });
can(['read', 'update'], 'Patient', { id: user.patient?.id });
can('read', 'MedicalRecord', { patientId: user.patient?.id });
```

### **ATTENDANT**

O **ATTENDANT** pode:

- **Criar**, **ler** e **atualizar** agendamentos de consultas.
- **Ler** informações de pacientes.

```typescript
can(['create', 'read', 'update'], 'Appointment');
can('read', 'Patient');
```

---

## Rotas do Sistema de Gestão de Consultas Médicas

### Usuários (Users)

1. **GET /users**

   - **Descrição**: Lista todos os usuários
   - **Permissão**: Apenas ADMIN
   - **Resposta**

   ```json
   [
     {
       "id": 1,
       "email": "user@example.com",
       "name": "João da Silva",
       "cpf": "12345678900",
       "role": "PATIENT",
       "createdAt": "2025-06-01T12:00:00.000Z",
       "updatedAt": "2025-06-01T12:00:00.000Z"
     }
   ]
   ```

2. **POST /users**

   - **Descrição**: Cria um novo usuário no sistema.
   - **Uso**: Permite que o administrador crie um novo usuário, seja paciente, médico, atendente, etc.

3. **GET /users/:id**

   - **Descrição**: Retorna as informações de um usuário específico pelo ID.
   - **Uso**: Permite que o administrador obtenha informações detalhadas de um usuário específico.

4. **PATCH /users/:id**

   - **Descrição**: Atualiza as informações de um usuário específico pelo ID.
   - **Uso**: Permite que o administrador edite as informações de um usuário.

5. **DELETE /users/:id**
   - **Descrição**: Exclui um usuário específico pelo ID.
   - **Uso**: Permite que o administrador exclua um usuário do sistema.

### Pacientes (Patients)

1. **GET /patients**

   - **Descrição**: Retorna todos os pacientes registrados no sistema.
   - **Uso**: Permite que o administrador ou atendente consulte todos os pacientes.

2. **POST /patients**

   - **Descrição**: Cria um novo paciente no sistema.
   - **Uso**: Permite que um atendente ou administrador crie um novo paciente no sistema.

3. **GET /patients/:id**

   - **Descrição**: Retorna as informações de um paciente específico pelo ID.
   - **Uso**: Usado para consultar as informações detalhadas de um paciente específico, permitido por todas as roles.

4. **PATCH /patients/:id**

   - **Descrição**: Atualiza as informações de um paciente específico pelo ID.
   - **Uso**: Permite que o administrador ou atendente ou doutor edite as informações de um paciente.

5. **DELETE /patients/:id**
   - **Descrição**: Exclui um paciente específico pelo ID.
   - **Uso**: Usado para remover um paciente do sistema, apenas administrador tem acesso.

### Médicos (Doctors)

1. **GET /doctors**

   - **Descrição**: Retorna todos os médicos registrados no sistema.
   - **Uso**: Permite que o administrador consulte todos os médicos.

2. **POST /doctors**

   - **Descrição**: Cria um novo médico no sistema.
   - **Uso**: Usado pelo administrador para registrar um novo médico.

3. **GET /doctors/:id**

   - **Descrição**: Retorna as informações de um médico específico pelo ID.
   - **Uso**: Usado para consultar os dados detalhados de um médico, permitido por administrador e doutor, mas só pode acessar o seu perfil.

4. **PATCH /doctors/:id**

   - **Descrição**: Atualiza as informações de um médico específico pelo ID.
   - **Uso**: Permite editar informações de um médico, como especialidade ou CRM, apenas administrador e doutor podem acessar.

5. **DELETE /doctors/:id**
   - **Descrição**: Exclui um médico específico pelo ID.
   - **Uso**: Usado para remover um médico do sistema, apenas administrador pode deletar um doutor.

### Atendentes (Attendants)

1. **GET /attendants**

   - **Descrição**: Retorna todos os atendentes registrados no sistema.
   - **Uso**: Usado pelo administrador para visualizar todos os atendentes.

2. **POST /attendants**

   - **Descrição**: Cria um novo atendente no sistema.
   - **Uso**: Usado para adicionar um novo atendente, apenas administradores podem criar um atendente.

3. **GET /attendants/:id**

   - **Descrição**: Retorna as informações de um atendente específico pelo ID.
   - **Uso**: Usado para consultar as informações detalhadas de um atendente, apenas administradores e atendentes podem acessar essa rota, mas atendentes só podem ver seu perfil.

4. **PATCH /attendants/:id**

   - **Descrição**: Atualiza as informações de um atendente específico pelo ID.
   - **Uso**: Usado para editar as informações de um atendente, apenas administradores e atendentes.

5. **DELETE /attendants/:id**
   - **Descrição**: Exclui um atendente específico pelo ID.
   - **Uso**: Usado pelo administrador para excluir um atendente do sistema.

### Consultas (Appointments)

1. **GET /appointments**

   - **Descrição**: Retorna todos os agendamentos de consultas no sistema.
   - **Uso**: Usado para visualizar todos os agendamentos de consultas, só administradores e atendentes podem visualizar todas as consultas.

2. **POST /appointments**

   - **Descrição**: Cria um novo agendamento de consulta.
   - **Uso**: Usado para agendar uma nova consulta entre paciente e médico, só administradores e atendentes podem criar.

3. **GET /appointments/:id**

   - **Descrição**: Retorna as informações de um agendamento de consulta específico.
   - **Uso**: Usado para consultar os dados detalhados de um agendamento específico, todas as roles podem acessar essa rota.

4. **PATCH /appointments/:id**

   - **Descrição**: Atualiza um agendamento de consulta específico.
   - **Uso**: Usado para alterar detalhes de um agendamento de consulta, apenas administrador, doutores e atendentes podem atualizar.

5. **DELETE /appointments/:id**
   - **Descrição**: Exclui um agendamento de consulta específico.
   - **Uso**: Usado para cancelar um agendamento de consulta, apenas administradores.

### Registros Médicos (Medical Records)

1. **GET /medical-records**

   - **Descrição**: Retorna todos os registros médicos.
   - **Uso**: Permite ao administrador ou médico visualizar todos os registros médicos.

2. **POST /medical-records**

   - **Descrição**: Cria um novo registro médico.
   - **Uso**: Usado para criar um registro médico, geralmente feito por um médico, apenas admin ou doutores podem acessar.

3. **GET /medical-records/:id**

   - **Descrição**: Retorna as informações de um registro médico específico.
   - **Uso**: Usado para consultar um registro médico individual, permitido por administrador, doutor ou paciente.

4. **PATCH /medical-records/:id**

   - **Descrição**: Atualiza um registro médico específico.
   - **Uso**: Usado para editar informações em um registro médico, como diagnóstico ou prescrição, apenas administrador e doutor podem atualizar, apenas administrador pode excluir.

5. **DELETE /medical-records/:id**
   - **Descrição**: Exclui um registro médico específico.
   - **Uso**: Usado para remover um registro médico do sistema.

---

## Como Instalar e Rodar o Projeto

### Requisitos:

- **Node.js** (versão 14 ou superior)
- **Prisma**
- **NestJS**
- **CASL**

### Passos para Instalação:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/MateusLeonardo/sghss.git
   cd sghss
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Copie o arquivo .env.example**:

   ```bash
    cp .env.example .env
   ```

4. **Gere um jwt secret key em algum site:**

   ```
     https://jwtsecret.com/generate
   ```

5. **Rode as migrações do Prisma**:

   ```bash
   npx prisma migrate dev
   ```

6. **Inicie o servidor**:
   ```bash
   npm run start
   ```

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
