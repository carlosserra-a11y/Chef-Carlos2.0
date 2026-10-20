import { motion } from 'motion/react';
import { WHATSAPP_NUMERO } from '../data/menuData.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';

const MENSAGEM = 'Olá, Chef Carlos! Vim pelo site e gostaria de mais informações.';

export function FloatingWhatsApp() {
  return (
    <motion.a
      href={linkWhatsApp(WHATSAPP_NUMERO, MENSAGEM)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com o Chef no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 18 }}
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-8px_rgb(28_157_80/0.7)] transition hover:scale-105"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-25" aria-hidden="true" />
      <WhatsAppIcon className="relative size-7" />
    </motion.a>
  );
}
