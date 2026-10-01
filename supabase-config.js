// Cole aqui SOMENTE a URL do projeto e a chave pública (publishable/anon).
// Nunca coloque service_role ou qualquer chave secreta neste arquivo.
window.AliceDB = null;

const SUPABASE_URL = "https://pzhydhwkqqlowhfnrszd.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_e2R0FHCX7CtG_idoo9LddQ_tAKB2K5u";

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

  // Guarda o nome enquanto ele é digitado. Assim a confirmação não depende
  // apenas do valor atual do campo quando o convidado chega à próxima tela.
  const guestInput = document.getElementById('gn');
  if (guestInput) {
    const savedName = localStorage.getItem('aliceGuestName');
    if (savedName && !guestInput.value) guestInput.value = savedName;
    guestInput.addEventListener('input', () => {
      const name = guestInput.value.trim();
      if (name) localStorage.setItem('aliceGuestName', name);
      else localStorage.removeItem('aliceGuestName');
    });
  }

  // Substitui a antiga rotina de confirmação somente depois que o convite
  // terminou de carregar. A confirmação só avança após o Supabase
  // confirmar o INSERT na tabela "confirmacoes".
  window.respond = async function (v) {
    const buttons = document.querySelectorAll('#confirm .choice .btn');
    buttons.forEach(b => b.disabled = true);

    try {
      if (!window.AliceDB) {
        throw new Error('Conexão com o Supabase não foi inicializada.');
      }

      const input = document.getElementById('gn');
      const name = (input?.value || localStorage.getItem('aliceGuestName') || '').trim();
      if (!name) {
        throw new Error('Nome do convidado não encontrado.');
      }

      localStorage.setItem('aliceGuestName', name);

      const { error } = await window.AliceDB
        .from('confirmacoes')
        .insert({
          Nome: name,
          Confirmou: !!v,
          Mensagem: ''
        });

      if (error) throw error;

      const payload = { name, presence: !!v };
      const d = JSON.parse(localStorage.getItem('rsvp') || '[]');
      d.push({ ...payload, at: new Date().toISOString() });
      localStorage.setItem('rsvp', JSON.stringify(d));

      document.getElementById('rt').textContent = v ? '💙 Obrigada por confirmar!' : '🤍 Obrigada pelo carinho!';
      document.getElementById('rx').innerHTML = v
        ? '<strong>Oi! Eu sou a Alice! 💕⭐</strong><br><br>Muito obrigada por confirmar sua presença no meu chá de bebê! 🥹🍼<br><br>Mamãe e papai estão preparando tudo com muito carinho para esse dia, e saber que você estará lá para celebrar a minha chegada deixa esse momento ainda mais especial.<br><br>Mal posso esperar para te conhecer! 💙⭐<br><br>Nos vemos no meu chá!<br><br>Com carinho,<br><strong>Alice 🍼⭐</strong>'
        : '<strong>Oi! Eu sou a Alice! 💕⭐</strong><br><br>Tudo bem se você não conseguir estar presente no meu chá de bebê. 🥹💙<br><br>Mesmo de longe, seu carinho pela minha chegada já significa muito para minha família. ⭐<br><br>Se quiser deixar um presentinho para mim mesmo não podendo comparecer, será recebido com muito carinho. 🍼🎁<br><br><strong>CHAVE PIX — 47999037360</strong><br><br>Essa contribuição é totalmente opcional. O mais importante é saber que você torce pela minha chegada! 💙⭐<br><br>Com carinho,<br><strong>Alice 🍼⭐</strong>';
      show('response');
    } catch (e) {
      console.error('Falha ao registrar confirmação:', e);
      alert('Não foi possível registrar sua confirmação agora. Por favor, tente novamente.');
      buttons.forEach(b => b.disabled = false);
    }
  };
});
