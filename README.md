# GradeUFOP

Aplicação feita com o intuito de fornecer aos alunos da UFOP, uma maneira de facilitar a montagem de suas grades para o semestre.

## Como Funciona o Algoritmo

A aplicação integra o frontend ao backend (node.js) e recebe de seus endpoints as disciplinas que estão armazenadas no Banco. 
O Banco de Dados foi preenchido com uma raspagem de dados feita em python com selenium.

O Algoritmo de resolução monta um grafo com as disciplinas escolhidas e então utilizando coloração distingue as disciplinas em que
seus horários entram em conflito.
O Algoritmo então retorna todas as possíveis grades dadas as disciplinas escolhidas.

## Iniciar Aplicação
Como o projeto ainda não foi hospedado, para utilizar a aplicação há dois scripts básicos.
Primeiramente, depois de clonar o repositório, baixe as dependências com 'npm i' tanto no diretório 'backend' quanto no 'frontend'.
Depois execute:
```
cd backend/src
yarn dev
```
Então, abra outra janela do terminal na raiz do pasta onde o repositório foi baixado e execute:
```
cd frontend
yarn start
```
