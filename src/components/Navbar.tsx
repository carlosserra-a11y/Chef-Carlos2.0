import { ShoppingBag, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { Logo } from './ui/Logo.tsx';

const LINKS = [
  { href: '#ceias', rotulo: 'As ceias' },
  { href: '#como-encomendar', rotulo: 'Como encomendar' },
  { href: '#contato', rotulo: 'Contato' },
];

type Props = {
  quantidade: number;
  onAbrirCarrinho: () => void;
};

export function Navbar({ quantidade, onAbrirCarrinho }: Props) {
  const { scrollY } = useScroll();
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setRolou(y > 40));

  const fundo = rolou || menuAberto ? 'vidro shadow-[0_10px_40px_-20px_rgb(0_0_0/0.35)]' : 'border border-transparent';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <nav
        aria-label="Navegação principal"
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2 transition-all duration-500 md:px-6 ${fundo}`}
      >
        <a href="#inicio" className="shrink-0" aria-label="Início">
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-grafite transition-colors hover:text-tinta after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-ouro after:transition-transform hover:after:scale-x-100"
              >
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAbrirCarrinho}
            className="group relative inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2.5 text-sm font-semibold text-carrara transition hover:bg-grafite active:scale-95"
            aria-label={`Abrir pedido (${quantidade} ${quantidade === 1 ? 'item' : 'itens'})`}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Meu pedido</span>
            <AnimatePresence>
              {quantidade > 0 && (
                <motion.span
                  key={quantidade}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="grid min-w-5 place-items-center rounded-full bg-ouro px-1.5 text-[0.7rem] font-bold text-tinta"
                >
                  {quantidade}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-tinta transition hover:bg-marmore lg:hidden"
            onClick={() => setMenuAberto((v) => !v)}
            aria-expanded={menuAberto}
            aria-controls="menu-movel"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuAberto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {menuAberto && (
          <motion.ul
            id="menu-movel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="vidro mx-auto mt-2 grid max-w-7xl gap-1 rounded-2xl p-3 lg:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuAberto(false)}
                  className="block rounded-xl px-4 py-3 font-display text-2xl font-semibold text-tinta hover:bg-white/70"
                >
                  {l.rotulo}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
