// Cole aqui SOMENTE a URL do projeto e a chave pública (publishable/anon).
// Nunca coloque service_role ou qualquer chave secreta neste arquivo.
window.AliceDB = null;

const SUPABASE_URL = "";
const SUPABASE_PUBLIC_KEY = "";

if (window.supabase && SUPABASE_URL && SUPABASE_PUBLIC_KEY) {
  window.AliceDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
}

// Usa a cartinha fechada correta, sem alterar a etapa do nome Alice.
document.addEventListener('DOMContentLoaded', () => {
  const env = document.getElementById('envimg');
  if (env) {
    env.src = 'IMG-20260919-WA0104.jpg?v=2';
    env.removeAttribute('srcset');
  }

  // Ajuste da cartinha: mantém toda a moldura/detalhes azuis visíveis,
  // deixa o laço no topo e impede que o texto fique sobre os ornamentos.
  const style = document.createElement('style');
  style.textContent = `
    .letterArt {
      background-size: 100% 100%;
      background-position: center top;
      background-repeat: no-repeat;
    }

    .letterArt .paperContent {
      position: relative;
      z-index: 1;
      width: 100%;
      max-height: none;
      overflow: visible;
      background: transparent;
      border-radius: 0;
      padding: 155px 13% 115px;
      box-sizing: border-box;
    }

    .letterArt h1 {
      margin: 0 0 14px;
      font-size: clamp(28px, 7vw, 44px);
      line-height: 1.15;
    }

    .letterArt .message {
      font-size: clamp(16px, 4.2vw, 18px);
      line-height: 1.65;
      text-align: center;
    }

    .letterArt .message p {
      margin: 0 0 20px;
    }

    .letterArt .detail {
      margin: 10px 0;
      padding: 14px;
    }

    @media (max-width: 650px) {
      .letterArt .paperContent {
        padding: 150px 12% 110px;
      }

      .letterArt h1 {
        font-size: 30px;
      }

      .letterArt .message {
        font-size: 16px;
        line-height: 1.58;
      }
    }
  `;
  document.head.appendChild(style);
});
