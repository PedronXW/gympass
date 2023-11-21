# gympass

Aplicação em NodeJS que implementa um sistema de cria e gerenciamento de clientes e academias e permite que clientes façam check-in na sua respectiva academia se estiver dentro de um distancia determinada.

A aplicação utiliza Fastify como framework facilitador no processo de criação da API rest, e prisma para realizar o gerenciamento do banco de dados

Utilizamos docker-compose para criar e gerenciar o banco de dados postgres

A biblioteca utilizada para implentar os testes automatizados é a vitest

E utilizo também o github actions para gerenciamento de CI.

Para utilizar a aplicação basta utilizar o campo "npm run start:dev"
