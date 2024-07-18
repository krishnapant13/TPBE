const bookingConfirmationMail = (bookingDetails, firstName) => {
  const {
    checkInDate,
    checkOutDate,
    guestCount,
    adults,
    children,
    calculatedPrice,
    meals,
    room,
  } = bookingDetails;

  // Format check-in and check-out dates
  const formattedCheckInDate = new Date(checkInDate).toLocaleDateString();
  const formattedCheckOutDate = new Date(checkOutDate).toLocaleDateString();

  // Calculate the duration of the stay
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const timeDifference = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
  const days = nights > 1 ? nights - 1 : 0; // Subtract 1 night to get the number of days

  // Determine the proper wording for day and night
  const durationText = `${
    days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : ""
  }${days > 0 && nights > 0 ? ", " : ""}${
    nights > 0 ? `${nights} ${nights === 1 ? "night" : "nights"}` : ""
  }`;

  // Filter selected meals
  const selectedMeals = Object.values(meals)
    .filter((meal) => meal.isChecked)
    .map((meal) => `${meal.name} (+ ₹${meal.price})`)
    .join(", ");

  // Construct the email content
  const message = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: "Times New Roman", Times, serif;
            }
            .container {
              background-color: #f5f5f5;
              padding: 20px;
            }
            .content {
              max-width: 600px;
              margin: auto;
              background: white;
              padding: 20px;
            }
            h1 {
              color: #333;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            ul li {
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>Booking Confirmation</h1>
              <p>Dear ${firstName},</p>
              <p>Thank you for your booking. Here are the details of your reservation:</p>
              <ul>
                <li><strong>Check-In Date:</strong> ${formattedCheckInDate}</li>
                <li><strong>Check-Out Date:</strong> ${formattedCheckOutDate}</li>
                <li><strong>Duration:</strong> ${durationText}</li>
                <li><strong>Guest Count:</strong> ${guestCount}</li>
                <li><strong>Adults:</strong> ${adults}</li>
                <li><strong>Children:</strong> ${children}</li>
                <li><strong>Selected Meals:</strong> ${selectedMeals}</li>
                <li><strong>Room Category:</strong> ${room.category}</li>
                <li><strong>Room Description:</strong> ${room.description}</li>
                <li><strong>Facilities:</strong> ${room.facility.join(
                  ", "
                )}</li>
                <li><strong>Total Price:</strong> ₹${calculatedPrice}</li>
              </ul>
              <p>We look forward to welcoming you!</p>
              <p>Best regards,</p>
              <p>Terrace Peaks</p>
              <div class="footer">
                <p>If you have any questions, feel free to contact us at +91 1234 567 890.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

  return message;
};

module.exports = bookingConfirmationMail;
