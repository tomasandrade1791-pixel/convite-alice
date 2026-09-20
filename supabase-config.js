// Cole aqui SOMENTE a URL do projeto e a chave pública (publishable/anon).
// Nunca coloque service_role ou qualquer chave secreta neste arquivo.
window.AliceDB = null;

const SUPABASE_URL = "";
const SUPABASE_PUBLIC_KEY = "";

if (window.supabase && SUPABASE_URL && SUPABASE_PUBLIC_KEY) {
  window.AliceDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
}

// Corrige a imagem da etapa da cartinha sem alterar a etapa do nome Alice.
document.addEventListener('DOMContentLoaded', () => {
  const env = document.getElementById('envimg');
  if (env) {
    env.src = 'envelope-site.svg?v=3';
    env.removeAttribute('srcset');
  }
});
