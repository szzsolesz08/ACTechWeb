import jsPDF from 'jspdf';

export const generateInvoice = (bookingData, bookingReference, serviceTypes, units, prices, maintenancePlans) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('AC Technician Services', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Budapest, Hungary', 105, 27, { align: 'center' });
  doc.text('Phone: +36 1 234 5678', 105, 32, { align: 'center' });
  doc.text('Email: info@actechnician.com', 105, 37, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('INVOICE', 105, 50, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Reference Number: ${bookingReference}`, 20, 60);
  doc.text(`Date: ${new Date().toLocaleDateString('hu-HU')}`, 20, 67);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Bill To:', 20, 80);
  
  doc.setFont(undefined, 'normal');
  doc.text(bookingData.name, 20, 87);
  doc.text(bookingData.email, 20, 94);
  doc.text(bookingData.phone, 20, 101);
  
  const addressLines = doc.splitTextToSize(bookingData.address, 170);
  let yPos = 108;
  addressLines.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Service Details:', 20, yPos);
  
  yPos += 10;
  doc.setFont(undefined, 'normal');
  
  const service = serviceTypes.find(s => s.id == bookingData.serviceType);
  doc.text(`Service Type: ${service?.name || 'N/A'}`, 20, yPos);
  yPos += 7;
  const serviceDate = new Date(bookingData.date).toLocaleDateString('hu-HU');
  doc.text(`Service Date: ${serviceDate}`, 20, yPos);
  yPos += 7;
  doc.text(`Time Slot: ${bookingData.timeSlot}`, 20, yPos);
  yPos += 7;
  
  if (bookingData.serviceType == 1 && bookingData.unit) {
    const unit = units.find(u => u.id == bookingData.unit);
    if (unit) {
      doc.text(`AC Unit: ${unit.name}`, 20, yPos);
      yPos += 7;
    }
  }
  
  if (bookingData.serviceType == 6 && bookingData.maintenancePlan) {
    const plan = maintenancePlans.find(p => p.id === bookingData.maintenancePlan);
    if (plan) {
      doc.text(`Plan: ${plan.name}`, 20, yPos);
      yPos += 7;
    }
  }
  
  if (bookingData.description) {
    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Description:', 20, yPos);
    yPos += 7;
    doc.setFont(undefined, 'normal');
    const descLines = doc.splitTextToSize(bookingData.description, 170);
    descLines.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 7;
    });
  }
  
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Price Breakdown:', 20, yPos);
  yPos += 10;
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  doc.text('Description', 25, yPos);
  doc.text('Amount (Ft)', 150, yPos);
  
  yPos += 10;
  doc.setFont(undefined, 'normal');
  
  if (bookingData.serviceType == 1 && bookingData.unit) {
    const unit = units.find(u => u.id == bookingData.unit);
    const installService = prices.find(p => p.id === 1);
    
    if (unit) {
      doc.text(`AC Unit: ${unit.name}`, 25, yPos);
      doc.text(unit.price.toLocaleString('hu-HU'), 150, yPos);
      yPos += 7;
    }
    
    if (installService) {
      doc.text('Installation Service', 25, yPos);
      doc.text(installService.price.toLocaleString('hu-HU'), 150, yPos);
      yPos += 7;
    }
  } else {
    doc.text(service?.name || 'Service', 25, yPos);
    doc.text(bookingData.price.toLocaleString('hu-HU'), 150, yPos);
    yPos += 7;
  }
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 7;
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('Total Amount:', 25, yPos);
  doc.text(`${bookingData.price.toLocaleString('hu-HU')} Ft`, 150, yPos);
  
  yPos = 270;
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.text('Thank you for choosing AC Technician Services!', 105, yPos, { align: 'center' });
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, yPos + 5, { align: 'center' });
  
  doc.save(`Invoice_${bookingReference}.pdf`);
};
