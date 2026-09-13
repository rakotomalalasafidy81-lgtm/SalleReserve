const nodemailer = require('nodemailer');

// Transporteur Gmail. Nécessite EMAIL_USER et EMAIL_PASS (mot de passe
// d'application Gmail, pas le mot de passe normal du compte) en variables
// d'environnement. Si ces variables ne sont pas définies, l'envoi est
// simplement ignoré (le reste de l'application continue de fonctionner).
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    console.log('Email non envoyé (EMAIL_USER/EMAIL_PASS non configurés):', subject);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"SalleReserve" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    // On ne bloque jamais la réservation si l'email échoue
    console.error('Erreur lors de l\'envoi de l\'email:', error.message);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function sendReservationConfirmation(user, reservation) {
  await sendEmail({
    to: user.email,
    subject: 'Confirmation de votre réservation - SalleReserve',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Réservation confirmée</h2>
        <p>Bonjour ${user.name},</p>
        <p>Votre réservation a bien été enregistrée :</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; color: #64748b;">Salle</td><td style="padding: 8px 0; font-weight: bold;">${reservation.room.name} (${reservation.room.building})</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Date</td><td style="padding: 8px 0; font-weight: bold;">${formatDate(reservation.date)}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Horaire</td><td style="padding: 8px 0; font-weight: bold;">${reservation.startTime} - ${reservation.endTime}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Motif</td><td style="padding: 8px 0; font-weight: bold;">${reservation.purpose || '-'}</td></tr>
        </table>
        <p style="color: #64748b; font-size: 0.9em;">Vous pouvez retrouver et annuler cette réservation depuis "Mes Réservations" sur SalleReserve.</p>
      </div>
    `
  });
}

async function sendReservationCancellation(user, reservation) {
  await sendEmail({
    to: user.email,
    subject: 'Annulation de votre réservation - SalleReserve',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Réservation annulée</h2>
        <p>Bonjour ${user.name},</p>
        <p>Votre réservation suivante a bien été annulée :</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; color: #64748b;">Salle</td><td style="padding: 8px 0; font-weight: bold;">${reservation.room.name} (${reservation.room.building})</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Date</td><td style="padding: 8px 0; font-weight: bold;">${formatDate(reservation.date)}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Horaire</td><td style="padding: 8px 0; font-weight: bold;">${reservation.startTime} - ${reservation.endTime}</td></tr>
        </table>
      </div>
    `
  });
}

module.exports = { sendReservationConfirmation, sendReservationCancellation };
