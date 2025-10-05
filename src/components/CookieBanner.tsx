import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const CookieBanner = () => {
    const [cookies, setCookie] = useCookies(['cookieConsent']);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!cookies.cookieConsent) {
            setVisible(true);
        }
    }, [cookies.cookieConsent]);

    const acceptCookies = () => {
        setCookie('cookieConsent', 'accepted', { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 anno
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[1000] bg-agropino-jasmine shadow-lg transition-all duration-300 ease-in-out"
            style={{
                animation: 'slideUp 0.5s ease-out',
            }}
        >
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-gray-800 text-sm md:text-base">
                        <p className="font-medium mb-1">Informativa Cookie 🍪</p>
                        <p className="mb-2">Questo sito utilizza esclusivamente cookie tecnici necessari per il funzionamento del carrello e per salvare le tue preferenze sui cookie.</p>
                        <p className="text-xs">
                            <strong>Dati raccolti:</strong> Durante l'acquisto vengono memorizzati solo i dati inseriti nel modulo di checkout per processare l'ordine.
                        </p>
                        <p className="text-xs mt-1">
                            <strong>Privacy garantita:</strong> I tuoi dati NON vengono condivisi con terze parti; inoltre NON tracciamo i visitatori del sito.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={acceptCookies}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium min-w-[100px]"
                        >
                            Accetta solo essenziali
                        </button>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}} />
        </div>
    );
};

export default CookieBanner;