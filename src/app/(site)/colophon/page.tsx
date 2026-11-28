import type { Metadata } from 'next';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { Colophon } from '@/features/colophon';
import { ColophonDoodles } from '@/features/colophonDoodles';
import { getColophonData } from '@/entities/colophon/services/colophon.services';

export const metadata: Metadata = { title: '제작 과정' };

export default async function ColophonPage() {
    const data = await getColophonData();

    return (
        <>
            <Backdrop>
                <ColophonDoodles />
            </Backdrop>
            <div className="relative z-raised">
                <main>
                    <Colophon data={data} />
                    <Contact />
                </main>
                <Footer />
            </div>
        </>
    );
}
