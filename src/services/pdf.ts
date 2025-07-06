// src/services/pdfService.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem, Order } from '@/api/cart';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY?: number;
    };
}

export const generateOrderReceipt = (
    order: Order,
    items: CartItem[]
): Promise<void> => {
    return new Promise((resolve) => {
        const doc = new jsPDF() as jsPDFWithAutoTable;

        // Intestazione
        doc.setFontSize(22);
        doc.setTextColor(33, 33, 33);
        doc.text('MIELPINO', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Ricevuta di Acquisto', 105, 30, { align: 'center' });

        // Numero ordine e data
        doc.setFontSize(10);
        doc.text(`Ordine #${order.id}`, 20, 40);
        doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 20, 45);

        // Informazioni cliente
        doc.setFontSize(12);
        doc.text('Dati Cliente', 20, 60);

        doc.setFontSize(10);
        doc.text(`Nome: ${order.checkout_info.first_name} ${order.checkout_info.last_name}`, 20, 70);
        doc.text(`Email: ${order.checkout_info.email}`, 20, 75);
        doc.text(`Telefono: ${order.checkout_info.phone || 'Non specificato'}`, 20, 80);
        doc.text(`Indirizzo: ${order.checkout_info.address}`, 20, 85);
        doc.text(`${order.checkout_info.postal_code}, ${order.checkout_info.city}`, 20, 90);

        // Tabella prodotti
        const tableColumn = ["Prodotto", "Formato", "Prezzo", "Quantità", "Totale"];
        const tableRows = [];

        items.forEach(item => {
            const sizeValue = item.size ? parseFloat(item.size) : 1;
            const sizeLabel = sizeValue === 0.5 ? "500g" : "1kg";
            const price = item.price || 0;
            const subtotal = price * item.quantity * sizeValue;
            const shipping = subtotal >= 50 ? 0 : 5.00; // Spedizione gratuita sopra i 50€

            tableRows.push([
                item.name || `Prodotto #${item.productId}`,
                sizeLabel,
                `€${price.toFixed(2)}`,
                item.quantity,
                `€${subtotal.toFixed(2)}`
            ]);
        });

        // Aggiungi sempre la riga Spedizione come ultima voce
        tableRows.push([
            "Spedizione",
            "-",
            `€${shipping.toFixed(2)}`,
            "-",
            `€${shipping.toFixed(2)}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 100,
            theme: 'grid',
            headStyles: {
                fillColor: [255, 176, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            }
        });

        // Totale
        const finalY = doc.lastAutoTable?.finalY || doc.internal.pageSize.height;
        doc.setFontSize(12);
        doc.text(`Totale: €${order.total.toFixed(2)}`, 170, finalY + 15, { align: 'right' });

        // Note finali
        doc.setFontSize(9);
        doc.text('Grazie per aver scelto MIELPINO!', 105, finalY + 30, { align: 'center' });
        doc.text('Il pagamento sarà effettuato al momento della consegna.', 105, finalY + 35, { align: 'center' });

        // Salvataggio del PDF
        doc.save(`Ricevuta-Ordine-${order.id}.pdf`);
        resolve();
    });
};