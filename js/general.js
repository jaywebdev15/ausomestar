const header = document.querySelector('.nav-bar');
const menu = document.querySelector('.menu');
const list = document.querySelector('.nav-bar');
const textArea = document.querySelector(".comment");
const closed = document.querySelector(".close");
const fullname = document.querySelector(".fullname");
const contact = document.querySelector(".email");
const concern = document.querySelector(".comment");
const submit = document.querySelector(".submit");
const flashMessage = document.querySelector(".flashMessage");

document.addEventListener('scroll', () => {
	var scroll_position = window.scrollY;
	if (scroll_position > 70) {
		header.style.backgroundColor = '#cc9b25';
	} else {
		header.style.backgroundColor = 'transparent';
	}
});

menu.addEventListener('click', () => {
	list.classList.add("show");
	menu.classList.add("hide");
	closed.classList.add("show");
});

closed.addEventListener('click', () => {
	list.classList.remove("show");
	closed.classList.remove("show");
	menu.classList.remove("hide");
});

textArea.addEventListener('keyup', e => {
	textArea.style.height = "auto";
	let textAreaHeight = e.target.scrollHeight;
	textArea.style.height = `${textAreaHeight}px`;
});


submit.addEventListener("click", () => {
	if(fullname.value.length < 10) {
		message = "Full name should atleast 10 characters.";
		messageStatus = "failed";
	} else if(contact.value.length < 10) {
		message = "Contact should atleast 10 characters.";
		messageStatus = "failed";
	} else if (concern.value.length < 20) {
		message = "Comment and concern should atleast 20 characters.";
		messageStatus = "failed";
	} else {
		sendMessage("insert", fullname.value, contact.value, concern.value);
		messageStatus = "success";
	}
		flashMessage.innerText = message;
		flashMessage.classList.add(messageStatus);
		setTimeout(() => {
			flashMessage.classList.remove(messageStatus);
		}, 2000);
});


const sendMessage = async (action, fullname, contact, concern) => {
  try {
    const response = await fetch("http://localhost/ausomestar/backend/messages.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
        fullname: fullname,
        contact: contact,
        concern: concern
      })
    });

    const data = await response.json();

		flashMessage.innerText = data.message;

    if (data.status === "success") {

			document.querySelector(".fullname").value = "";
			document.querySelector(".email").value = "";
			document.querySelector(".comment").value = "";

    } else {

			flashMessage.classList.add("failed");
			setTimeout(() => {
				flashMessage.classList.remove("failed");
			}, 2000);

		}

  } catch (error) {
    console.error("Error in sending message =>", error);
  }
};