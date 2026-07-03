# Nucleo Familiar Planejado

Base nova para evoluir a arvore familiar com mais planejamento, separacao por camadas e migracao gradual do material antigo.

## Objetivo

- Reaproveitar os objetos de dados do projeto antigo sem quebrar o publicado.
- Centralizar informacoes em um formato previsivel.
- Organizar imagens por tipo e por contexto de uso.
- Permitir migracao por etapas: primeiro a estrutura, depois os dados, depois as paginas.

## Estrutura inicial

- `dados/`: fonte de verdade dos registros.
- `imagens/`: imagens separadas por subdiretorios adequados.
- `paginas/`: paginas geradas ou mantidas por contexto.
- `docs/`: regras, padroes e plano de migracao.
- `css/` e `js/`: base visual e comportamento do site.

## Caminho de evolucao

1. Definir padroes de cadastro e nomes de objetos.
2. Mapear o que sera reaproveitado do `nucleo-familiar-reservado`.
3. Migrar uma arvore por vez.
4. Consolidar imagens e links de paginas.
5. Validar homogeneidade antes de publicar qualquer etapa.

## Regra de edicao (propagacao)

Para evitar misturar arquivos manuais com arquivos de propagacao, use esta regra:

- Paginas principais canonicas dos 6 bisnetos ficam em `paginas/` (ex.: `paginas/lorena.html`, `paginas/alice.html`).
- Quer alterar um ancestral compartilhado por varios bisnetos: editar `dados/arvores-propagacao.json`.
- Quer alterar dados gerais de pessoa (nome, imagem, pagina): editar `dados/pessoas.json`.
- Quer alterar o comportamento de renderizacao para todas as arvores de propagacao: editar `js/arvore-propagacao.js`.
- Quer alterar conteudo exclusivo de uma pessoa: editar somente a pagina dela em `paginas/saiba-mais/`.

## Paginas duplicadas por pessoa (por que existem)

Em algumas arvores existem duas paginas, por exemplo:

- `paginas/arvore-rafael/rafael.html`: legado, hoje redireciona para `paginas/rafael.html`.
- `paginas/arvore-rafael/rafael-propagacao.html`: legado, hoje redireciona para `paginas/rafael.html`.

Durante a migracao, os caminhos curtos em `paginas/` sao a referencia principal para navegacao.
Arquivos em `paginas/arvore-*` seguem como legado temporario para compatibilidade e auditoria (via redirecionamento).
