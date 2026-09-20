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
});
