function uploadPDF() {
    var form = document.getElementById("uploadForm");
    var formData = new FormData(form);

    var emailDiv = document.getElementById("emailid");
    var email = emailDiv.textContent;
    console.log(email);
    formData.append("email", email);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }