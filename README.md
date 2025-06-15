# Sistema de Gestão Hospitalar e de Serviços de Saúde (SSGHSS)

## Descrição

Projeto feito para o curso de Análise e Desenvolvimento de Sistemas da Uninter que tem como base a criação de um sistema capaz de realizar o gerenciamento hospitalar de maneira eficiente, escalável e seguro.

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

### Autenticação (Auth)

1. **POST /auth/login**

   - **Descrição**: Realiza o login do usuário.
   - **Entrada:**

   ```json
   {
     "email": "mateusleonardo@hotmail.com",
     "password": "12345"
   }
   ```

   - **Resposta:**

   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGV1c19sZW9uYXJkbzE5OTdAaG90bWFpbC5jb20iLCJzdWIiOjksInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1MDAxNDg2MSwiZXhwIjoxNzUwMDE4NDYxfQ.hXws-T46S_MVtMTLRYKdyLBXrqgDylvwgphqpGgHLGE"
   }
   ```

2. **POST /auth/register**

   - **Descrição**: Realiza o registro de um novo usuário atrelando ao perfil de paciente.
   - **Entrada:**

   ```json
   {
     "email": "mateusleonardo@hotmail.com",
     "password": "12345"
   }
   ```

   - **Resposta:**

   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpbHZhQGhvdG1haWwuY29tIiwic3ViIjoyNywicm9sZSI6IlBBVElFTlQiLCJpYXQiOjE3NTAwMTYyMzksImV4cCI6MTc1MDAxOTgzOX0.XpJdNZGhy8wga9BfslxiZIly7u6eOiiyWyJ6D8nF2zE"
   }
   ```

### Pacientes (Patients)

1. **GET /patients**

   - **Descrição**: Retorna todos os pacientes registrados no sistema.
   - **Permissão**: ADMIN ou ATTENDANT.
   - **Resposta:**

   ```json
   [
     {
       "id": 8,
       "userId": 19,
       "bloodType": "O-",
       "allergies": "Dipirona",
       "medications": "toma remedio para pressão alta",
       "createdAt": "2025-06-09T16:39:45.580Z",
       "updatedAt": "2025-06-09T16:39:45.580Z",
       "user": {
         "email": "teste1@gmail.com",
         "name": "Teste da silva",
         "cpf": "81501458000",
         "createdAt": "2025-06-09T16:39:45.561Z",
         "updatedAt": "2025-06-09T16:39:45.561Z"
       }
     }
   ]
   ```

2. **POST /patients**

   - **Descrição**: Cria um novo paciente no sistema.
   - **Permissão**: ADMIN ou ATTENDANT.
   - **Entrada:**

   ```json
   {
     "email": "joaodasilva@hotmail.com",
     "name": "João da Silva",
     "cpf": "99999999999",
     "password": "12345",
     "bloodType": "O-",
     "allergies": "Dipirona",
     "medications": "toma remedio para pressão alta"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 8,
     "userId": 19,
     "bloodType": "O-",
     "allergies": "Dipirona",
     "medications": "toma remedio para pressão alta",
     "createdAt": "2025-06-09T16:39:45.580Z",
     "updatedAt": "2025-06-09T16:39:45.580Z"
   }
   ```

3. **GET /patients/:id**

   - **Descrição**: Retorna as informações de um paciente específico pelo ID.
   - **Permissão**: ADMIN, ATTENDANT, DOCTOR, PATIENT.
   - **Resposta:**

   ```json
   {
     "id": 8,
     "userId": 19,
     "bloodType": "O-",
     "allergies": "Dipirona",
     "medications": "toma remedio para pressão alta",
     "createdAt": "2025-06-09T16:39:45.580Z",
     "updatedAt": "2025-06-12T01:00:25.686Z",
     "user": {
       "email": "teste1@gmail.com",
       "name": "Teste da silva santos",
       "cpf": "81501458000",
       "createdAt": "2025-06-09T16:39:45.561Z",
       "updatedAt": "2025-06-12T01:00:25.673Z"
     }
   }
   ```

