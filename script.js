document.getElementById('add-product').addEventListener('click', addProduct);
document.getElementById('generate-pdf').addEventListener('click', generatePDF);
document.getElementById('logo-upload').addEventListener('change', handleLogoUpload);

let logoDataUrl = '';

function addProduct() {
    const table = document.getElementById('products-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    
    cell1.innerHTML = `<input type="number" value="1">`;
    cell2.innerHTML = `<input type="text">`;
    cell3.innerHTML = `<input type="text">`;
    cell4.innerHTML = `<button type="button" onclick="removeProduct(this)">Eliminar</button>`;
}

function removeProduct(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoImg = document.getElementById('company-logo-preview');
        logoImg.src = e.target.result;
        logoDataUrl = e.target.result;
    };
    reader.readAsDataURL(file);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4'); // Adaptar a tamaño carta

    // Verificar si el logo ha sido cargado antes de continuar
    if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', 10, 10, 30, 30); // Ajustar el tamaño del logo
    }

    const primaryColor = '#00AEEF'; // Color primario del logo
    const secondaryColor = '#FF6A00'; // Color secundario del logo

    // Obteniendo los valores del formulario
    const greeting = document.getElementById('greeting').value;
    const clientName = document.getElementById('client-name').value;
    const clientNIT = document.getElementById('client-nit').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientPhone = document.getElementById('client-phone').value;
    const quotationDate = document.getElementById('quotation-date').value;
    const dueDate = document.getElementById('due-date').value;
    const warranty = document.getElementById('warranty').value;
    const downPayment = document.getElementById('down-payment').value;
    const notes = document.getElementById('notes').value;

    // Establecer estilos
    doc.setFont('Helvetica');
    doc.setFontSize(12);

    doc.setTextColor(primaryColor);
    doc.text(`INNOVATECNOL`, 50, 20); // Ajustar la posición para el logo más pequeño
    doc.text(`Teléfono o WhatsApp: 55238726`, 50, 30);
    doc.text(`Facebook: INNOVATECNOL`, 50, 40);
    doc.text(`Correo: innovatecnol65@gmail.com`, 50, 50);

    doc.setTextColor(0, 0, 0);
    doc.text(greeting, 10, 70, { maxWidth: 190, align: "justify" });

    if (clientName) doc.text(`Nombre del Cliente: ${clientName}`, 10, 100);
    if (clientNIT) doc.text(`NIT del Cliente: ${clientNIT}`, 10, 110);
    if (clientEmail) doc.text(`Correo Electrónico: ${clientEmail}`, 10, 120);
    if (clientPhone) doc.text(`Teléfono: ${clientPhone}`, 10, 130);
    if (quotationDate) doc.text(`Fecha: ${quotationDate}`, 10, 140);
    if (dueDate) doc.text(`Fecha de Vencimiento: ${dueDate}`, 10, 150);
    if (warranty) doc.text(`Garantía: ${warranty}`, 10, 160);
    if (downPayment) doc.text(`Anticipo: ${downPayment}`, 10, 170);

    const table = document.getElementById('products-table').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    let startY = 180;

    // Agregar encabezados de la tabla
    doc.setFillColor(primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(10, startY, 190, 10, 'F');
    doc.text('Cant.', 12, startY + 7);
    doc.text('Descripción', 40, startY + 7);
    doc.text('Total', 180, startY + 7);

    startY += 10;
    doc.setTextColor(0, 0, 0);

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const qty = cells[0].getElementsByTagName('input')[0].value;
        const description = cells[1].getElementsByTagName('input')[0].value;
        const total = cells[2].getElementsByTagName('input')[0].value;

        doc.text(qty, 12, startY);
        doc.text(description, 40, startY, { maxWidth: 130 });
        doc.text(total, 180, startY);

        startY += 10;
    }

    // Agregar observaciones al final
    if (notes) {
        startY += 10; // Espacio antes de las observaciones
        doc.setTextColor(primaryColor);
        doc.text('Observaciones', 10, startY);
        doc.setTextColor(0, 0, 0);
        doc.text(notes, 10, startY + 10, { maxWidth: 190, align: "justify" });
    }

    doc.save(`cotizacion_${clientName}.pdf`);
}
