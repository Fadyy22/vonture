exports.acceptanceSubject = (application) => {
  `Congratulations! You've Been Accepted for the ${application.opportunity.title} Opportunity at ${application.opportunity.place.name}!`;
};

exports.acceptanceText = (application) => {
  `Dear ${application.tourist.first_name} ${application.tourist.last_name},

We are thrilled to inform you that you have been accepted into the ${application.opportunity.title} volunteering opportunity at ${application.opportunity.place.name} with Vonture.
      
We were very impressed with your application and believe that your skills and enthusiasm will be a valuable addition to our team. This opportunity will not only allow you to contribute meaningfully to the local community but also provide you with a unique and enriching experience.
      
Here are the details of your accepted opportunity:

Opportunity Name: ${application.opportunity.title}
Location: ${application.opportunity.place.name}
From: ${application.opportunity.from.toISOString().split('T')[0]}
To: ${application.opportunity.to.toISOString().split('T')[0]}

Please navigate to your applications section in your mobile app to complete the necessary steps to confirm your participation.

If you have any questions or need any assistance, feel free to contact us at ${process.env.EMAIL_USER}. We are here to help you make the most of this exciting journey.

Once again, congratulations on your acceptance! We look forward to seeing you soon and working together to make a positive impact.

Best regards,

Vonture
${process.env.EMAIL_USER}`;
};

exports.rejectionSubject = (application) => {
  `Update on Your Application for the ${application.opportunity.title} Opportunity at ${application.opportunity.place.name}`;
};

exports.rejectionText = (application) => {
  `Dear ${application.tourist.first_name} ${application.tourist.last_name},

Thank you for your interest in the ${application.opportunity.title} volunteering opportunity at ${application.opportunity.place.name} with Vonture.

We regret to inform you that after careful consideration by the host at ${application.opportunity.place.name}, it has been decided not to proceed with your application at this time. While we appreciate your enthusiasm and interest in our program, the host had to make difficult decisions based on their specific needs and requirements.

Please know that this decision does not reflect on your qualifications or passion for volunteering. We understand that this may be disappointing, but we encourage you to explore other volunteering opportunities with us or elsewhere that align with your interests and skills.

Your dedication to making a positive impact is commendable, and we hope you find a fulfilling experience elsewhere. If you have any questions or would like further feedback on your application, please don't hesitate to reach out to us at ${process.env.EMAIL_USER}.

Thank you for considering Vonture for your volunteering journey, and we wish you all the best in your future endeavors.

Best regards,

Vonture
${process.env.EMAIL_USER}`;
};