4. **PATCH /patients/:id**

   - **Descrição**: Atualiza as informações de um paciente específico pelo ID.
   - **Permissão**: ADMIN, ATTENDANT ou DOCTOR.
   - **Entrada:**

   ```json
   {
     "email": "joaodasilva@hotmail.com",
     "name": "João da Silva",
     "cpf": "99999999999",
     "password": "12345",
     "bloodType": "O-",
     "allergies": "Dipirona",
     "medications": "toma remedio para pressão alta"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 8,
     "userId": 19,
     "bloodType": "O-",
     "allergies": "Dipirona",
     "medications": "toma remedio para pressão alta",
     "createdAt": "2025-06-09T16:39:45.580Z",
     "updatedAt": "2025-06-12T01:00:25.686Z",
     "user": {
       "email": "joaodasilva@hotmail.com",
       "name": "João da Silva",
       "cpf": "99999999999",
       "createdAt": "2025-06-09T16:39:45.561Z",
       "updatedAt": "2025-06-12T01:00:25.673Z"
     }
   }
   ```

5. **DELETE /patients/:id**
   - **Descrição**: Exclui um paciente específico pelo ID.
   - **Permissão**: Apenas ADMIN
   - **Resposta:**
   ```json
   {
     "id": 20,
     "email": "felipesilva@hotmail.com",
     "name": "Felipe da Silva",
     "cpf": "74714998005",
     "role": "PATIENT",
     "createdAt": "2025-06-15T14:56:26.642Z",
     "updatedAt": "2025-06-15T14:56:26.642Z"
   }
   ```

### Médicos (Doctors)

1. **GET /doctors**

   - **Descrição**: Retorna todos os médicos registrados no sistema.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**

   ```json
   [
     {
       "id": 4,
       "userId": 16,
       "specialty": "Osteopata",
       "crm": "31234",
       "createdAt": "2025-06-08T15:44:19.735Z",
       "updatedAt": "2025-06-08T15:44:19.735Z",
       "user": {
         "email": "rafaela_silva@hotmail.com",
         "name": "Rafaela Silva",
         "cpf": "10571722008",
         "createdAt": "2025-06-08T15:44:19.721Z",
         "updatedAt": "2025-06-14T18:25:29.961Z"
       }
     }
   ]
   ```

2. **POST /doctors**

   - **Descrição**: Cria um novo médico no sistema.
   - **Permissão**: Apenas ADMIN.
   - **Entrada:**

   ```json
   {
     "email": "rafaela@hotmail.com",
     "name": "Rafaela Moreno",
     "cpf": "10571722008",
     "password": "12345",
     "specialty": "Osteopata",
     "crm": "31234"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 4,
     "userId": 16,
     "specialty": "Osteopata",
     "crm": "31234",
     "createdAt": "2025-06-08T15:44:19.735Z",
     "updatedAt": "2025-06-08T15:44:19.735Z"
   }
   ```

3. **GET /doctors/:id**

   - **Descrição**: Retorna as informações de um médico específico pelo ID.
   - **Permissão**: Apenas ADMIN e DOCTOR,
   - **Resposta:**

   ```json
   {
     "id": 4,
     "userId": 16,
     "specialty": "Osteopata",
     "crm": "31234",
     "createdAt": "2025-06-08T15:44:19.735Z",
     "updatedAt": "2025-06-08T15:44:19.735Z",
     "user": {
       "email": "mateus_leonardo19979@hotmail.com",
       "name": "Rafaela Moreno",
       "cpf": "10571722008",
       "createdAt": "2025-06-08T15:44:19.721Z",
       "updatedAt": "2025-06-09T17:21:01.462Z"
     }
   }
   ```

4. **PATCH /doctors/:id**

   - **Descrição**: Atualiza as informações de um médico específico pelo ID.
   - **Permissão**: Apenas ADMIN e DOCTOR.
   - **Entrada:**

   ```json
   {
     "email": "rafaela_silva@hotmail.com",
     "name": "Rafaela Silva",
     "cpf": "10571722008",
     "password": "12345",
     "specialty": "Osteopata",
     "crm": "31234"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 4,
     "userId": 16,
     "specialty": "Osteopata",
     "crm": "31234",
     "createdAt": "2025-06-08T15:44:19.735Z",
     "updatedAt": "2025-06-08T15:44:19.735Z",
     "user": {
       "email": "rafaela_silva@hotmail.com",
       "name": "Rafaela Silva",
       "cpf": "10571722008",
       "createdAt": "2025-06-08T15:44:19.721Z",
       "updatedAt": "2025-06-14T18:25:29.961Z"
     }
   }
   ```

5. **DELETE /doctors/:id**
   - **Descrição**: Exclui um médico específico pelo ID.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**
   ```json
   {
     "id": 23,
     "email": "fernando@hotmail.com",
     "name": "Fernando Santos",
     "cpf": "51335472347",
     "role": "DOCTOR",
     "createdAt": "2025-06-15T15:06:30.171Z",
     "updatedAt": "2025-06-15T15:06:30.171Z"
   }
   ```

