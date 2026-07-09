'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const FAQ = [
  {
    q: 'Yöresel Tarifler ücretsiz mi?',
    a: 'Evet, sitedeki tüm tarifleri görüntülemek, favorilere eklemek ve alışveriş listesi oluşturmak tamamen ücretsizdir.',
  },
  {
    q: 'Nasıl tarif önerebilirim?',
    a: 'Giriş yaptıktan sonra "Tarif Öner" sayfasından kendi tarifinizi gönderebilirsiniz. Gönderdiğiniz tarif, editör ekibimiz tarafından incelendikten sonra yayınlanır.',
  },
  {
    q: 'Favori tariflerim nerede saklanıyor?',
    a: 'Giriş yaptıysanız favorileriniz hesabınıza bağlı olarak sunucuda saklanır ve her cihazdan erişebilirsiniz. Misafir kullanım sırasında favoriler yalnızca tarayıcınızda tutulur.',
  },
  {
    q: 'Alışveriş listesi nasıl çalışır?',
    a: 'Bir tarifin malzemelerini tek tıkla alışveriş listenize ekleyebilir, satın aldıkça işaretleyebilirsiniz.',
  },
  {
    q: 'Hesabımı nasıl silebilirim?',
    a: 'Hesap silme talebiniz için info@yoreseltarif.com adresinden bize ulaşın, talebiniz en kısa sürede işleme alınır.',
  },
  {
    q: 'Mobil uygulamanız var mı?',
    a: 'Evet, iOS ve Android için ücretsiz mobil uygulamamızı kullanabilirsiniz. Uygulama linklerine sayfanın alt kısmından ulaşabilirsiniz.',
  },
]

export default function SssPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Ana Sayfa
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #B97A1A 0%, #D99520 100%)' }}
        >
          ❓
        </div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
          Sıkça Sorulan Sorular
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {FAQ.map((item, i) => (
          <div
            key={item.q}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.q}</span>
              <ChevronDown
                size={16}
                className={clsx('flex-shrink-0 transition-transform duration-200', openIndex === i && 'rotate-180')}
                style={{ color: 'var(--primary)' }}
              />
            </button>
            {openIndex === i && (
              <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
