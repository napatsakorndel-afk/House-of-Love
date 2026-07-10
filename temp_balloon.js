
// ==========================================
// BALLOON POP MINIGAME LOGIC
// ==========================================
let localBalloonCount = 0;
const balloonGoal = 500;

function initBalloonGame() {
    const pumpBtn = document.getElementById("pumpBalloonBtn");
    const container = document.querySelector(".balloon-game-container");
    const balloonRef = db.ref('meeting/balloonCount');
    
    if (!pumpBtn || !container) return;
    
    // Listen to Firebase
    balloonRef.on('value', (snapshot) => {
        localBalloonCount = snapshot.val() || 0;
        updateBalloonUI();
    });
    
    const handlePump = () => {
        if (localBalloonCount < balloonGoal) {
            balloonRef.set(localBalloonCount + 1);
            
            // Local feedback
            const balloon = document.getElementById("coopBalloon");
            balloon.style.transform = `scale(${1 + (localBalloonCount/balloonGoal)*2.5}) translateY(-5px)`;
            setTimeout(() => {
                balloon.style.transform = `scale(${1 + (localBalloonCount/balloonGoal)*2.5})`;
            }, 100);
        }
    };
    
    pumpBtn.addEventListener('click', handlePump);
    container.addEventListener('click', handlePump);
}

function updateBalloonUI() {
    const fill = document.getElementById("balloonFill");
    const balloon = document.getElementById("coopBalloon");
    const msg = document.getElementById("balloonSuccessMsg");
    const pumpBtn = document.getElementById("pumpBalloonBtn");
    
    if(!fill || !balloon) return;

    let pct = (localBalloonCount / balloonGoal) * 100;
    if (pct > 100) pct = 100;
    fill.style.width = pct + "%";
    
    // Growth scale
    if (pct < 100) {
        let scale = 1 + (pct / 100) * 2.5; 
        balloon.style.transform = `scale(${scale})`;
        balloon.style.opacity = 1;
        msg.style.display = "none";
        pumpBtn.disabled = false;
        pumpBtn.innerHTML = "💨 ปั๊มลมลูกโป่ง!";
    } else {
        // Pop!
        balloon.style.opacity = 0;
        balloon.style.transform = "scale(0)";
        msg.style.display = "block";
        pumpBtn.disabled = true;
        pumpBtn.innerHTML = "🎉 ลูกโป่งแตกแล้ว!";
        createConfetti();
    }
}

function createConfetti() {
    const container = document.getElementById("confettiContainer");
    if (!container || container.innerHTML !== "") return;
    
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(confetti);
    }
}