### Atendentes (Attendants)

1. **GET /attendants**

   - **Descrição**: Retorna todos os atendentes registrados no sistema.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**

   ```json
   [
     {
       "id": 4,
       "userId": 18,
       "accessCode": "12345678910",
       "createdAt": "2025-06-08T22:42:17.331Z",
       "updatedAt": "2025-06-08T22:42:17.331Z",
       "user": {
         "email": "joaodasilva@gmail.com",
         "name": "João da Silva dos Santos",
         "cpf": "99999999999",
         "createdAt": "2025-06-08T22:42:17.323Z",
         "updatedAt": "2025-06-08T22:42:17.323Z"
       }
     }
   ]
   ```

2. **POST /attendants**

   - **Descrição**: Cria um novo atendente no sistema.
   - **Permissão**: Apenas ADMIN.
   - **Entrada:**

   ```json
   {
     "email": "joanasantos@hotmail.com",
     "name": "Joana Santos",
     "cpf": "33262539074",
     "password": "12345",
     "accessCode": "12345678910"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 4,
     "userId": 18,
     "accessCode": "12345678910",
     "createdAt": "2025-06-08T22:42:17.331Z",
     "updatedAt": "2025-06-08T22:42:17.331Z"
   }
   ```

3. **GET /attendants/:id**

   - **Descrição**: Retorna as informações de um atendente específico pelo ID.
   - **Permissão**: Apenas ADMIN e ATTENDANT.
   - **Resposta:**

   ```json
   {
     "id": 4,
     "userId": 18,
     "accessCode": "12345678910",
     "createdAt": "2025-06-08T22:42:17.331Z",
     "updatedAt": "2025-06-08T22:42:17.331Z",
     "user": {
       "email": "joanasantos@hotmail.com",
       "name": "Joana Santos",
       "cpf": "33262539074",
       "createdAt": "2025-06-08T22:42:17.323Z",
       "updatedAt": "2025-06-08T22:42:17.323Z"
     }
   }
   ```

4. **PATCH /attendants/:id**

   - **Descrição**: Atualiza as informações de um atendente específico pelo ID.
   - **Permissão**: Apenas ADMIN e ATTENDANT.
   - **Entrada:**

   ```json
   {
     "email": "joanasantossilva@hotmail.com",
     "name": "Joana Santos Silva",
     "password": "12345",
     "cpf": "33262539074",
     "accessCode": "12345678910"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 4,
     "userId": 18,
     "accessCode": "12345678910",
     "createdAt": "2025-06-08T22:42:17.331Z",
     "updatedAt": "2025-06-08T22:42:17.331Z",
     "user": {
       "email": "joanasantossilva@hotmail.com",
       "name": "Joana Santos Silva",
       "cpf": "33262539074",
       "createdAt": "2025-06-08T22:42:17.323Z",
       "updatedAt": "2025-06-14T19:18:25.974Z"
     }
   }
   ```

5. **DELETE /attendants/:id**
   - **Descrição**: Exclui um atendente específico pelo ID.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**
   ```json
   {
     "id": 25,
     "email": "claudio_viana@hotmail.com",
     "name": "Cláudo Viana",
     "cpf": "76995324811",
     "role": "ATTENDANT",
     "createdAt": "2025-06-15T15:24:32.901Z",
     "updatedAt": "2025-06-15T15:24:32.901Z"
   }
   ```

### Consultas (Appointments)

1. **GET /appointments**

   - **Descrição**: Retorna todos os agendamentos de consultas no sistema.
   - **Permissão**: Apenas ADMIN e ATTENDANT.
   - **Resposta:**

   ```json
   [
     {
       "id": 9,
       "patientId": 8,
       "doctorId": 4,
       "attendantId": null,
       "date": "2025-07-11T09:00:00.000Z",
       "status": "PENDING",
       "reason": "Sentindo dores na canela",
       "notes": null,
       "duration": 30,
       "createdAt": "2025-06-14T18:15:18.339Z",
       "updatedAt": "2025-06-14T18:15:18.339Z"
     }
   ]
   ```

2. **POST /appointments**

   - **Descrição**: Cria um novo agendamento de consulta.
   - **Permissão**: Apenas ADMIN E ATTENDANT.
   - **Entrada:**

   ```json
   {
     "patientId": 8,
     "doctorId": 4,
     "date": "2025-07-12T09:00:00.000Z",
     "reason": "Dores de cabeça",
     "notes": null,
     "duration": 45
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 10,
     "patientId": 8,
     "doctorId": 4,
     "attendantId": 4,
     "date": "2025-07-12T09:00:00.000Z",
     "status": "PENDING",
     "reason": "Dores de cabeça",
     "notes": null,
     "duration": 45,
     "createdAt": "2025-06-15T15:38:00.221Z",
     "updatedAt": "2025-06-15T15:38:00.221Z"
   }
   ```

