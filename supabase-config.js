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

  // Ajuste visual da carta: mantém o laço dentro da moldura azul,
  // deixa o texto abaixo dele e preserva os detalhes azuis nas laterais.
  const style = document.createElement('style');
  style.textContent = `
    .letterArt{
      height:100vh;
      min-height:100vh;
      padding:0;
      overflow:hidden;
      background-position:center top;
      background-size:100% 100%;
    }
    .letterArt .paperContent{
      height:100%;
      max-height:none;
      overflow-y:auto;
      overflow-x:hidden;
      background:transparent;
      border-radius:0;
      padding:150px 10% 105px;
      scrollbar-width:none;
    }
    .letterArt .paperContent::-webkit-scrollbar{display:none}
    .letterArt h1{
      font-size:clamp(27px,6vw,40px);
      margin:0 0 14px;
    }
    .letterArt .message{
      font-size:clamp(15px,4.2vw,18px);
      line-height:1.5;
    }
    .letterArt .message p{margin:0 0 18px}
    .letterArt .detail{
      padding:11px 13px;
      margin:8px 0;
      background:rgba(255,247,235,.72);
    }
    @media(max-width:650px){
      .letterArt .paperContent{padding-top:145px;padding-left:9%;padding-right:9%;padding-bottom:100px}
      .letterArt h1{font-size:clamp(27px,7vw,35px);margin-bottom:12px}
      .letterArt .message{font-size:16px;line-height:1.48}
      .letterArt .message p{margin-bottom:16px}
    }
  `;
  document.head.appendChild(style);
});
