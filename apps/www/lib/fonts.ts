import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const ktfPrima = localFont({
  src: [
    {
      path: '../public/fonts/ktf-prima/KTFPrimaTrial-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/ktf-prima/KTFPrimaTrial-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/ktf-prima/KTFPrimaTrial-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ktf-prima/KTFPrimaTrial-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ktf-prima/KTFPrimaTrial-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ktf-prima/KTFPrimaTrial-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-ktf-prima',
  display: 'swap',
})