3. **GET /appointments/:id**

   - **Descrição**: Retorna as informações de um agendamento de consulta específico.
   - **Permissão**: ADMIN, ATTENDANT, DOCTOR, PATIENT.
   - **Resposta:**

   ```json
   {
     "id": 10,
     "patientId": 8,
     "doctorId": 4,
     "attendantId": 4,
     "date": "2025-07-12T09:00:00.000Z",
     "status": "PENDING",
     "reason": "Dores de cabeça",
     "notes": null,
     "duration": 45,
     "createdAt": "2025-06-15T15:38:00.221Z",
     "updatedAt": "2025-06-15T15:38:00.221Z"
   }
   ```

4. **PATCH /appointments/:id**

   - **Descrição**: Atualiza um agendamento de consulta específico.
   - **Permissão**: ADMIN, ATTENDANT ou DOCTOR.
   - **Entrada:**

   ```json
   {
     "doctorId": 4,
     "attendantId": null,
     "date": "2025-07-12T09:00:00.000Z",
     "status": "CONFIRMED",
     "reason": "Dores de cabeça",
     "notes": null,
     "duration": 30
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 11,
     "patientId": 8,
     "doctorId": 4,
     "attendantId": null,
     "date": "2025-07-12T09:00:00.000Z",
     "status": "CONFIRMED",
     "reason": "Dores de cabeça",
     "notes": null,
     "duration": 30,
     "createdAt": "2025-06-15T20:01:45.239Z",
     "updatedAt": "2025-06-15T20:02:53.237Z"
   }
   ```

5. **DELETE /appointments/:id**
   - **Descrição**: Exclui um agendamento de consulta específico.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**
   ```json
   {
     "id": 10,
     "patientId": 8,
     "doctorId": 4,
     "attendantId": 4,
     "date": "2025-07-12T09:00:00.000Z",
     "status": "CONFIRMED",
     "reason": "Dores de cabeça",
     "notes": null,
     "duration": 45,
     "createdAt": "2025-06-15T15:38:00.221Z",
     "updatedAt": "2025-06-15T15:41:26.909Z"
   }
   ```

### Registros Médicos (Medical Records)

1. **GET /medical-records**

   - **Descrição**: Retorna todos os registros médicos.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**

   ```json
   [
     {
       "id": 3,
       "patientId": 8,
       "doctorId": 4,
       "date": "2025-06-14T18:27:00.519Z",
       "diagnosis": "Canelite severa",
       "prescription": "Anti-inflamatório e repouso",
       "notes": null,
       "createdAt": "2025-06-14T18:27:00.519Z",
       "updatedAt": "2025-06-14T18:27:00.519Z"
     }
   ]
   ```

2. **POST /medical-records**

   - **Descrição**: Cria um novo registro médico.
   - **Permissão**: Apenas DOCTOR.
   - **Entrada:**

   ```json
   {
     "patientId": 8,
     "date": "2025-06-14T18:27:00.519Z",
     "diagnosis": "Canelite severa",
     "prescription": "Anti-inflamatório e repouso",
     "notes": null
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 3,
     "patientId": 8,
     "doctorId": 4,
     "date": "2025-06-14T18:27:00.519Z",
     "diagnosis": "Canelite severa",
     "prescription": "Anti-inflamatório e repouso",
     "notes": null,
     "createdAt": "2025-06-14T18:27:00.519Z",
     "updatedAt": "2025-06-14T18:27:00.519Z"
   }
   ```

3. **GET /medical-records/:id**

   - **Descrição**: Retorna as informações de um registro médico específico.
   - **Permissão**: Apenas ADMIN, DOCTOR e PATIENT.
   - **Resposta:**

   ```json
   {
     "id": 3,
     "patientId": 8,
     "doctorId": 4,
     "date": "2025-06-14T18:27:00.519Z",
     "diagnosis": "Canelite severa",
     "prescription": "Anti-inflamatório e repouso",
     "notes": null,
     "createdAt": "2025-06-14T18:27:00.519Z",
     "updatedAt": "2025-06-14T18:27:00.519Z"
   }
   ```

