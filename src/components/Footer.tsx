import { MapPin } from 'lucide-react';
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, WHATSAPP_EXIBICAO, WHATSAPP_NUMERO, foto } from '../data/menuData.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import { InstagramIcon, WhatsAppIcon } from './ui/BrandIcons.tsx';
import { Logo } from './ui/Logo.tsx';
import { Reveal } from './ui/Reveal.tsx';

const MENSAGEM = 'Olá, Chef Carlos! Quero encomendar a minha ceia de Natal.';
const NAVEGACAO = [
  ['#ceias', 'As três ceias'],
  ['#como-encomendar', 'Como encomendar'],
  ['#inicio', 'Voltar ao topo'],
];

type Props = {
  /** Reabre o aviso de cookies para o visitante mudar a escolha. */
  onPreferenciasPrivacidade: () => void;
};

export function Footer({ onPreferenciasPrivacidade }: Props) {
  const ano = new Date().getFullYear();
  return (
    <footer id="contato" className="relative overflow-hidden bg-tinta text-carrara">
      <div className="absolute inset-0 opacity-25" aria-hidden="true">
        <img src={foto('IMG_7326')} alt="" loading="lazy" className="size-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-tinta via-tinta/90 to-tinta" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 pt-24 md:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <p className="font-script text-5xl text-ouro md:text-6xl">Vamos conversar?</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,1.5rem+3.4vw,4.6rem)] font-semibold leading-[0.98]">
            Desenhamos o banquete do seu evento
          </h2>
          <p className="mt-5 max-w-xl text-carrara/70">
            Ceias, casamentos, buffets corporativos e jantares: atendimento pessoal do Chef, do cardápio à montagem da mesa.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={linkWhatsApp(WHATSAPP_NUMERO, MENSAGEM)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <WhatsAppIcon /> {WHATSAPP_EXIBICAO}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-ouro hover:text-ouro"
            >
              <InstagramIcon /> {INSTAGRAM_USUARIO}
            </a>
          </div>
        </Reveal>

        <div className="mt-24 grid gap-10 border-t border-white/10 py-12 md:grid-cols-3">
          <div>
            <Logo claro tamanho="grande" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-carrara/60">
              Maestria culinária e banquetes exclusivos com a assinatura do Chef Carlos Jr.
            </p>
          </div>
          <nav aria-label="Rodapé">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ouro">Navegação</p>
            <ul className="mt-4 space-y-2">
              {NAVEGACAO.map(([href, rotulo]) => (
                <li key={href}>
                  <a href={href} className="text-sm text-carrara/75 transition hover:text-carrara">
                    {rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ouro">Contato</p>
            <ul className="mt-4 space-y-3 text-sm text-carrara/75">
              <li>
                <a href={linkWhatsApp(WHATSAPP_NUMERO)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-carrara">
                  <WhatsAppIcon className="size-4" /> {WHATSAPP_EXIBICAO}
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-carrara">
                  <InstagramIcon className="size-4" /> {INSTAGRAM_USUARIO}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4" aria-hidden="true" /> Grande Florianópolis · SC
              </li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/10 py-6 text-center text-xs text-carrara/45">
          © {ano} Chef Carlos Jr Gastronomia. Fotos de eventos do Chef e equipe; as marcadas como ilustrativas são apenas
          referência. ·{' '}
          <button type="button" onClick={onPreferenciasPrivacidade} className="underline underline-offset-4 transition hover:text-carrara">
            Cookies e privacidade
          </button>
        </p>
      </div>
    </footer>
  );
}
