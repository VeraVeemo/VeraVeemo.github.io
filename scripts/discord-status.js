<script>
  const socket = new WebSocket("wss://api.lanyard.rest/socket");

  const userId = "333585549837336577"; // Your Discord ID
  const statusMap = {
    online: "🟢 Online",
    idle: "🌙 Idle",
    dnd: "⛔ Do Not Disturb",
    offline: "⚫ Offline"
  };

  function updateStatus(data) {
    const presence = data.discord_status;
    const activities = data.activities;

    let display = `Discord: ${statusMap[presence] || "Unknown"}`;

    const game = activities.find(a => a.type === 0);
    const spotify = activities.find(a => a.type === 2);
    const customStatus = activities.find(a => a.type === 4);

    if (spotify && spotify.details) {
      display += `<br>🎧 Listening to <strong>${spotify.details}</strong>`;
    } else if (game && game.name) {
      display += `<br>🎮 Playing <strong>${game.name}</strong>`;
    } else if (customStatus && customStatus.state) {
      display += `<br>💬 ${customStatus.state}`;
    }

    document.getElementById("discord-status").innerHTML = display;
  }

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({
      op: 2,
      d: {
        subscribe_to_ids: [userId]
      }
    }));
  });

  socket.addEventListener("message", event => {
    const payload = JSON.parse(event.data);
    if (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE") {
      updateStatus(payload.d);
    }
  });
</script>
