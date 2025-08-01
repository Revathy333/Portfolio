function sendMail() {
    var params = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        message : document.getElementById("message").value,

    };

const serviceID = "service_uhtulac";
const templateID = "template_2r4huuv";

emailjs.send(serviceID, templateID, params)
  .then((res) => {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
    console.log(res);
    alert("Your Message sent Successfully");
  })
  .catch((err) => {
    console.error("Email sending failed", err);
    alert("Failed to send message");
  });
}