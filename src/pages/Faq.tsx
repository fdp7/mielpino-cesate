import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FAQItem = {
    question: string;
    answer: string;
};

const faqData: FAQItem[] = [
    {
        question: "Come annullare o modificare un ordine?",
        answer: "Puoi annullare o modificare il tuo ordine entro 24 ore prima della consegna contattandoci via email a support@agropino.it. Riceverai in tal caso in risposta una conferma dell'approvazione tua richiesta."
    },
    {
        question: "Quando effettuare il pagamento?",
        answer: "Al momento della consegna il prodotto verrà nuovamente pesato per aggiornare (solo al ribasso) il prezzo in totale trasparenza. Solo allora si accetterà il pagamento da parte vostra."
    },
    {
        question: "Come funziona la consegna?",
        answer: "Una volta confermato l'ordine organizzeremo la consegna in accordo con voi, contattandovi via email o telefonicamente. Offriamo spedizione gratuita per ordini superiori a €50."
    }
];

const Faq = () => {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
                        Domande Frequenti
                    </h1>
                    <p className="text-center text-gray-600 mb-12 text-lg">
                        Trova le risposte alle domande più comuni sui nostri prodotti e servizi
                    </p>

                    <div className="space-y-4">
                        {faqData.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
                                >
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-agropino-jasmine transition-colors">
                                        {item.question}
                                    </h2>
                                    <div className="flex-shrink-0 ml-4">
                                        {openItems.includes(index) ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-agropino-jasmine transition-colors" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-agropino-jasmine transition-colors" />
                                        )}
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="px-6 pb-5">
                                        <div className="h-px bg-gray-200 mb-4"></div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-600">
                            Non hai trovato quello che cercavi?{' '}
                            <a href="mailto:support@agropino.it" className="text-muted-foreground hover:text-agropino-jasmine font-medium underline">
                                Contattaci
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Faq;