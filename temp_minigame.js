// ==========================================
// MINIGAMES LOGIC
// ==========================================

const fireGoal = 500;
let localFireCount = 0;
const fireRef = db.ref('meeting/fireCount');
const skyMessagesRef = db.ref('meeting/skyMessages');

function initCampfireGame() {
    const clickBtn = document.getElementById("clickFireBtn");
    const container = document.getElementById("campfireContainer");
    
    if (!clickBtn || !container) return;

    // Listen to Firebase
    fireRef.on('value', (snapshot) => {
        localFireCount = snapshot.val() || 0;
        updateCampfireUI();
    });
    
    clickBtn.addEventListener('click', handleFireClick);
    container.addEventListener('click', handleFireClick);
}

function handleFireClick() {
    if (localFireCount < fireGoal) {
        fireRef.set(localFireCount + 1);
        
        // Local feedback for immediate response
        const flame = document.getElementById("campfireFlame");
        flame.classList.add("fire-active");
        setTimeout(() => flame.classList.remove("fire-active"), 100);
    }
}

function updateCampfireUI() {
    const fill = document.getElementById("fireFill");
    const text = document.getElementById("fireCountVal");
    const flame = document.getElementById("campfireFlame");
    const msg = document.getElementById("campfireSuccessMsg");
    
    if(!fill || !text || !flame) return;

    text.textContent = localFireCount;
    let pct = (localFireCount / fireGoal) * 100;
    if (pct > 100) pct = 100;
    fill.style.width = pct + "%";
    
    // Growth scale
    let scale = 1 + (pct / 100) * 1.5; // grows up to 2.5x
    flame.style.transform = `scale(${scale})`;
    
    if (localFireCount >= fireGoal) {
        msg.style.display = "block";
        flame.style.filter = "drop-shadow(0 0 30px #FFEB3B)";
    } else {
        msg.style.display = "none";
        flame.style.filter = "drop-shadow(0 0 10px #FF9800)";
    }
}

function initSkyMessages() {
    const btn = document.getElementById("sendSkyMsgBtn");
    const input = document.getElementById("skyMessageInput");
    
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
        const msg = input.value.trim();
        if (msg) {
            skyMessagesRef.push({
                text: msg,
                timestamp: Date.now()
            });
            input.value = "";
        }
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btn.click();
        }
    });
    
    // Listen for new messages
    skyMessagesRef.on('child_added', (snapshot) => {
        const data = snapshot.val();
        // Show bubble if it's less than 2 minutes old
        if (Date.now() - data.timestamp < 120000) {
            spawnFloatingBubble(data.text);
        }
    });
}

function spawnFloatingBubble(text) {
    const container = document.getElementById("floatingSkyContainer");
    if(!container) return;
    
    const bubble = document.createElement("div");
    bubble.className = "floating-bubble";
    bubble.textContent = text;
    
    // Random horizontal position (10% to 90%)
    const leftPos = Math.random() * 80 + 10;
    bubble.style.left = leftPos + "%";
    
    // Random color tint
    const tints = ["rgba(255,255,255,0.9)", "rgba(255,249,196,0.9)", "rgba(225,245,254,0.9)", "rgba(240,244,195,0.9)"];
    bubble.style.background = tints[Math.floor(Math.random() * tints.length)];
    
    container.appendChild(bubble);
    
    // Remove after animation (6 seconds)
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 6000);
}

function initRandomizer() {
    const btn = document.getElementById("randomizeStickBtn");
    const woodPile = document.getElementById("woodPile");
    const pickedStick = document.getElementById("pickedStick");
    const pickedName = document.getElementById("pickedStickName");
    const announce = document.getElementById("randomResultAnnounce");
    const announceName = document.getElementById("randomResultName");
    
    if(!btn || !woodPile) return;
    
    // Create sticks in pile
    const members = getMembers();
    woodPile.innerHTML = "";
    for (let i = 0; i < members.length; i++) {
        const stick = document.createElement("div");
        stick.className = "stick";
        // random position and slight rotation
        const left = Math.random() * 140; // 0 to 140px in a 150px container
        const rot = Math.random() * 40 - 20; // -20 to 20 deg
        stick.style.left = left + "px";
        stick.style.transform = `rotate(${rot}deg)`;
        stick.dataset.left = left;
        stick.dataset.rot = rot;
        woodPile.appendChild(stick);
    }
    
    btn.addEventListener('click', () => {
        // Disable button during animation
        btn.disabled = true;
        btn.style.opacity = "0.5";
        pickedStick.style.display = "none";
        announce.style.display = "none";
        
        // Shake all sticks
        const sticks = document.querySelectorAll(".wood-pile .stick");
        sticks.forEach(s => s.classList.add("shaking"));
        
        setTimeout(() => {
            sticks.forEach(s => s.classList.remove("shaking"));
            
            // Pick random member
            const randIdx = Math.floor(Math.random() * members.length);
            const winner = members[randIdx];
            
            // Show picked stick
            pickedName.textContent = winner.name;
            
            // Reset pull animation
            pickedStick.style.animation = 'none';
            pickedStick.offsetHeight; /* trigger reflow */
            pickedStick.style.animation = null; 
            pickedStick.style.display = "flex";
            
            setTimeout(() => {
                announceName.textContent = winner.name;
                announce.style.display = "block";
                btn.disabled = false;
                btn.style.opacity = "1";
            }, 1500);
            
        }, 1500); // Shake for 1.5s
    });
}
