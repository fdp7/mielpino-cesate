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

    const declineCookies = () => {
        setCookie('cookieConsent', 'declined', { path: '/', maxAge: 60 * 60 * 24 * 365 });
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
                        <p className="font-medium mb-1">Utilizziamo i cookie 🍪</p>
                        <p>Questo sito utilizza i cookie per migliorare l'esperienza utente. Per maggiori informazioni consulta la nostra Privacy Policy.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={acceptCookies}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium min-w-[100px]"
                        >
                            Accetta
                        </button>
                        <button
                            onClick={declineCookies}
                            className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-md transition-colors font-medium min-w-[100px]"
                        >
                            Rifiuta
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