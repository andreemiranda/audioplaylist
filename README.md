# Audio Book - O Mapa do Sucesso

Reprodutor digital do audiolivro **"O Mapa do Sucesso"** de **Lourivan Catsro**, reescrito e modernizado com **Next.js 15 (App Router)** e **Tailwind CSS**.

## Recursos

- **39 Capítulos de Áudio Completos**: Transmissão em alta fidelidade com fallback inteligente entre MP3 e OGG (local e remoto).
- **Controles de Reprodução Avançados**:
  - Play, Pause e Stop (reiniciar faixa)
  - Próximo e Anterior
  - Salto de tempo ±15 segundos
  - Seletor de velocidade da narração (0.75x, 1x, 1.25x, 1.5x, 2x)
- **Barra de Progresso Interativa**: Busca por clique e arrasto com indicação em tempo real de tempo transcorrido e duração total.
- **Controle de Volume Preciso**: Botão mudo/desmudo, barra de volume interativa e botão de volume máximo.
- **Modos de Reprodução**:
  - Modo Aleatório (Shuffle)
  - Repetição (Desativado, Repetir faixa atual, Repetir toda a lista)
- **Sumário Interativo de Capítulos**:
  - Busca em tempo real por nome ou número do capítulo
  - Sistema de favoritos/marcadores para salvar pontos importantes
  - Indicador visual e equalizador de faixa ativa
- **Memória de Reprodução (LocalStorage)**: Salva o último capítulo tocado, preferências de volume, velocidade e modo de repetição.
- **Atalhos do Teclado**:
  - `Espaço`: Play / Pause
  - `←` / `→`: Retroceder / Avançar 10 segundos
  - `M`: Mudo / Desmudo

## Tecnologias

- Next.js 15 (App Router)
- React 19 & TypeScript
- Tailwind CSS v4
- Lucide React (Ícones)
