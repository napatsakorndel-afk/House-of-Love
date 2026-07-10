// ==========================================
// KOI POND MINIGAMES LOGIC
// ==========================================

const koiLotusRef = db.ref('meeting/koiLotus');

function initKoiMinigames() {
    const scoopBtn = document.getElementById("scoopKoiBtn");
    const sendLotusBtn = document.getElementById("sendLotusBtn");
    const lotusInput = document.getElementById("lotusMessageInput");
    const closeScoopBtn = document.getElementById("closeScoopBtn");
    
    if(!scoopBtn) return;

    // Scoop Randomizer
    scoopBtn.addEventListener("click", () => {
        const overlay = document.getElementById("scoopNetOverlay");
        const net = document.getElementById("scoopNet");
        const popup = document.getElementById("scoopResultPopup");
        const nameEl = document.getElementById("scoopResultName");
        
        scoopBtn.disabled = true;
        popup.style.display = "none";
        overlay.style.display = "block";
        
        // Reset net position for animation
        net.style.transition = "none";
        net.style.transform = "translateX(-50%) rotate(-45deg) translateY(-200px)";
        
        // Trigger reflow
        net.offsetHeight;
        
        // Swoop down and up
        net.style.transition = "all 1s cubic-bezier(0.25, 0.1, 0.25, 1)";
        net.style.transform = "translateX(-50%) rotate(0deg) translateY(200px)";
        
        setTimeout(() => {
            net.style.transform = "translateX(-50%) rotate(45deg) translateY(-200px)";
            
            setTimeout(() => {
                overlay.style.display = "none";
                
                // Pick random member
                const members = getMembers();
                const winner = members[Math.floor(Math.random() * members.length)];
                
                nameEl.textContent = winner.name;
                popup.style.display = "block";
                
                scoopBtn.disabled = false;
            }, 1000);
        }, 1000);
    });
    
    closeScoopBtn.addEventListener("click", () => {
        document.getElementById("scoopResultPopup").style.display = "none";
    });

    // Lotus Minigame
    sendLotusBtn.addEventListener("click", sendLotus);
    lotusInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter") sendLotus();
    });
    
    function sendLotus() {
        const msg = lotusInput.value.trim();
        if(msg) {
            koiLotusRef.push({
                text: msg,
                timestamp: Date.now()
            });
            lotusInput.value = "";
        }
    }
    
    // Listen for incoming lotuses
    koiLotusRef.on('child_added', (snapshot) => {
        const data = snapshot.val();
        if(Date.now() - data.timestamp < 120000) {
            spawnLotus(data.text);
        }
    });
}

function spawnLotus(text) {
    const pond = document.getElementById("koiPondWater");
    if(!pond) return;
    
    const lotus = document.createElement("div");
    lotus.className = "lotus-flower";
    lotus.innerHTML = `🪷<div class="lotus-message">${text}</div>`;
    
    // Random starting position (mostly left side)
    const startY = Math.random() * 60 + 20; // 20% to 80%
    const startX = Math.random() * 20; // 0% to 20%
    
    lotus.style.top = startY + "%";
    lotus.style.left = startX + "%";
    
    // Randomize animation duration a bit
    const duration = 20 + Math.random() * 20; // 20-40s
    lotus.style.animation = `lotusFloat ${duration}s linear forwards`;
    
    pond.appendChild(lotus);
    
    setTimeout(() => {
        if(lotus.parentNode) lotus.parentNode.removeChild(lotus);
    }, duration * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    // Wait slightly to ensure elements exist
    setTimeout(initKoiMinigames, 500);
});
