const tableBody = document.querySelector(".table-body");
const tBody = document.querySelector(".tbody");
const modal = document.querySelector(".modal");

tBody.addEventListener("click", (e) => {  
  const row = e.target.closest("tr");
  if (!row) return;
  const { id } = row.dataset;
  viewMessage(id, "view");
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("closeModal")) {
    modal.classList.remove("active");
    tableBody.classList.remove("inactive");
  }
});

const fetchMessage = async () => {
  try {
    const response = await fetch("http://localhost/ausomestar/backend/messages.php");
    const data = await response.json();

    let html = "";

    data.forEach(message => {
      html += `
        <tr data-id="${message.id}">
          <td>${message.fullname}</td>
          <td class="cellContact">${message.contact}</td>
          <td class="cellConcern">${message.concern}</td>
        </tr>
      `;
    });

    tBody.innerHTML = html;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const viewMessage = async (id, action) => {
  try {
    const response = await fetch("http://localhost/ausomestar/backend/messages.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        action: action
      })
    });

    const data = await response.json();

    modal.classList.add("active");
    tableBody.classList.add("inactive");

    modal.innerHTML = `
      <i class='bx bx-x closeModal'></i>
      <span>${data.fullname}</span>
      <span>${data.contact}</span>
      <div class="concern">
        <span>${data.concern}</span>
      </div>
    `;
  } catch (error) {
    console.error("Error in view fetching message =>", error);
  }
};


fetchMessage();
