module.exports = {
  action_auto_mailer: false,
  sendBlueMailer: false,
  sendBlue: {
    fromEmail: "team@quodeck.com",
    name: "QuoDeck",
  },
  notifications: {
    fromEmail: "QuoDeck <team@quodeck.com>",
    emailTransporter: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "team@quodeck.com",
        pass: "quodeck@123",
      },
    },
    bookingConfirmation: {
      subject: "Booking Confirmation",
      body: `<!DOCTYPE html>
            <html>
            <head>
            <style>
            div {
              background-color: #f5f5f5;
              font-family: "Times New Roman", Times, serif;
              padding: 20px;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            ul li {
              margin-bottom: 10px;
            }
            </style>
            </head>
            <body>
            <div>
            <center>
            <h1>Booking Confirmation</h1>
            <p>Dear Guest,</p>
            <p>Thank you for your booking. Here are the details of your reservation:</p>
            <ul>
              <li><strong>Check-In Date:</strong> $checkInDate</li>
              <li><strong>Check-Out Date:</strong> $checkOutDate</li>
              <li><strong>Guest Count:</strong> $guestCount</li>
              <li><strong>Adults:</strong> $adults</li>
              <li><strong>Children:</strong> $children</li>
              <li><strong>Selected Meals:</strong> $selectedMeals</li>
              <li><strong>Room Category:</strong> $roomCategory</li>
              <li><strong>Room Description:</strong> $roomDescription</li>
              <li><strong>Facilities:</strong> $facilities</li>
              <li><strong>Total Price:</strong> ₹$calculatedPrice</li>
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>Best regards,</p>
            <p>Terrace Peaks</p>
            </center>
            </div>
            </body>
            </html>`,
    },
  },
};
