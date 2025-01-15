import { Inter } from 'next/font/google';
import { Montserrat_Alternates } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const montserrat_Alternates = Montserrat_Alternates({
    subsets: ['latin'],
    weight: ['100', "200", "300", "400", "500", "600", "700", "800", "900"]
});