4. **PATCH /medical-records/:id**

   - **Descrição**: Atualiza um registro médico específico.
   - **Permissão**: Apenas DOCTOR.
   - **Entrada:**

   ```json
   {
     "doctorId": 4,
     "date": "2025-06-14T18:27:00.519Z",
     "diagnosis": "Canelite severa",
     "prescription": "Anti-inflamatório e repouso",
     "notes": null
   }
   ```

5. **DELETE /medical-records/:id**
   - **Descrição**: Exclui um registro médico específico.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**
   ```json
   {
     "id": 3,
     "patientId": 8,
     "doctorId": 4,
     "date": "2025-06-14T18:27:00.519Z",
     "diagnosis": "Canelite severa",
     "prescription": "Anti-inflamatório e repouso",
     "notes": null,
     "createdAt": "2025-06-14T18:27:00.519Z",
     "updatedAt": "2025-06-14T18:27:00.519Z"
   }
   ```

### Admin

1. **GET /admin**

   - **Descrição**: Retorna todos os administradores registrados no sistema.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**

   ```json
   [
     {
       "id": 1,
       "accessCode": "3123",
       "userId": 9,
       "createdAt": "2025-06-08T14:54:57.105Z",
       "updatedAt": "2025-06-08T14:54:57.105Z",
       "user": {
         "email": "mateusleonardo@hotmail.com",
         "name": "Mateus Leonardo",
         "cpf": "97987533300",
         "createdAt": "2025-06-08T14:54:57.090Z",
         "updatedAt": "2025-06-08T14:59:00.608Z"
       }
     }
   ]
   ```

2. **POST /admin**

   - **Descrição**: Cria um novo administrador no sistema.
   - **Permissão**: Apenas ADMIN.
   - **Entrada:**

   ```json
   {
     "email": "mateusleonardo@hotmail.com",
     "name": "Mateus Leonardo",
     "cpf": "97987533300",
     "password": "12345",
     "accessCode": "3123"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 2,
     "accessCode": "1548",
     "userId": 26,
     "createdAt": "2025-06-15T19:26:17.497Z",
     "updatedAt": "2025-06-15T19:26:17.497Z"
   }
   ```

3. **GET /admin/:id**

   - **Descrição**: Retorna as informações de um administrador específico.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**

   ```json
   {
     "id": 1,
     "accessCode": "3123",
     "userId": 9,
     "createdAt": "2025-06-08T14:54:57.105Z",
     "updatedAt": "2025-06-08T14:54:57.105Z",
     "user": {
       "email": "mateusleonardo@hotmail.com",
       "name": "Mateus Leonardo",
       "cpf": "97987533300",
       "createdAt": "2025-06-08T14:54:57.090Z",
       "updatedAt": "2025-06-08T14:59:00.608Z"
     }
   }
   ```

4. **PATCH /admin/:id**

   - **Descrição**: Atualiza um administrador específico.
   - **Permissão**: Apenas ADMIN.
   - **Entrada:**

   ```json
   {
     "accessCode": "3123",
     "email": "mateusleonardo@hotmail.com",
     "name": "Mateus Leonardo",
     "cpf": "97987533300"
   }
   ```

   - **Resposta:**

   ```json
   {
     "id": 1,
     "accessCode": "2241",
     "userId": 9,
     "createdAt": "2025-06-08T14:54:57.105Z",
     "updatedAt": "2025-06-15T19:31:32.801Z",
     "user": {
       "email": "mateus_leonardo1997@hotmail.com",
       "name": "Mateus Leonardo",
       "cpf": "45885434824",
       "createdAt": "2025-06-08T14:54:57.090Z",
       "updatedAt": "2025-06-08T14:59:00.608Z"
     }
   }
   ```

5. **DELETE /admin/:id**
   - **Descrição**: Exclui um administrador específico.
   - **Permissão**: Apenas ADMIN.
   - **Resposta:**
   ```json
   {
     "id": 3,
     "patientId": 8,
     "doctorId": 4,
     "date": "2025-06-14T18:27:00.519Z",
     "diagnosis": "Canelite severa",
     "prescription": "Anti-inflamatório e repouso",
     "notes": null,
     "createdAt": "2025-06-14T18:27:00.519Z",
     "updatedAt": "2025-06-14T18:27:00.519Z"
   }
   ```

---

## Como Instalar e Rodar o Projeto

### Requisitos:

- **Node.js** (versão 22 ou superior)
- **Prisma**
- **NestJS**

### Passos para Instalação:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/MateusLeonardo/sghss.git
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
   npm run start:dev
   ```
