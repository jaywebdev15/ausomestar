const tableBody = document.querySelector(".table-body");
const tBody = document.querySelector(".tbody");
const modal = document.querySelector(".modal");
const searchInput = document.querySelector(".searchInput");
const api = "http://localhost/ausomestar/backend";


const truncateText = (text, maxLength = 100) => {
  if(text.maxLength <= maxLength) return text;

  let truncated = text.slice(0, maxLength);

  const lastSpace = truncated.lastIndexOf(' ');
  if(lastSpace > 0) {
    truncated = truncated.slice(0, lastSpace);
  }
  return truncated + '...';
}


searchInput.addEventListener("input", (e) => {
  searchMessage("search", e.target.value);
});


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
    const response = await fetch(`${api}/messages.php`);
    const data = await response.json();

    let html = "";

    data.forEach(message => {
      html += `
        <tr data-id="${message.id}"
            id="${message.id}">
          <td>${message.fullname}</td>
          <td class="cellContact">${message.contact}</td>
          <td class="cellConcern">${truncateText(message.concern)}</td>
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
    const response = await fetch(`${api}/messages.php`, {
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


const searchMessage = async (action, searchInput) => {
  try {
    const response = await fetch(`${api}/messages.php`, {
      method: "POST", 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action,
        searchInput: searchInput
      })
    });
    const data = await response.json();
  
    let html = "";
  
    data.forEach(message => {
      html += `
        <tr data-id="${message.id}">
          <td>${message.fullname}</td>
          <td class="cellContact">${message.contact}</td>
          <td class="cellConcern">${truncateText(message.concern)}</td>
        </tr>
      `;
    });
  
    tBody.innerHTML = html;
  } catch (error) {
    console.log("Error in searhing message =>", error);
  }
}


const deleteMessage = async (action, id) => {
  try {
    await fetch(`${api}/messages.php`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action,
        id: id
      })
    });
    fetchMessage();
  } catch (error) {
    console.log("Error in deleting message =>", error);
  }
}


fetchMessage();
