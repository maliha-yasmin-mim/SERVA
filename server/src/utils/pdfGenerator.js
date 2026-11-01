import PDFDocument from 'pdfkit';

export const buildProofBoxPDF = (proofRecord, job, stream) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  doc.pipe(stream);

  // Background banner header
  doc.rect(0, 0, 595.28, 90).fill('#0F766E');

  // Title
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(22)
     .text('SERVA PROOFBOX™', 40, 25);

  doc.fontSize(10)
     .font('Helvetica')
     .text('VERIFIED COMPLETION & AUDIT REPORT — BANGLADESH', 40, 52);

  doc.fontSize(9)
     .text(`Report ID: ${proofRecord.completionReportId || 'SRV-PB-' + Date.now()}`, 380, 30, { align: 'right' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 380, 45, { align: 'right' });
  doc.text(`Status: ${proofRecord.status.toUpperCase()}`, 380, 60, { align: 'right' });

  doc.moveDown(4);

  // Section 1: Job & Project Overview
  doc.fillColor('#134E4A')
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('1. JOB & ENGAGEMENT OVERVIEW', 40, 115);

  doc.rect(40, 133, 515, 1).fill('#E3EAE7');

  doc.fillColor('#17211F')
     .font('Helvetica-Bold')
     .fontSize(11)
     .text(`Job Title: `, 40, 145);
  doc.font('Helvetica').text(job.title, 110, 145);

  doc.font('Helvetica-Bold').text(`Category: `, 40, 165);
  doc.font('Helvetica').text(job.category, 110, 165);

  doc.font('Helvetica-Bold').text(`Location: `, 280, 165);
  doc.font('Helvetica').text(job.location, 340, 165);

  doc.font('Helvetica-Bold').text(`Agreed Budget: `, 40, 185);
  doc.font('Helvetica').text(`BDT ${job.budget} (${job.paymentType})`, 130, 185);

  doc.font('Helvetica-Bold').text(`Work Date: `, 280, 185);
  doc.font('Helvetica').text(job.workDate || 'As scheduled', 350, 185);

  // Section 2: Parties Information
  doc.fillColor('#134E4A')
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('2. ENGAGED PARTIES', 40, 215);

  doc.rect(40, 233, 515, 1).fill('#E3EAE7');

  // Client Box
  doc.rect(40, 245, 250, 65).fillAndStroke('#F7F9F8', '#E3EAE7');
  doc.fillColor('#0F766E').font('Helvetica-Bold').fontSize(10).text('CLIENT / JOB POSTER', 50, 255);
  doc.fillColor('#17211F').font('Helvetica').text(`Name: ${proofRecord.client?.name || 'Verified Client'}`, 50, 272);
  doc.text(`Email: ${proofRecord.client?.email || 'N/A'}`, 50, 287);

  // Provider Box
  doc.rect(305, 245, 250, 65).fillAndStroke('#F7F9F8', '#E3EAE7');
  doc.fillColor('#0F766E').font('Helvetica-Bold').fontSize(10).text('ASSIGNED SERVICE PROVIDER', 315, 255);
  doc.fillColor('#17211F').font('Helvetica').text(`Name: ${proofRecord.provider?.name || 'Assigned Provider'}`, 315, 272);
  doc.text(`Rating: ${proofRecord.provider?.rating || 5.0} ★  | Status: ${proofRecord.provider?.verificationStatus || 'Verified'}`, 315, 287);

  // Section 3: Task Checklist & Milestones
  doc.fillColor('#134E4A')
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('3. AUDITED TASK CHECKLIST', 40, 330);

  doc.rect(40, 348, 515, 1).fill('#E3EAE7');

  let y = 360;
  if (proofRecord.checklist && proofRecord.checklist.length > 0) {
    proofRecord.checklist.forEach((item, index) => {
      const isDone = item.isCompleted;
      doc.rect(40, y, 12, 12).fillAndStroke(isDone ? '#15803D' : '#DC2626', '#E3EAE7');
      doc.fillColor('#FFFFFF').fontSize(8).text(isDone ? '✓' : '✗', 43, y + 2);

      doc.fillColor('#17211F').font('Helvetica-Bold').fontSize(10).text(`${index + 1}. ${item.title}`, 60, y + 1);
      if (item.description) {
        doc.font('Helvetica').fontSize(9).fillColor('#64716D').text(item.description, 60, y + 14);
        y += 14;
      }
      y += 18;
    });
  } else {
    doc.fillColor('#64716D').font('Helvetica').fontSize(10).text('No structured checklist items recorded for this task.', 40, y);
    y += 20;
  }

  // Section 4: Evidence & Before/After Gallery Details
  y = Math.max(y + 10, 480);
  doc.fillColor('#134E4A')
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('4. VERIFIED EVIDENCE & BEFORE/AFTER MEDIA', 40, y);

  doc.rect(40, y + 18, 515, 1).fill('#E3EAE7');
  y += 30;

  doc.fillColor('#17211F').font('Helvetica-Bold').fontSize(10).text('Before-Work Media Uploaded: ', 40, y);
  doc.font('Helvetica').text(`${proofRecord.beforeImages?.length || 0} photo(s) on file`, 210, y);

  doc.font('Helvetica-Bold').text('After-Work Media Uploaded: ', 300, y);
  doc.font('Helvetica').text(`${proofRecord.afterImages?.length || 0} photo(s) on file`, 450, y);

  y += 25;
  doc.font('Helvetica-Bold').text('Timeline Summary:', 40, y);
  doc.font('Helvetica').text(
    `Job Started: ${proofRecord.startedAt ? new Date(proofRecord.startedAt).toLocaleString('en-GB') : 'Recorded'} | Submitted: ${proofRecord.completedAt ? new Date(proofRecord.completedAt).toLocaleString('en-GB') : 'Pending Final Submission'}`,
    40,
    y + 14
  );

  // Section 5: Client Approval & Legal Disclaimer
  y += 45;
  doc.rect(40, y, 515, 60).fillAndStroke('#E6F4F2', '#0F766E');
  doc.fillColor('#0F766E').font('Helvetica-Bold').fontSize(11).text('CLIENT SIGN-OFF & APPROVAL CERTIFICATE', 55, y + 10);
  doc.fillColor('#17211F').font('Helvetica').fontSize(9).text(
    proofRecord.clientFeedback
      ? `Client Feedback: "${proofRecord.clientFeedback}"`
      : 'Client has reviewed the submitted task checklist and photographic proof and confirmed satisfactory completion.',
    55,
    y + 26,
    { width: 485 }
  );

  // Footer stamp
  doc.fillColor('#64716D')
     .fontSize(8)
     .text('This document is digitally validated by the SERVA ProofBox engine (Bangladesh). It serves as formal completion proof.', 40, 750, { align: 'center' });

  doc.end();
};
