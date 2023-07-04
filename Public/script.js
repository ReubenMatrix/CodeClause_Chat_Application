(function() {
    const app = document.querySelector(".app");
    const socket = io();
  
    let uname;
  
    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length == 0) {
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

    
  
    app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message
      });
      socket.emit("chat", {
        username: uname,
        text: message
      });
  
      app.querySelector(".chat-screen #message-input").value = "";
    });


  
    function renderMessage(type, message) {
      let messagecontainer = app.querySelector(".chat-screen .messages");
      if (type == "my") {
        let el = document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = `
           <div>
              <div class="name">You</div>
              <div class="text">${message.text}</div>
           </div>
           <button type="button" class="delete-message btn btn-danger">Delete</button>`;
        messagecontainer.appendChild(el);
      } else if (type == "other") {
        let el = document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = `
           <div>
              <div class="name">${message.username}</div>
              <div class="text">${message.text}</div>
           </div>
           <button type="button" class="delete-message btn btn-danger">Delete</button>`;
        messagecontainer.appendChild(el);
  
      } else if (type == "update") {
        let el = document.createElement("div");
        el.setAttribute("class", "update");
        el.innerText = message;
        messagecontainer.appendChild(el);
      }
      messagecontainer.scrollTop = messagecontainer.scrollHeight - messagecontainer.clientHeight;
    }
  
    app.querySelector(".chat-screen #userexit").addEventListener("click", function() {
      socket.emit("exituser", uname);
      window.location.reload();
    });

    app.querySelector(".chat-screen .messages").addEventListener("click", function(event) {
      if (event.target.classList.contains("delete-message")) {
        const messageElement = event.target.closest(".message");
        if (messageElement) {
          messageElement.remove();
        }
      }
    });
  
    socket.on("update", function(update) {
      renderMessage("update", update);
    });
  
    socket.on("chat", function(message) {
      renderMessage("other", message);
    });

  })();
  