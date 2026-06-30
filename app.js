// app.js - ตัวควบคุมหลักและตรรกะระบบสำหรับ House of Love

document.addEventListener("DOMContentLoaded", () => {
    // 1. INITIALIZE SYSTEM
    initStars();
    renderWindows();
    renderDashboard();
    renderAppointments();
    renderManageList();
    renderTrees();
    initPageNavigation();
    initAudioSynth();
    updateJourneyTracker();
    startMidnightResetChecker();
    updateBalconyTimeCycle();
    setInterval(updateBalconyTimeCycle, 60000);
    
    // ตั้งค่าฟอร์มต่างๆ
    document.getElementById("checkinForm").addEventListener("submit", handleCheckinSubmit);
    document.getElementById("newApptForm").addEventListener("submit", handleNewApptSubmit);
    document.getElementById("closeCheckinModalBtn").addEventListener("click", () => closeModal("checkinModal"));
    document.getElementById("closeReportModalBtn").addEventListener("click", () => closeModal("reportModal"));
    document.getElementById("closeReportFinishBtn").addEventListener("click", () => closeModal("reportModal"));
    document.getElementById("closeNewApptModalBtn").addEventListener("click", () => closeModal("newApptModal"));
    document.getElementById("openNewApptModalBtn").addEventListener("click", openNewApptModal);
    document.getElementById("clearDataBtn").addEventListener("click", handleClearLogs);
    document.getElementById("downloadReportCardBtn").addEventListener("click", handleDownloadCard);
    
    // ตั้งค่าปุ่มเคลียร์เช็กอินรายวัน
    const clearDailyBtnHome = document.getElementById("clearDailyBtn_home");
    const clearDailyBtnDash = document.getElementById("clearDailyBtn_dash");
    if (clearDailyBtnHome) clearDailyBtnHome.addEventListener("click", handleClearDailyCheckins);
    if (clearDailyBtnDash) clearDailyBtnDash.addEventListener("click", handleClearDailyCheckins);
    
    // ตั้งค่าบ่อปลาคราฟ
    document.getElementById("feedKoiBtn").addEventListener("click", () => dropKoiFood());

    // ตั้งค่าแท็บโมดอลเช็กอินและการควบคุมพลังงานด่วน
    document.getElementById("quickEnergyForm").addEventListener("submit", handleQuickEnergySubmit);
    document.getElementById("tabQuickEnergyBtn").addEventListener("click", () => switchCheckinTab("quick"));
    document.getElementById("tabDeepCounselingBtn").addEventListener("click", () => switchCheckinTab("deep"));
    const energyRange = document.getElementById("energyRange");
    if (energyRange) {
        energyRange.addEventListener("input", handleEnergySliderInput);
    }

    // ปุ่มขยายข้อมูลคู่มือ MBTI ส่วนตัว ในหน้าตรวจใจ
    const expandBtn = document.getElementById("mbtiExpandBtn");
    const expandContent = document.getElementById("mbtiExpandContent");
    if (expandBtn && expandContent) {
        expandBtn.addEventListener("click", () => {
            if (expandContent.style.display === "none") {
                expandContent.style.display = "block";
            } else {
                expandContent.style.display = "none";
            }
        });
    }

    // ตั้งค่าบอร์ดต้นไม้และโมดอลรดน้ำ
    document.getElementById("closeWateringModalBtn").addEventListener("click", () => closeModal("wateringModal"));
    document.getElementById("wateringForm").addEventListener("submit", handleWateringSubmit);
    document.getElementById("cheatGrowthBtn").addEventListener("click", handleCheatGrowth);

    // ตั้งค่าฟอร์ม Telegram Bot
    const telegramForm = document.getElementById("telegramSettingsForm");
    if (telegramForm) {
        document.getElementById("teleBotToken").value = telegramToken || "";
        document.getElementById("teleChatId").value = telegramChatId || "";
        document.getElementById("teleThreadId").value = telegramThreadId || "";
        
        telegramForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("🔒 การตั้งค่าระบบแจ้งเตือน Telegram ถูกล็อกการทำงานถาวรโดยผู้ดูแลระบบแล้วค๊า ไม่จำเป็นต้องกรอกหรือแก้ไขแล้วนะคะ");
        });
    }

    // ตั้งค่าฟอร์ม Cloud Database Settings
    const databaseForm = document.getElementById("databaseSettingsForm");
    if (databaseForm) {
        document.getElementById("dbBlobId").value = currentBlobId || "";
        
        databaseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const blobId = document.getElementById("dbBlobId").value.trim();
            if (!blobId) {
                alert("กรุณากรอก Database ID ก่อนนะคนดี");
                return;
            }
            
            localStorage.setItem("house_of_love_db_blob_id", blobId);
            currentBlobId = blobId;
            
            syncDatabase();
            alert("💾 บันทึกและเชื่อมโยงรหัสฐานข้อมูลคลาวด์เรียบร้อยแล้วค๊า! ระบบจะทำการซิงก์ข้อมูลทันที");
        });
        
        document.getElementById("recreateDbBtn").addEventListener("click", () => {
            if (confirm("ต้องการสร้างห้องฐานข้อมูลใหม่บนคลาวด์หรือไม่คะ?\n\nระบบจะคัดลอกข้อมูลปัจจุบันในเครื่องนี้ไปใส่ในฐานข้อมูลอันใหม่ให้ และอุปกรณ์เครื่องอื่นๆ ทุกเครื่องจะซิงก์รหัสห้องใหม่นี้ให้อัตโนมัติในทันทีโดยไม่ต้องส่งลิงก์แชร์ค่ะ")) {
                recreateCloudDatabase();
            }
        });
    }

    // ฟังก์ชันช่วยอัปเดตสถานะซิงก์คลาวด์บนหน้าเว็บ
    const updateSyncStatusUI = (status, time) => {
        const statusSpan = document.getElementById("dbSyncStatus");
        if (statusSpan) {
            if (status === "online") {
                const timeStr = time ? new Date(time).toLocaleTimeString() : new Date().toLocaleTimeString();
                statusSpan.textContent = "สถานะ: 🟢 เชื่อมต่อคลาวด์เรียบร้อย (ซิงก์ล่าสุด: " + timeStr + ")";
                statusSpan.style.color = "#2E7D32";
            } else if (status === "offline") {
                statusSpan.textContent = "สถานะ: 🔴 ตรวจพบข้อผิดพลาด / ฐานข้อมูลหมดอายุ (404)";
                statusSpan.style.color = "#C62828";
            } else {
                statusSpan.textContent = "สถานะ: 🟡 กำลังตรวจสอบ...";
                statusSpan.style.color = "var(--color-brown-light)";
            }
        }
    };

    // แสดงสถานะเริ่มต้นทันทีที่โหลดหน้าเว็บ (แก้ปัญหาดักจับอีเวนต์แรกไม่ทัน)
    if (typeof lastSyncStatus !== "undefined") {
        updateSyncStatusUI(lastSyncStatus.status, lastSyncStatus.time);
    }

    // ฟังสถานะซิงก์คลาวด์เพื่อแสดงข้อความเตือน/สถานะเชื่อมต่อ
    window.addEventListener("db-sync-status", (e) => {
        updateSyncStatusUI(e.detail.status, Date.now());
    });

    // ฟังเหตุการณ์การซิงก์ฐานข้อมูลคลาวด์เพื่ออัปเดต UI แบบเรียลไทม์
    window.addEventListener("db-synced", () => {
        renderWindows();
        renderDashboard();
        renderAppointments();
        renderManageList();
        renderTrees();
        
        // อัปเดตอินพุตตั้งค่า Telegram เมื่อมีการซิงก์คลาวด์ข้ามเครื่อง
        const tokenInput = document.getElementById("teleBotToken");
        const chatIdInput = document.getElementById("teleChatId");
        const threadIdInput = document.getElementById("teleThreadId");
        if (tokenInput) tokenInput.value = telegramToken || "";
        if (chatIdInput) chatIdInput.value = telegramChatId || "";
        if (threadIdInput) threadIdInput.value = telegramThreadId || "";

        // อัปเดตอินพุตตั้งค่า Database
        const dbBlobInput = document.getElementById("dbBlobId");
        if (dbBlobInput) dbBlobInput.value = currentBlobId || "";
    });
});

// 2. BACKGROUND STARFIELD GENERATOR
function initStars() {
    const container = document.getElementById("starsContainer");
    if (!container) return;
    container.innerHTML = "";
    
    const starCount = 40;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        
        // สุ่มขนาดและตำแหน่ง
        const size = Math.random() * 3 + 1;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${top}%`;
        star.style.left = `${left}%`;
        star.style.animationDelay = `${delay}s`;
        
        container.appendChild(star);
    }
}

// 3. PAGE NAVIGATION SYSTEM (Single Page App Router)
function initPageNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetPageId = btn.getAttribute("data-page");
            
            // สลับสถานะ Active ของปุ่มเมนู
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // สลับหน้าเพจหลัก
            const sections = document.querySelectorAll(".page-section");
            sections.forEach(section => {
                if (section.id === targetPageId) {
                    section.classList.add("active");
                    // อัปเดตข้อมูลแดชบอร์ดเสมอเมื่อเปิดเข้าหน้า
                    if (targetPageId === "dashboard-page") {
                        renderDashboard();
                    } else if (targetPageId === "appointments-page") {
                        renderAppointments();
                    } else if (targetPageId === "koi-page") {
                        isKoiPondActive = true;
                        initKoiPond();
                    } else if (targetPageId === "trees-page") {
                        renderTrees();
                        updateBalconyTimeCycle();
                    }
                } else {
                    section.classList.remove("active");
                    // หยุดการทำงานของบ่อปลาคราฟเพื่อประหยัดพลังงานเมื่อไม่อยู่ในหน้า
                    if (section.id === "koi-page") {
                        isKoiPondActive = false;
                        if (koiAnimationId) {
                            cancelAnimationFrame(koiAnimationId);
                            koiAnimationId = null;
                        }
                    }
                }
            });
        });
    });
}

// 4. RENDER HOME SCREEN - 16 WOODEN WINDOWS
function renderWindows() {
    const grid = document.getElementById("windowsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    const members = getMembers();
    
    members.forEach(member => {
        const windowContainer = document.createElement("div");
        windowContainer.className = "window-container";
        
        // ดึงพลังงานประจำวัน (เช็กอินวันนี้เท่านั้น)
        const dailyEnergy = getMemberDailyEnergy(member.id);
        const hasEvaluatedToday = dailyEnergy !== null;
        
        let energyHtml = '';
        if (hasEvaluatedToday) {
            const avg = dailyEnergy.avgScore;
            let energyColor = 'linear-gradient(90deg, #FF85A2, #FFB3C6)';
            if (avg >= 80) energyColor = 'linear-gradient(90deg, #4CAF50, #81C784)';
            else if (avg >= 55) energyColor = 'linear-gradient(90deg, #FFA726, #FFB74D)';
            else if (avg >= 35) energyColor = 'linear-gradient(90deg, #FF7043, #FF8A65)';
            else energyColor = 'linear-gradient(90deg, #EF5350, #E57373)';

            energyHtml = `
                <div class="window-energy-bar-wrapper">
                    <div class="window-energy-bar-bg">
                        <div class="window-energy-bar" style="width: ${avg}%; background: ${energyColor};"></div>
                    </div>
                    <span class="window-energy-text">${avg}%</span>
                </div>
            `;
        } else {
            energyHtml = `
                <div class="window-energy-bar-wrapper sleeping">
                    <div class="window-energy-bar-bg">
                        <div class="window-energy-bar" style="width: 0%;"></div>
                    </div>
                    <span class="window-energy-text">💤 พักผ่อน</span>
                </div>
            `;
        }
        
        windowContainer.innerHTML = `
            <div class="window-frame ${hasEvaluatedToday ? 'open glowing' : ''}" id="winFrame_${member.id}">
                <!-- หน้าต่างไม้บานซ้าย -->
                <div class="window-leaf window-leaf-left"></div>
                <!-- หน้าต่างไม้บานขวา -->
                <div class="window-leaf window-leaf-right"></div>
                
                <!-- ช่องในบ้านเมื่อหน้าต่างเปิดออก -->
                <div class="window-inner">
                    <div class="window-avatar" style="background-color: ${member.avatarColor}; color: ${member.textColor};">
                        ${member.name.charAt(0)}
                    </div>
                    <div class="window-name">${member.name}</div>
                    <div class="window-role">${member.role.replace("คณะกรรมการนักศึกษา", "")}</div>
                </div>
                
                <!-- ป้ายชื่อหน้าต่างปิด -->
                <div class="window-nametag">${member.name}</div>
            </div>
            ${energyHtml}
        `;
        
        // คลิกหน้าต่างเพื่อประเมิน
        windowContainer.addEventListener("click", () => {
            openCheckinModal(member.id);
        });
        
        grid.appendChild(windowContainer);
    });
}

// 5. CHECK-IN FLOW (แบบประเมินสุขภาพจิต)
function openCheckinModal(memberId) {
    const members = getMembers();
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    document.getElementById("checkinMemberId").value = memberId;
    
    // ใส่ข้อมูลหัวข้อและของจำต้องมี (Must-Have)
    const header = document.getElementById("checkinProfileHeader");
    header.innerHTML = `
        <div class="modal-profile-avatar" style="background-color: ${member.avatarColor}; color: ${member.textColor};">
            ${member.name.charAt(0)}
        </div>
        <div class="modal-profile-info">
            <h3>${member.name} <span class="mbti-tag">${member.mbti}</span></h3>
            <p>${member.role} | ฝ่าย${member.dept}</p>
            <p style="font-size: 11px; margin-top: 3px; color: var(--color-brown-wood);">💼 ของรักของต้องมี: ${member.items.join(" | ")}</p>
        </div>
    `;
    
    // ปรับเปลี่ยนข้อความต้อนรับให้มีความอ่อนโยนตามประวัติสุขภาพจิตของเขา
    const logs = getLogs().filter(log => log.memberId === memberId);
    const welcome = document.getElementById("counselorWelcomeMsg");
    if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        welcome.innerHTML = `สวัสดีค่ะ <b>${member.name}</b> คนเก่ง ดีใจจังเลยที่ได้เจอเธออีกครั้งนะ... ครั้งล่าสุดสภาพอากาศของเธอคือ <b>"${lastLog.moodEmoji} ${lastLog.moodState}"</b> วันนี้หัวใจเธอได้รับกำลังใจดีขึ้นบ้างไหมคะ? ลองเล่าให้ฉันฟังได้ทุกเรื่องเลยนะค๊า`;
    } else {
        welcome.innerHTML = `สวัสดีค่ะ <b>${member.name}</b> ยินดีต้อนรับเข้าสู่พื้นที่อุ่นใจของพวกเรานะคะ วันนี้หน้างานเป็นอย่างไรบ้าง เหนื่อยล้าตรงไหน หรือมีเรื่องสุขใจเรื่องใดไหมเอ่ย มาทำแบบประเมินและระบายข้อความกับฉันน๊า...`;
    }
    
    // เคลียร์ฟอร์ม
    document.getElementById("ventingText").value = "";
    document.getElementById("isAnonymous").checked = false;
    document.getElementById("mbtiExpandContent").style.display = "none";

    // รีเซ็ตแท็บโมดอลเช็กอินเป็นพลังงานด่วน และตั้งค่าเริ่มต้นสไลเดอร์
    switchCheckinTab("quick");
    const slider = document.getElementById("energyRange");
    if (slider) {
        slider.value = 70;
        updateEnergySliderUI(70);
    }

    // ใส่ข้อมูลสไตล์ MBTI สำหรับขยายดูส่วนตัว
    const mbtiProfile = MBTI_PROFILES[member.mbti];
    if (mbtiProfile) {
        document.getElementById("mbtiWorkStyle").textContent = mbtiProfile.workStyle || "-";
        document.getElementById("mbtiCommStyle").textContent = mbtiProfile.communication || "-";
    }
    
    // ตั้งวิทยุไว้ที่ตรงกลาง (คะแนน 3)
    const radios = document.querySelectorAll("#checkinForm input[type='radio']");
    radios.forEach(radio => {
        if (radio.value === "3") {
            radio.checked = true;
        }
    });
    
    openModal("checkinModal");
}

function handleCheckinSubmit(e) {
    e.preventDefault();
    
    const memberId = document.getElementById("checkinMemberId").value;
    const ventingText = document.getElementById("ventingText").value.trim();
    const isAnonymous = document.getElementById("isAnonymous").checked;
    
    // ดึงคะแนนคำถามทั้ง 5 ข้อ
    const q1 = document.querySelector('input[name="q1"]:checked').value;
    const q2 = document.querySelector('input[name="q2"]:checked').value;
    const q3 = document.querySelector('input[name="q3"]:checked').value;
    const q4 = document.querySelector('input[name="q4"]:checked').value;
    const q5 = document.querySelector('input[name="q5"]:checked').value;
    
    const answers = [q1, q2, q3, q4, q5];
    
    // บันทึกลงฐานข้อมูล localStorage
    const result = saveLog(memberId, answers, ventingText, isAnonymous);
    
    // แสดงโมดอลผลลัพธ์คำปรึกษา
    closeModal("checkinModal");
    showReportModal(result.log, result.report);
    
    // อัปเดตการแสดงผลหน้าหลัก (เปิดหน้าต่างไม้)
    renderWindows();
    
    // เล่นเสียงระฆังฮีลใจสำเร็จ
    playSynthChime();
}

function switchCheckinTab(tabType) {
    const quickBtn = document.getElementById("tabQuickEnergyBtn");
    const deepBtn = document.getElementById("tabDeepCounselingBtn");
    const quickContent = document.getElementById("quickEnergyTabContent");
    const deepContent = document.getElementById("deepCounselingTabContent");
    
    if (!quickBtn || !deepBtn || !quickContent || !deepContent) return;
    
    if (tabType === "quick") {
        quickBtn.classList.add("active");
        deepBtn.classList.remove("active");
        quickContent.style.display = "block";
        deepContent.style.display = "none";
    } else {
        deepBtn.classList.add("active");
        quickBtn.classList.remove("active");
        deepContent.style.display = "block";
        quickContent.style.display = "none";
    }
}

function handleEnergySliderInput() {
    const slider = document.getElementById("energyRange");
    if (!slider) return;
    updateEnergySliderUI(parseInt(slider.value, 10));
}

function updateEnergySliderUI(val) {
    const percentTxt = document.getElementById("energySliderVal");
    const emojiTxt = document.getElementById("energySliderEmoji");
    
    if (percentTxt) percentTxt.textContent = `${val}%`;
    
    if (emojiTxt) {
        if (val >= 90) {
            emojiTxt.textContent = "🌈";
        } else if (val >= 70) {
            emojiTxt.textContent = "☀️";
        } else if (val >= 40) {
            emojiTxt.textContent = "🌧️";
        } else {
            emojiTxt.textContent = "⚡🌧️";
        }
    }
}

function handleQuickEnergySubmit(e) {
    e.preventDefault();
    
    const memberId = document.getElementById("checkinMemberId").value;
    const energyVal = parseInt(document.getElementById("energyRange").value, 10);
    
    saveQuickEnergyLog(memberId, energyVal);
    
    // ปิดโมดอลเช็กอิน
    closeModal("checkinModal");
    
    // อัปเดตหน้าต่างและแดชบอร์ด
    renderWindows();
    renderDashboard();
    
    // เล่นเสียงสำเร็จ
    playSynthChime();
    
    alert("บันทึกระดับพลังงานวันนี้เรียบร้อยแล้วค่ะคนเก่ง! วันนี้สู้ๆ นะค๊า 🌟");
}

// 6. SHOW COUNSELING REPORT (ผลประเมินและคำปรึกษา)
// บันทึกตัวแปรรายงานล่าสุดเพื่อการดาวน์โหลด
let currentReportData = null;

function showReportModal(log, report) {
    currentReportData = { log, report };
    
    document.getElementById("reportTitle").textContent = report.title;
    
    const members = getMembers();
    const member = members.find(m => m.id === log.memberId);
    const ownerName = log.isAnonymous ? "สมาชิกนิรนาม" : member.name;
    document.getElementById("reportOwnerText").textContent = `บันทึกของ ${ownerName} | ฝ่าย${log.memberDept}`;
    
    // ตั้งค่า MBTI Self Guide ในผลการประเมิน
    const mbtiTag = document.getElementById("reportMbtiTag");
    const mbtiWork = document.getElementById("reportMbtiWork");
    const mbtiComm = document.getElementById("reportMbtiComm");
    const mbtiBlock = document.querySelector(".advice-block.mbti-block");
    
    if (mbtiTag && member) {
        if (log.isAnonymous) {
            if (mbtiBlock) mbtiBlock.style.display = "none";
        } else {
            if (mbtiBlock) mbtiBlock.style.display = "block";
            mbtiTag.textContent = member.mbti;
            const mbtiProfile = MBTI_PROFILES[member.mbti];
            if (mbtiProfile) {
                mbtiWork.textContent = mbtiProfile.workStyle || "-";
                mbtiComm.textContent = mbtiProfile.communication || "-";
            }
        }
    }
    
    // ตั้งค่ากราฟคะแนน
    document.getElementById("reportHeartBar").style.width = `${report.heartIndex}%`;
    document.getElementById("reportHeartText").textContent = `${report.heartIndex}%`;
    document.getElementById("reportFireBar").style.width = `${report.fireIndex}%`;
    document.getElementById("reportFireText").textContent = `${report.fireIndex}%`;
    
    // ตั้งข้อความตอบรับ
    document.getElementById("reportComfortText").textContent = report.comfort;
    document.getElementById("reportAdviceText").textContent = report.advice;
    document.getElementById("reportActionText").textContent = report.action;
    
    // จัดการตรวจจับความรู้สึกและอารมณ์จากข้อความระบายความในใจ
    const kwBlock = document.getElementById("reportKeywordBlock");
    const emotionBadge = document.getElementById("reportDetectedEmotion");
    const kwTextContainer = document.getElementById("reportKeywordsText");
    
    if (log.ventingText && log.ventingText.trim() !== "") {
        if (kwBlock) kwBlock.style.display = "block";
        if (emotionBadge) {
            emotionBadge.textContent = report.detectedEmotion || "ทั่วไป / กลางๆ ☀️";
            emotionBadge.style.backgroundColor = report.detectedEmotionColor || "#90A4AE";
        }
        if (kwTextContainer) {
            kwTextContainer.textContent = report.storyCounsel || "";
        }
    } else {
        if (kwBlock) kwBlock.style.display = "none";
    }
    
    openModal("reportModal");
}

// 7. DOWNLOAD HEALING CARD (สร้างการ์ดฮีลใจเป็นภาพ PNG)
function handleDownloadCard() {
    if (!currentReportData) return;
    
    const { log, report } = currentReportData;
    const members = getMembers();
    const member = members.find(m => m.id === log.memberId);
    const ownerName = log.isAnonymous ? "สมาชิก กน. นามแฝง" : member.name;
    
    // สร้าง Canvas เพื่อใช้วาดภาพการ์ดบำบัด
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    
    // 1. วาดพื้นหลังกระดาษพาสเทลชมพูครีม
    const grad = ctx.createLinearGradient(0, 0, 0, 700);
    grad.addColorStop(0, "#FFFDF8");
    grad.addColorStop(1, "#FFEBEE");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 700);
    
    // ขอบการ์ดสองชั้นดีไซน์สุดน่ารัก
    ctx.strokeStyle = "#FBC4D2";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 490, 690);
    ctx.strokeStyle = "#8D5B4C";
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 470, 670);
    
    // 2. วาดหัวข้อหัวใจดนตรี
    ctx.fillStyle = "#FF5E85";
    ctx.font = "bold 24px 'Mali', Arial";
    ctx.textAlign = "center";
    ctx.fillText("❤️ การ์ดชาร์จพลังใจ ❤️", 250, 60);
    
    // วาดสายห้อยป้ายหรือดอกไม้
    ctx.fillStyle = "#8D5B4C";
    ctx.font = "14px 'Mali', Arial";
    ctx.fillText("House of Love - บ้านนี้มีรัก", 250, 85);
    
    // 3. ข้อมูลเจ้าของการ์ด
    ctx.fillStyle = "#5C3A21";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`บันทึกตรวจใจของ: ${ownerName}`, 250, 130);
    ctx.font = "14px Arial";
    const mbtiText = log.isAnonymous ? "" : ` | MBTI: ${member ? member.mbti : "-"}`;
    ctx.fillText(`ฝ่ายสังกัด: ${log.memberDept}${mbtiText} | วันที่ประเมิน: ${new Date(log.timestamp).toLocaleDateString("th-TH")}`, 250, 155);
    
    // 4. สภาพอากาศสุขภาพจิต
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#8D5B4C";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(50, 180, 400, 70, 10) : ctx.rect(50, 180, 400, 70);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = "#8D5B4C";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "left";
    ctx.fillText("สภาพอากาศของหัวใจวันนี้:", 70, 205);
    ctx.fillStyle = "#E91E63";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`${log.moodEmoji} ${log.moodState}`, 70, 230);
    
    // วาดป้ายความรู้สึกที่ตรวจจับได้จากเรื่องราวระบายใจ (ถ้ามี)
    if (log.ventingText && log.ventingText.trim() !== "" && report.detectedEmotion) {
        ctx.fillStyle = "#8D5B4C";
        ctx.font = "bold 13px Arial";
        ctx.fillText("ความรู้สึกจากเรื่องราว:", 270, 205);
        
        ctx.fillStyle = report.detectedEmotionColor || "#90A4AE";
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(270, 212, 160, 24, 6) : ctx.rect(270, 212, 160, 24);
        ctx.fill();
        
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(report.detectedEmotion, 350, 228);
        ctx.textAlign = "left"; // คืนค่า textAlign
    }
    
    // 5. แถบดัชนีคะแนน
    ctx.fillStyle = "#5C3A21";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    
    // ดัชนีใจ (Heart Index)
    ctx.fillText(`ดัชนีพลังใจ (Heart Index): ${report.heartIndex}%`, 50, 285);
    ctx.fillStyle = "#EAEAEA";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(50, 295, 400, 15, 7) : ctx.rect(50, 295, 400, 15);
    ctx.fill();
    ctx.fillStyle = "#FF85A2";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(50, 295, 400 * (report.heartIndex / 100), 15, 7) : ctx.rect(50, 295, 400 * (report.heartIndex / 100), 15);
    ctx.fill();
    
    // ดัชนีไฟ (Fire Index)
    ctx.fillStyle = "#5C3A21";
    ctx.fillText(`ดัชนีไฟทำงาน (Fire Index): ${report.fireIndex}%`, 50, 345);
    ctx.fillStyle = "#EAEAEA";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(50, 355, 400, 15, 7) : ctx.rect(50, 355, 400, 15);
    ctx.fill();
    ctx.fillStyle = "#FF7B54";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(50, 355, 400 * (report.fireIndex / 100), 15, 7) : ctx.rect(50, 355, 400 * (report.fireIndex / 100), 15);
    ctx.fill();
    
    // 6. ข้อความปลอบโยน
    ctx.fillStyle = "#5C3A21";
    ctx.font = "bold 15px Arial";
    ctx.fillText("คำปลอบโยนจากบ้านแสนรัก:", 50, 410);
    
    ctx.font = "italic 13px Arial";
    ctx.fillStyle = "#4E342E";
    wrapText(ctx, report.comfort, 50, 435, 400, 20);
    
    // 7. คำแนะนำสั้นๆ (เปลี่ยนเป็นคำแนะนำตามเรื่องราวระบายใจถ้ามี)
    ctx.fillStyle = "#5C3A21";
    ctx.font = "bold 15px Arial";
    
    let adviceToDraw = report.advice;
    let labelToDraw = "แนวทางส่องสว่างนำใจ:";
    let colorToDraw = "#1B5E20";
    
    if (log.ventingText && log.ventingText.trim() !== "") {
        adviceToDraw = report.storyCounsel || report.advice;
        labelToDraw = "คำแนะนำจากเรื่องราวระบายใจ:";
        colorToDraw = "#C2185B"; // ใช้สีแดงอมชมพูเข้มเพื่อให้สวยงามเด่นชัด
    }
    
    ctx.fillText(labelToDraw, 50, 530);
    ctx.fillStyle = colorToDraw;
    if (log.ventingText && log.ventingText.trim() !== "") {
        ctx.font = "12.5px Arial";
        wrapText(ctx, adviceToDraw, 50, 555, 400, 18, 48, 5);
    } else {
        ctx.font = "13px Arial";
        wrapText(ctx, adviceToDraw, 50, 555, 400, 20, 33, 4);
    }
    
    // ข้อความปิดท้ายฮีลใจสุดซึ้ง
    ctx.fillStyle = "#FF85A2";
    ctx.font = "bold 14px 'Mali', Arial";
    ctx.textAlign = "center";
    ctx.fillText("“บ้านหลังนี้ รักเธอเสมอ และพร้อมโอบกอดเสมอนะคะ”", 250, 650);
    
    // สร้างลิ้งค์ดาวน์โหลดภาพ
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `healing-card-${ownerName}.png`;
    link.href = dataURL;
    link.click();
}

function wrapText(context, text, x, y, maxWidth, lineHeight, charsPerLine = 33, maxLines = 4) {
    let tempText = text;
    let lines = [];
    while (tempText.length > 0) {
        lines.push(tempText.substring(0, charsPerLine));
        tempText = tempText.substring(charsPerLine);
    }
    for (let n = 0; n < lines.length && n < maxLines; n++) {
        context.fillText(lines[n], x, y + (n * lineHeight));
    }
}

// 8. RENDER TEAM DASHBOARD (คำนวณสถิติและภาพรวม)
function renderDashboard() {
    const logs = getLogs();
    
    // ค่าเฉลี่ยเริ่มต้น
    let avgHeart = 0;
    let avgFire = 0;
    let weatherEmoji = "☀️";
    let weatherText = "บ้านยังไม่มีข้อมูลการตรวจใจเลยคนเก่ง มาเป็นคนแรกกันนะค๊า";
    
    if (logs.length > 0) {
        const totalLogs = logs.length;
        const sumHeart = logs.reduce((sum, item) => sum + item.heartIndex, 0);
        const sumFire = logs.reduce((sum, item) => sum + item.fireIndex, 0);
        
        avgHeart = Math.round(sumHeart / totalLogs);
        avgFire = Math.round(sumFire / totalLogs);
        
        const overallScore = (avgHeart + avgFire) / 2;
        
        if (overallScore >= 80) {
            weatherEmoji = "🌈";
            weatherText = "วันนี้บ้านเราท้องฟ้าแจ่มใสมากกกก หัวใจเต็มสิบพร้อมลุยด้วยความสุขค๊าาา";
        } else if (overallScore >= 55) {
            weatherEmoji = "☀️";
            weatherText = "ท้องฟ้าสดใส แดดส่องอบอุ่นหัวใจ สมาชิกอยู่ในเกณฑ์พลังงานสมดุลค่ะ";
        } else if (overallScore >= 35) {
            weatherEmoji = "🌧️";
            weatherText = "เริ่มมีพายุเมฆครึ้มและฝนปรอยๆ มีสมาชิกบางคนแอบล้า อย่าลืมดูแลใจกันนะ";
        } else {
            weatherEmoji = "⚡🌧️";
            weatherText = "พายุฟ้าผ่าซัดหนัก! กองไฟเกือบมอด มาช่วยกันกอดและแบ่งเบาภาระงานกันด่วนที่สุดนะคะ!";
        }
    }
    
    // อัปเดตสเกลกองไฟ
    const flame = document.getElementById("campfireFlame");
    if (flame) {
        const scaleVal = 0.2 + 1.1 * (avgFire / 100);
        flame.style.transform = `scale(${scaleVal})`;
    }
    
    const teamFireIndexText = document.getElementById("teamFireIndexText");
    if (teamFireIndexText) teamFireIndexText.textContent = `${avgFire}%`;
    
    const weatherVisual = document.getElementById("teamWeatherVisual");
    if (weatherVisual) weatherVisual.innerHTML = `<div class="weather-emoji">${weatherEmoji}</div>`;
    
    const teamWeatherText = document.getElementById("teamWeatherText");
    if (teamWeatherText) teamWeatherText.textContent = weatherText;
    
    const heartCircle = document.getElementById("heartIndexProgress");
    if (heartCircle) {
        heartCircle.style.setProperty("--percent", avgHeart);
        document.getElementById("teamHeartIndexVal").textContent = `${avgHeart}%`;
    }
    
    const fireCircle = document.getElementById("fireIndexProgress");
    if (fireCircle) {
        fireCircle.style.setProperty("--percent", avgFire);
        document.getElementById("teamFireIndexVal").textContent = `${avgFire}%`;
    }
    
    renderCorkboard();
    renderDeptCharts();
    renderMbtiGuide();
}

function renderCorkboard() {
    const container = document.getElementById("corkboardContainer");
    if (!container) return;
    container.innerHTML = "";
    
    const logs = getLogs();
    const ventLogs = logs.filter(log => log.ventingText && log.ventingText.length > 0);
    
    if (ventLogs.length === 0) {
        container.innerHTML = `<div class="glass-card" style="grid-column: 1 / -1; text-align: center; color: var(--color-brown-light); padding: 30px;">
            📭 บอร์ดยังโล่งอยู่เลยค่ะ สมาชิกสามารถตรวจใจและเขียนระบายเพื่อนำมาแปะตรงนี้ได้นะ
        </div>`;
        return;
    }
    
    const reversedLogs = [...ventLogs].reverse();
    reversedLogs.forEach((log, index) => {
        const postIt = document.createElement("div");
        const colorNum = (index % 5) + 1;
        const rotateVal = (Math.random() * 6 - 3).toFixed(1);
        
        postIt.className = `post-it color-${colorNum}`;
        postIt.style.setProperty("--rotation", `${rotateVal}deg`);
        
        const heartCountKey = `hearts_${log.id}`;
        let hearts = localStorage.getItem(heartCountKey) || 0;
        
        postIt.innerHTML = `
            <div class="post-it-text">"${log.ventingText}"</div>
            <div class="post-it-footer">
                <div class="post-it-author">${log.moodEmoji} ${log.memberName} (${log.memberDept})</div>
                <button class="post-it-love-btn" onclick="sendLoveToPostit(event, '${log.id}')">
                    ❤️ <span id="heartCount_${log.id}">${hearts}</span>
                </button>
            </div>
        `;
        
        container.appendChild(postIt);
    });
}

function sendLoveToPostit(event, logId) {
    event.stopPropagation();
    
    const heartCountKey = `hearts_${logId}`;
    let hearts = parseInt(localStorage.getItem(heartCountKey) || "0", 10);
    hearts += 1;
    localStorage.setItem(heartCountKey, hearts);
    
    const txt = document.getElementById(`heartCount_${logId}`);
    if (txt) txt.textContent = hearts;
    
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    const floatingHeart = document.createElement("div");
    floatingHeart.className = "floating-heart";
    floatingHeart.textContent = "❤️";
    floatingHeart.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    floatingHeart.style.top = `${rect.top + window.scrollY - 10}px`;
    
    document.body.appendChild(floatingHeart);
    
    playSynthBeep();
    
    setTimeout(() => {
        floatingHeart.remove();
    }, 1000);
}

function handleClearLogs() {
    if (confirm("ต้องการเคลียร์ประวัติผลลัพธ์และสถิติการตรวจใจทั้งหมดในบ้านนี้จริงๆ หรอคะคนเก่ง?")) {
        clearLogs();
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("hearts_")) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        
        renderWindows();
        renderDashboard();
        alert("ล้างบันทึกการตรวจใจเรียบร้อยแล้วค่ะ สดใสเหมือนหน้าใหม่อีกครั้งนะค๊า ✨");
    }
}

function handleClearDailyCheckins() {
    if (confirm("ต้องการเคลียร์การแสดงผลเช็กอินรายวันทั้งหมดบนหน้าต่างบอร์ด (โดยจะยังคงเก็บข้อมูลไว้เป็นสถิติสะสม) ใช่ไหมคะคนเก่ง?")) {
        clearDailyCheckins();
        renderWindows();
        renderDashboard();
        alert("เคลียร์การแสดงผลเช็กอินรายวันเรียบร้อยแล้วค่ะคนเก่ง! ข้อมูลประวัติยังถูกเก็บไว้เป็นสถิติในหน้าแดชบอร์ดตามปกตินะคะ 🧹✨");
    }
}

function renderDeptCharts() {
    const barsContainer = document.getElementById("deptChartBars");
    if (!barsContainer) return;
    barsContainer.innerHTML = "";
    
    const members = getMembers();
    const logs = getLogs();
    
    DEPARTMENTS.forEach(dept => {
        const deptMembers = members.filter(m => m.dept === dept);
        
        let deptHeartSum = 0;
        let deptFireSum = 0;
        let evaluatedCount = 0;
        
        deptMembers.forEach(member => {
            const memberLogs = logs.filter(log => log.memberId === member.id);
            if (memberLogs.length > 0) {
                const latestLog = memberLogs[memberLogs.length - 1];
                deptHeartSum += latestLog.heartIndex;
                deptFireSum += latestLog.fireIndex;
                evaluatedCount++;
            }
        });
        
        const heartAvg = evaluatedCount > 0 ? Math.round(deptHeartSum / evaluatedCount) : 0;
        const fireAvg = evaluatedCount > 0 ? Math.round(deptFireSum / evaluatedCount) : 0;
        
        const barGroup = document.createElement("div");
        barGroup.className = "chart-bar-group";
        
        barGroup.innerHTML = `
            <div class="chart-bar-columns">
                <div class="chart-column heart-col" style="height: ${heartAvg}%;" data-val="${heartAvg}%"></div>
                <div class="chart-column fire-col" style="height: ${fireAvg}%;" data-val="${fireAvg}%"></div>
            </div>
            <div class="chart-bar-label" title="${dept}">${dept}</div>
        `;
        
        barsContainer.appendChild(barGroup);
    });
}

// 9. COZY APPOINTMENT SCHEDULER (บอร์ดนัดหมายฮีลใจ)
function renderAppointments() {
    const listContainer = document.getElementById("appointmentsList");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    
    // กรองนัดหมายที่ถูกยกเลิก (deleted: true) ออกจากการแสดงผล
    const appts = getAppointments().filter(appt => !appt.deleted);
    
    if (appts.length === 0) {
        listContainer.innerHTML = `<div class="glass-card" style="grid-column: 1 / -1; text-align: center; color: var(--color-brown-light); padding: 50px;">
            📭 ตอนนี้บอร์ดเหงามากๆ เลยค่ะ ยังไม่มีนัดชวนคุยหรือชวนชาร์จแบตจิตใจเลย ลองคลิกปุ่ม 'ชวนเพื่อนฮีลใจ' ด้านบนเพื่อสร้างนัดแรกของทีมกันนะ
        </div>`;
        return;
    }
    
    appts.forEach(appt => {
        const card = document.createElement("div");
        card.className = "appt-card";
        const chipsHtml = appt.joined.map(name => `<span class="participant-chip">${name}</span>`).join(" ");
        
        card.innerHTML = `
            <div class="appt-header">
                <h4 class="appt-title">${appt.title}</h4>
                <div class="appt-meta-creator">✍️ ชวนโดย: ${appt.creatorName} (${appt.creatorDept})</div>
            </div>
            <div class="appt-body">
                <div class="appt-detail-row"><b>⏰ เวลานัด:</b> <span>${appt.dateTime}</span></div>
                <div class="appt-detail-row"><b>📍 นัดพบที่:</b> <span>${appt.location}</span></div>
                <div class="appt-desc">"${appt.description}"</div>
                
                <div class="appt-participants">
                    <h5>❤️ สมาชิกที่ตอบตกลงไปกันนะ (${appt.joined.length} คน):</h5>
                    <div class="participants-list">
                        ${chipsHtml || '<span style="font-size: 11px; color: var(--color-brown-light);">ยังไม่มีผู้ร่วมเดินทางเลย ไปเป็นคนแรกน๊า</span>'}
                    </div>
                </div>
            </div>
            <div class="appt-footer">
                <button class="join-appt-btn" onclick="handleJoinAppt('${appt.id}')">
                    ฉันไปด้วยนะ! ❤️
                </button>
                <button class="delete-appt-btn" onclick="handleDeleteAppt('${appt.id}')">ยกเลิกนัด</button>
            </div>
        `;
        
        listContainer.appendChild(card);
    });
}

function openNewApptModal() {
    const members = getMembers();
    const select = document.getElementById("apptHostSelect");
    if (!select) return;
    
    select.innerHTML = "";
    members.forEach(member => {
        const opt = document.createElement("option");
        opt.value = member.id;
        opt.textContent = `${member.name} (${member.role.replace("คณะกรรมการนักศึกษา", "")})`;
        select.appendChild(opt);
    });
    
    document.getElementById("apptTitle").value = "";
    document.getElementById("apptDateTime").value = "";
    document.getElementById("apptLocation").value = "";
    document.getElementById("apptDesc").value = "";
    
    openModal("newApptModal");
}

function handleNewApptSubmit(e) {
    e.preventDefault();
    
    const hostId = document.getElementById("apptHostSelect").value;
    const title = document.getElementById("apptTitle").value.trim();
    const dateTime = document.getElementById("apptDateTime").value.trim();
    const location = document.getElementById("apptLocation").value.trim();
    const description = document.getElementById("apptDesc").value.trim();
    
    const members = getMembers();
    const host = members.find(m => m.id === hostId);
    
    saveAppointment(title, host.name, host.dept, dateTime, location, description);
    
    closeModal("newNewApptModal");
    closeModal("newApptModal");
    renderAppointments();
    
    playSynthChime();
    alert("สร้างนัดหมายสำเร็จแล้วค๊า อย่าลืมชวนเพื่อนร่วมก๊วนไปผ่อนคลายจิตใจด้วยกันนะคะ! 🥰");
}

function handleJoinAppt(apptId) {
    const members = getMembers();
    const namesList = members.map(m => m.name).join(", ");
    const yourName = prompt(`กรุณาระบุชื่อ กน. ของคุณเพื่อเข้าร่วมหรือออกจากการร่วมทริปนี้:\n(เช่น: ${namesList})`);
    
    if (!yourName) return;
    
    const cleanName = yourName.trim().toUpperCase();
    const foundMember = members.find(m => m.name.toUpperCase() === cleanName);
    
    if (!foundMember) {
        alert("ไม่พบชื่อสมาชิกคนนี้ในทะเบียนคณะกรรมการเลยค่ะคนเก่ง ลองสะกดให้ตรงกับชื่อบนหน้าต่างบ้านนะ");
        return;
    }
    
    joinAppointment(apptId, foundMember.name);
    renderAppointments();
    playSynthBeep();
}

function handleDeleteAppt(apptId) {
    if (confirm("ต้องการยกเลิกการนัดหมายนี้และถอดป้ายออกจากกระดานฮีลใจใช่ไหมคะคนเก่ง?")) {
        deleteAppointment(apptId);
        renderAppointments();
    }
}

// 10. ROSTER MANAGEMENT PANEL (แต่งตั้งคณะกรรมการ)
function renderManageList() {
    const list = document.getElementById("membersEditList");
    if (!list) return;
    list.innerHTML = "";
    
    const members = getMembers();
    
    members.forEach(member => {
        const card = document.createElement("div");
        card.className = "member-edit-card";
        
        card.innerHTML = `
            <div class="member-card-title">
                <div class="member-edit-avatar" style="background-color: ${member.avatarColor}; color: ${member.textColor};">
                    ${member.name.charAt(0)}
                </div>
                <div class="member-card-title-text">
                    <h4>${member.name}</h4>
                    <span>${member.role}</span>
                </div>
            </div>
            
            <div class="member-edit-form-field">
                <label>ชื่อเรียก/ฉายา (Name)</label>
                <input type="text" value="${member.name}" id="editName_${member.id}" required>
            </div>
            
            <div class="member-edit-form-field">
                <label>บทบาทหน้าที่หลัก</label>
                <input type="text" value="${member.role}" id="editRole_${member.id}" required>
            </div>
            
            <div class="member-edit-form-field">
                <label>แผนกฝ่ายงาน</label>
                <select id="editDept_${member.id}">
                    ${DEPARTMENTS.map(d => `<option value="${d}" ${member.dept === d ? 'selected' : ''}>ฝ่าย${d}</option>`).join("")}
                </select>
            </div>
            
            <div class="member-edit-form-field">
                <label>MBTI บุคลิกภาพ</label>
                <input type="text" value="${member.mbti}" id="editMbti_${member.id}">
            </div>
            
            <div class="member-edit-form-field">
                <label>ของสำคัญ 3 ชิ้น (คั่นด้วยจุลภาค ,)</label>
                <input type="text" value="${member.items.join(", ")}" id="editItems_${member.id}">
            </div>
            
            <button class="save-member-btn" onclick="saveIndividualMember('${member.id}')">💾 บันทึกการแก้ไข</button>
        `;
        
        list.appendChild(card);
    });
}

function saveIndividualMember(memberId) {
    const members = getMembers();
    const member = members.find(m => m.id === memberId);
    
    if (member) {
        const newName = document.getElementById(`editName_${memberId}`).value.trim();
        const newRole = document.getElementById(`editRole_${memberId}`).value.trim();
        const newDept = document.getElementById(`editDept_${memberId}`).value;
        const newMbti = document.getElementById(`editMbti_${memberId}`).value.trim().toUpperCase();
        const itemsStr = document.getElementById(`editItems_${memberId}`).value;
        
        if (!newName || !newRole) {
            alert("กรุณากรอกชื่อและบทบาทหน้าที่ให้ครบถ้วนก่อนน๊าคนดี");
            return;
        }
        
        member.name = newName.toUpperCase();
        member.role = newRole;
        member.dept = newDept;
        member.mbti = newMbti;
        member.items = itemsStr.split(",").map(i => i.trim()).filter(i => i.length > 0);
        
        saveMembers(members);
        
        renderWindows();
        renderDashboard();
        renderManageList();
        
        playSynthBeep();
        alert(`บันทึกข้อมูลและปรับแต่งห้องของ ${member.name} เรียบร้อยแล้วค่ะ! ✨`);
    }
}

function handleResetMembers() {
    if (confirm("ต้องการยกเลิกการปรับปรุงสมาชิกทั้งหมด และรีเซ็ตข้อมูล กน. 16 คนกลับเป็นค่าตั้งต้นตามข้อมูลในรูปภาพหรือไม่คะ?")) {
        resetMembers();
        renderWindows();
        renderDashboard();
        renderManageList();
        alert("รีเซ็ตเป็นรายชื่อตั้งต้นคณะกรรมการนักศึกษาครบทั้ง 16 คนเสร็จสิ้นค่ะ 🎉");
    }
}

// ==========================================================================
// 22. BALCONY TREES SIMULATION & WATERING SYSTEM (ระบบระเบียงต้นไม้ กน.)
// ==========================================================================
function renderTrees() {
    const grid = document.getElementById("treesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    const members = getMembers();
    const trees = getTrees();
    
    members.forEach(member => {
        const tree = trees.find(t => t.memberId === member.id) || {
            memberId: member.id,
            waterPercent: 50,
            growthPoints: 0
        };
        
        const card = document.createElement("div");
        card.className = "tree-card";
        card.dataset.id = member.id;
        
        // Add title attribute for tooltip!
        if (tree.lastWateredBy && tree.lastPhrase) {
            card.title = `ล่าสุดรดน้ำโดย: ${tree.lastWateredBy}\nคำส่งกำลังใจ: "${tree.lastPhrase}"`;
        } else {
            card.title = `ยังไม่มีใครมารดน้ำต้นไม้นี้ค๊า 🌱`;
        }
        
        const svgMarkup = getTreeSvg(member, tree.growthPoints);
        
        card.innerHTML = `
            <div class="tree-svg-container" id="treeSvgContainer_${member.id}">
                ${svgMarkup}
            </div>
            <div class="tree-name">${member.name}</div>
            <div class="tree-water-status">
                <div class="tree-water-fill" style="width: ${tree.waterPercent}%;"></div>
            </div>
            <div class="tree-water-text">💧 ${tree.waterPercent}%</div>
            <div class="tree-age-text">อายุ: ${tree.growthPoints} วัน</div>
        `;
        
        card.addEventListener("click", () => {
            openWateringModal(member.id);
        });
        
        grid.appendChild(card);
    });
}

function getTreeSvg(member, growthPoints) {
    const treeSpecies = getTreeType(member.id);
    const c1 = treeSpecies.flowerColor1;
    const c2 = treeSpecies.flowerColor2;
    
    let stage = 1;
    if (growthPoints >= 301) stage = 4;
    else if (growthPoints >= 181) stage = 3;
    else if (growthPoints >= 61) stage = 2;
    
    // Scale size slightly based on age points
    let scale = 0.55 + 0.55 * (growthPoints / 365);
    scale = Math.min(1.2, Math.max(0.6, scale));
    
    const defs = `
    <defs>
        <!-- Terracotta Pot Gradient -->
        <linearGradient id="clayGrad_${member.id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#A16B58" />
            <stop offset="25%" stop-color="#CD8C76" />
            <stop offset="70%" stop-color="#9C5E4A" />
            <stop offset="100%" stop-color="#6F3F32" />
        </linearGradient>
        <linearGradient id="rimGrad_${member.id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#B97A64" />
            <stop offset="40%" stop-color="#DE9E88" />
            <stop offset="100%" stop-color="#7D4637" />
        </linearGradient>
        <!-- Trunk 3D cylindrical gradient -->
        <linearGradient id="trunkGrad_${member.id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#4E342E" />
            <stop offset="35%" stop-color="#8D6E63" />
            <stop offset="70%" stop-color="#5D4037" />
            <stop offset="100%" stop-color="#3E2723" />
        </linearGradient>
    </defs>
    `;
    
    const potSvg = `
        <!-- Soil -->
        <ellipse cx="30" cy="53" rx="14" ry="3" fill="#4E342E" />
        <!-- Pot Body -->
        <path d="M16 53 L44 53 L40 73 L20 73 Z" fill="url(#clayGrad_${member.id})" stroke="#3E2723" stroke-width="1.2" />
        <!-- Pot Rim -->
        <rect x="13" y="50" width="34" height="4.5" rx="1" fill="url(#rimGrad_${member.id})" stroke="#3E2723" stroke-width="1.2" />
    `;
    
    const sproutPotSvg = `
        <!-- Soil -->
        <ellipse cx="30" cy="58" rx="12" ry="2.5" fill="#4E342E" />
        <!-- Pot Body -->
        <path d="M18 58 L42 58 L39 74 L21 74 Z" fill="url(#clayGrad_${member.id})" stroke="#3E2723" stroke-width="1" />
        <!-- Pot Rim -->
        <rect x="15" y="55" width="30" height="4" rx="1" fill="url(#rimGrad_${member.id})" stroke="#3E2723" stroke-width="1" />
    `;
    
    if (stage === 1) {
        // Sprout 🌱 (Common shape across all, but colored leaf outline)
        return `
        <svg class="tree-svg" viewBox="0 0 60 80" style="transform: scale(${scale});">
            ${defs}
            ${sproutPotSvg}
            <!-- Stem -->
            <path d="M30 55 Q30 38 27 28" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" />
            <!-- Left leaf -->
            <path d="M27 28 Q15 20 20 14 Q27 18 27 28" fill="#81C784" stroke="#1B5E20" stroke-width="1" />
            <path d="M23 21 Q21 17 20 14" fill="none" stroke="#1B5E20" stroke-width="0.6" />
            <!-- Right leaf -->
            <path d="M27 28 Q39 20 34 14 Q27 18 27 28" fill="#66BB6A" stroke="#1B5E20" stroke-width="1" />
            <path d="M31 21 Q33 17 34 14" fill="none" stroke="#1B5E20" stroke-width="0.6" />
        </svg>
        `;
    } else if (stage === 2) {
        // Sapling 🌿 (Distinct leaf shapes based on species)
        let leafSvg = "";
        if (treeSpecies.leafShape === "circle") {
            leafSvg = `
            <!-- Layered leaf circles -->
            <circle cx="30" cy="24" r="10" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="1" />
            <circle cx="21" cy="30" r="8" fill="#81C784" stroke="#1B5E20" stroke-width="1" />
            <circle cx="39" cy="30" r="8" fill="#4CAF50" stroke="#1B5E20" stroke-width="1" />
            <circle cx="30" cy="32" r="7" fill="#66BB6A" stroke="#1B5E20" stroke-width="1" />
            `;
        } else if (treeSpecies.leafShape === "polygon") {
            leafSvg = `
            <!-- Shaded pointed leaves -->
            <polygon points="30,12 37,28 30,38 23,28" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="1" />
            <line x1="30" y1="12" x2="30" y2="38" stroke="#1B5E20" stroke-width="0.8" />
            <polygon points="20,22 27,33 20,38 13,30" fill="#81C784" stroke="#1B5E20" stroke-width="1" />
            <line x1="20" y1="22" x2="20" y2="38" stroke="#1B5E20" stroke-width="0.6" />
            <polygon points="40,22 47,30 40,38 33,33" fill="#4CAF50" stroke="#1B5E20" stroke-width="1" />
            <line x1="40" y1="22" x2="40" y2="38" stroke="#1B5E20" stroke-width="0.6" />
            `;
        } else if (treeSpecies.leafShape === "ellipse") {
            leafSvg = `
            <ellipse cx="30" cy="24" rx="6" ry="12" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="1" />
            <ellipse cx="18" cy="30" rx="5" ry="9" fill="#81C784" stroke="#1B5E20" stroke-width="1" transform="rotate(-25 18 30)" />
            <ellipse cx="42" cy="30" rx="5" ry="9" fill="#4CAF50" stroke="#1B5E20" stroke-width="1" transform="rotate(25 42 30)" />
            <ellipse cx="28" cy="33" rx="4" ry="7" fill="#66BB6A" stroke="#1B5E20" stroke-width="0.8" />
            `;
        } else { // rect (diamond-ish)
            leafSvg = `
            <rect x="22" y="16" width="16" height="16" rx="2" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="1" transform="rotate(45 30 24)" />
            <rect x="14" y="26" width="11" height="11" rx="1.5" fill="#81C784" stroke="#1B5E20" stroke-width="1" transform="rotate(45 19 31)" />
            <rect x="35" y="26" width="11" height="11" rx="1.5" fill="#4CAF50" stroke="#1B5E20" stroke-width="1" transform="rotate(45 40 31)" />
            `;
        }
        
        return `
        <svg class="tree-svg" viewBox="0 0 60 80" style="transform: scale(${scale});">
            ${defs}
            ${potSvg}
            <!-- Trunk & Branches -->
            <path d="M30 53 L30 24" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="3" stroke-linecap="round" />
            <path d="M30 40 Q20 32 18 28" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="2" stroke-linecap="round" />
            <path d="M30 40 Q40 32 42 28" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="2" stroke-linecap="round" />
            <!-- Leaves -->
            ${leafSvg}
        </svg>
        `;
    } else if (stage === 3) {
        // Blossoming 🪴🌸 (Flowering and growing bigger, flower buds visible)
        let leavesAndFlowers = "";
        
        if (treeSpecies.type === "sakura") {
            leavesAndFlowers = `
            <!-- Sakura canopy -->
            <circle cx="30" cy="20" r="15" fill="${treeSpecies.leafColor}" opacity="0.9" stroke="#1B5E20" stroke-width="0.8" />
            <circle cx="16" cy="24" r="11" fill="#81C784" opacity="0.95" stroke="#1B5E20" stroke-width="0.8" />
            <circle cx="44" cy="24" r="11" fill="#4CAF50" opacity="0.95" stroke="#1B5E20" stroke-width="0.8" />
            <!-- Sakura pink blossoms (Detailed) -->
            <g transform="translate(28, 14)">
                <circle cx="0" cy="0" r="3.5" fill="${c1}" stroke="#D81B60" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#FFF59D" />
            </g>
            <g transform="translate(20, 20)">
                <circle cx="0" cy="0" r="3" fill="${c2}" stroke="#D81B60" stroke-width="0.5" />
                <circle cx="-0.8" cy="-0.8" r="1" fill="#FFF" />
            </g>
            <g transform="translate(40, 22)">
                <circle cx="0" cy="0" r="4" fill="${c1}" stroke="#D81B60" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#FFF59D" />
            </g>
            <g transform="translate(36, 12)">
                <circle cx="0" cy="0" r="3" fill="${c2}" stroke="#D81B60" stroke-width="0.5" />
            </g>
            `;
        } else if (treeSpecies.type === "orchid") {
            leavesAndFlowers = `
            <!-- Orchid pointed leaves canopy -->
            <polygon points="30,5 42,20 30,35 18,20" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" />
            <polygon points="14,15 25,25 14,35 3,25" fill="#81C784" opacity="0.95" stroke="#1B5E20" stroke-width="0.8" />
            <polygon points="46,15 57,25 46,35 35,25" fill="#4CAF50" opacity="0.95" stroke="#1B5E20" stroke-width="0.8" />
            <!-- Orange star-shaped buds (Detailed) -->
            <g transform="translate(30, 14)">
                <polygon points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1" fill="${c1}" stroke="#E65100" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1" fill="#FFF59D" />
            </g>
            <g transform="translate(16, 23)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c2}" stroke="#E65100" stroke-width="0.5" />
            </g>
            <g transform="translate(44, 23)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c2}" stroke="#E65100" stroke-width="0.5" />
            </g>
            `;
        } else if (treeSpecies.type === "wisteria") {
            leavesAndFlowers = `
            <!-- Wisteria elliptical canopy -->
            <ellipse cx="30" cy="20" rx="10" ry="16" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" />
            <ellipse cx="16" cy="26" rx="8" ry="12" fill="#81C784" stroke="#1B5E20" stroke-width="0.8" />
            <ellipse cx="44" cy="26" rx="8" ry="12" fill="#4CAF50" stroke="#1B5E20" stroke-width="0.8" />
            <!-- Purple cascading wisteria flower clusters -->
            <path d="M 28 20 C 28 28, 25 32, 26 36 L 29 36" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 40 22 C 40 30, 37 34, 38 38 L 41 38" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 14 24 C 14 30, 11 34, 12 38 L 15 38" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" />
            <!-- Small detailed cascading clusters -->
            <circle cx="26" cy="24" r="2.5" fill="${c1}" stroke="#4A148C" stroke-width="0.3" />
            <circle cx="28" cy="28" r="2" fill="${c2}" stroke="#4A148C" stroke-width="0.3" />
            <circle cx="27" cy="33" r="1.8" fill="${c1}" />
            <circle cx="39" cy="26" r="2.5" fill="${c2}" stroke="#4A148C" stroke-width="0.3" />
            <circle cx="41" cy="30" r="2" fill="${c1}" stroke="#4A148C" stroke-width="0.3" />
            <circle cx="13" cy="28" r="2.5" fill="${c1}" stroke="#4A148C" stroke-width="0.3" />
            <circle cx="15" cy="32" r="2.1" fill="${c2}" />
            `;
        } else {
            // Jasmine
            leavesAndFlowers = `
            <!-- Jasmine diamond-ish canopy -->
            <rect x="20" y="10" width="20" height="20" rx="3" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" transform="rotate(45 30 20)" />
            <rect x="8" y="18" width="15" height="15" rx="2" fill="#81C784" stroke="#1B5E20" stroke-width="0.8" transform="rotate(45 15.5 25.5)" />
            <rect x="37" y="18" width="15" height="15" rx="2" fill="#4CAF50" stroke="#1B5E20" stroke-width="0.8" transform="rotate(45 44.5 25.5)" />
            <!-- Jasmine yellow/white flowers -->
            <g transform="translate(30, 14)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c1}" stroke="#F57F17" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1" fill="#FFF" />
            </g>
            <g transform="translate(16, 24)">
                <circle cx="0" cy="0" r="3" fill="${c2}" stroke="#F57F17" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1" fill="#FFF" />
            </g>
            <g transform="translate(44, 24)">
                <circle cx="0" cy="0" r="3" fill="${c2}" stroke="#F57F17" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1" fill="#FFF" />
            </g>
            `;
        }
        
        return `
        <svg class="tree-svg" viewBox="0 0 60 80" style="transform: scale(${scale});">
            ${defs}
            ${potSvg}
            <!-- Trunk & Branching structure -->
            <path d="M30 53 L30 30" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="4" stroke-linecap="round" />
            <path d="M30 38 Q18 28 15 22" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="2.5" stroke-linecap="round" />
            <path d="M30 38 Q42 28 45 22" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="2.5" stroke-linecap="round" />
            <!-- Dynamic Leaves and Flower Buds -->
            ${leavesAndFlowers}
        </svg>
        `;
    } else {
        // Majestic Tree 🌳✨ (Detailed thick trunk cylinder, multi-layered foliage canopy, blooming flowers & sparkles)
        let leavesAndFlowers = "";
        
        if (treeSpecies.type === "sakura") {
            leavesAndFlowers = `
            <!-- Sakura full blooming canopy -->
            <circle cx="30" cy="18" r="18" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" />
            <circle cx="13" cy="22" r="14" fill="#81C784" stroke="#1B5E20" stroke-width="0.8" />
            <circle cx="47" cy="22" r="14" fill="#4CAF50" stroke="#1B5E20" stroke-width="0.8" />
            <circle cx="30" cy="6" r="13" fill="#66BB6A" stroke="#1B5E20" stroke-width="0.8" />
            
            <!-- Sakura flowers -->
            <g transform="translate(30, 8) scale(1.2)">
                <path d="M0,0 Q-3,-5 0,-7 Q3,-5 0,0" fill="${c1}" />
                <path d="M0,0 Q-5,-3 -7,-4 Q-5,-7 0,0" fill="${c2}" transform="rotate(72)" />
                <path d="M0,0 Q-7,1 -8,-1 Q-7,-4 0,0" fill="${c1}" transform="rotate(144)" />
                <path d="M0,0 Q-4,5 -5,3 Q-3,1 0,0" fill="${c2}" transform="rotate(216)" />
                <path d="M0,0 Q3,4 4,1 Q3,-2 0,0" fill="${c1}" transform="rotate(288)" />
                <circle cx="0" cy="0" r="1.5" fill="#FFD54F" />
            </g>
            <g transform="translate(28, 16)">
                <circle cx="0" cy="0" r="3.5" fill="${c1}" stroke="#D81B60" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.2" fill="#FFF59D" />
            </g>
            <g transform="translate(34, 13)">
                <circle cx="0" cy="0" r="3" fill="${c2}" stroke="#D81B60" stroke-width="0.5" />
            </g>
            <g transform="translate(15, 19)">
                <circle cx="0" cy="0" r="4.5" fill="${c1}" stroke="#D81B60" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#FFF" />
            </g>
            <g transform="translate(12, 26)">
                <circle cx="0" cy="0" r="3.5" fill="${c2}" stroke="#D81B60" stroke-width="0.5" />
            </g>
            <g transform="translate(45, 19)">
                <circle cx="0" cy="0" r="4.5" fill="${c1}" stroke="#D81B60" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#FFF" />
            </g>
            <g transform="translate(48, 26)">
                <circle cx="0" cy="0" r="3.5" fill="${c2}" stroke="#D81B60" stroke-width="0.5" />
            </g>
            `;
        } else if (treeSpecies.type === "orchid") {
            leavesAndFlowers = `
            <!-- Orchid full blooming canopy -->
            <polygon points="30,0 45,18 30,36 15,18" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" />
            <polygon points="12,12 26,26 12,40 -2,26" fill="#81C784" stroke="#1B5E20" stroke-width="0.8" />
            <polygon points="48,12 62,26 48,40 34,26" fill="#4CAF50" stroke="#1B5E20" stroke-width="0.8" />
            
            <!-- Orchid detailed flowers -->
            <g transform="translate(30, 11) scale(1.1)">
                <polygon points="0,-4 1.5,-1 4.5,-1 2,1 3.5,4 0,2 -3.5,4 -2,1 -4.5,-1 -1.5,-1" fill="${c1}" stroke="#E65100" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#FFEB3B" />
            </g>
            <g transform="translate(12, 23)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c2}" stroke="#E65100" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1" fill="#FFF" />
            </g>
            <g transform="translate(48, 23)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c1}" stroke="#E65100" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1" fill="#FFF" />
            </g>
            <g transform="translate(30, 2)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="#FFEB3B" stroke="#F57F17" stroke-width="0.5" />
            </g>
            `;
        } else if (treeSpecies.type === "wisteria") {
            leavesAndFlowers = `
            <!-- Wisteria full cascading canopy -->
            <ellipse cx="30" cy="18" rx="14" ry="20" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" />
            <ellipse cx="12" cy="24" rx="10" ry="15" fill="#81C784" stroke="#1B5E20" stroke-width="0.8" />
            <ellipse cx="48" cy="24" rx="10" ry="15" fill="#4CAF50" stroke="#1B5E20" stroke-width="0.8" />
            
            <!-- Large cascading wisteria vines -->
            <path d="M 27 15 C 27 26, 23 32, 24 42 L 27 42" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 45 18 C 45 28, 41 34, 42 44 L 45 44" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 15 18 C 15 28, 11 34, 12 44 L 15 44" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 33 22 C 33 30, 31 34, 32 40" fill="none" stroke="${c2}" stroke-width="2" stroke-linecap="round" />
            
            <!-- Cascading detailed blossoms -->
            <circle cx="24" cy="22" r="3" fill="${c1}" stroke="#4A148C" stroke-width="0.4" />
            <circle cx="26" cy="28" r="3.2" fill="${c2}" stroke="#4A148C" stroke-width="0.4" />
            <circle cx="24" cy="34" r="2.5" fill="${c1}" />
            <circle cx="43" cy="24" r="3" fill="${c1}" stroke="#4A148C" stroke-width="0.4" />
            <circle cx="44" cy="31" r="3.2" fill="${c2}" stroke="#4A148C" stroke-width="0.4" />
            <circle cx="42" cy="37" r="2.5" fill="${c1}" />
            <circle cx="13" cy="24" r="3" fill="${c2}" stroke="#4A148C" stroke-width="0.4" />
            <circle cx="14" cy="31" r="3.2" fill="${c1}" stroke="#4A148C" stroke-width="0.4" />
            <circle cx="12" cy="37" r="2.5" fill="${c2}" />
            <circle cx="32" cy="27" r="2.5" fill="${c1}" />
            <circle cx="31" cy="34" r="2.2" fill="${c2}" />
            `;
        } else {
            leavesAndFlowers = `
            <!-- Jasmine full blooming canopy -->
            <rect x="18" y="6" width="24" height="24" rx="4" fill="${treeSpecies.leafColor}" stroke="#1B5E20" stroke-width="0.8" transform="rotate(45 30 18)" />
            <rect x="5" y="16" width="18" height="18" rx="3" fill="#81C784" stroke="#1B5E20" stroke-width="0.8" transform="rotate(45 14 25)" />
            <rect x="37" y="16" width="18" height="18" rx="3" fill="#4CAF50" stroke="#1B5E20" stroke-width="0.8" transform="rotate(45 46 25)" />
            
            <!-- Jasmine detailed flowers -->
            <g transform="translate(30, 18) scale(1.3)">
                <circle cx="0" cy="0" r="4" fill="${c1}" stroke="#F57F17" stroke-width="0.5" />
                <circle cx="0" cy="0" r="1.5" fill="#FFF" />
            </g>
            <g transform="translate(14, 25) scale(1.1)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c2}" stroke="#F57F17" stroke-width="0.5" />
                <circle cx="0" cy="0" r="0.8" fill="#FFF" />
            </g>
            <g transform="translate(46, 25) scale(1.1)">
                <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="${c2}" stroke="#F57F17" stroke-width="0.5" />
                <circle cx="0" cy="0" r="0.8" fill="#FFF" />
            </g>
            `;
        }
        
        return `
        <svg class="tree-svg" viewBox="0 0 60 80" style="transform: scale(${scale});">
            ${defs}
            ${potSvg}
            <!-- Sturdy cylindrical 3D Trunk -->
            <path d="M30 53 L30 25" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="6" stroke-linecap="round" />
            <path d="M30 35 Q15 22 10 16" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="3.5" stroke-linecap="round" />
            <path d="M30 35 Q45 22 50 16" fill="none" stroke="url(#trunkGrad_${member.id})" stroke-width="3.5" stroke-linecap="round" />
            <!-- Leaves & Flowers -->
            ${leavesAndFlowers}
            <!-- Twinkling Sparkles overlay -->
            <g class="sparkles" opacity="0.85">
                <polygon points="30,0 30.5,1.5 32,2 30.5,2.5 30,4 29.5,2.5 28,2 29.5,1.5" fill="#FFF" />
                <polygon points="12,6 12.5,7.5 14,8 12.5,8.5 12,10 11.5,8.5 10,8 11.5,7.5" fill="#FFF" />
                <polygon points="48,6 48.5,7.5 50,8 48.5,8.5 48,10 47.5,8.5 46,8 47.5,7.5" fill="#FFF" />
            </g>
        </svg>
        `;
    }
}

function updateBalconyTimeCycle() {
    const balcony = document.getElementById("balconyContainer");
    const sky = document.getElementById("balconySky");
    const celestial = document.getElementById("balconyCelestial");
    const stars = document.getElementById("balconyStars");
    
    if (!balcony || !sky) return;
    
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 18;
    
    if (isNight) {
        sky.style.background = "linear-gradient(to bottom, #0D47A1, #1565C0, #1A237E)";
        if (celestial) {
            celestial.innerHTML = "🌙";
            celestial.style.filter = "drop-shadow(0 0 10px #FFF9C4)";
            celestial.style.animation = "floatCelestial 4s infinite ease-in-out";
        }
        // Spawn stars if empty
        if (stars && stars.children.length === 0) {
            for (let i = 0; i < 20; i++) {
                const star = document.createElement("div");
                star.className = "balcony-star";
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                stars.appendChild(star);
            }
        }
        balcony.classList.add("night-mode");
    } else {
        sky.style.background = "linear-gradient(to bottom, #FFE082, #FFF9C4, #E3F2FD)";
        if (celestial) {
            celestial.innerHTML = "☀️";
            celestial.style.filter = "drop-shadow(0 0 12px #FFD54F)";
            celestial.style.animation = "floatCelestial 5s infinite ease-in-out";
        }
        if (stars) stars.innerHTML = "";
        balcony.classList.remove("night-mode");
    }
}

function openWateringModal(memberId) {
    const members = getMembers();
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    const trees = getTrees();
    const tree = trees.find(t => t.memberId === memberId) || {
        memberId: memberId,
        waterPercent: 50,
        growthPoints: 0
    };
    
    const treeSpecies = getTreeType(memberId);
    
    document.getElementById("wateringMemberId").value = memberId;
    document.getElementById("wateringModalTitle").textContent = `รดน้ำต้นไม้ของ ${member.name} 🌳`;
    document.getElementById("wateringTreeStatus").textContent = `ระดับน้ำในดิน: ${tree.waterPercent}% | อายุต้นไม้: ${tree.growthPoints} วัน`;
    document.getElementById("wateringTreeSpeciesName").textContent = `สายพันธุ์: ${treeSpecies.name} (${treeSpecies.flowerEmoji})`;
    
    // แสดงประวัติรดน้ำล่าสุด
    const lastWateredInfo = document.getElementById("lastWateredInfo");
    if (lastWateredInfo) {
        if (tree.lastWateredBy && tree.lastPhrase) {
            document.getElementById("lastWateredByName").textContent = tree.lastWateredBy;
            document.getElementById("lastWateredPhrase").textContent = tree.lastPhrase;
            lastWateredInfo.style.display = "block";
        } else {
            lastWateredInfo.style.display = "none";
        }
    }
    
    // Set preview tree avatar
    let treeEmoji = "🌱";
    if (tree.growthPoints >= 301) treeEmoji = "🌳";
    else if (tree.growthPoints >= 181) treeEmoji = "🪴";
    else if (tree.growthPoints >= 61) treeEmoji = "🌿";
    
    const avatarEl = document.getElementById("wateringTreeAvatar");
    if (avatarEl) {
        avatarEl.textContent = treeEmoji;
        avatarEl.style.transform = "scale(1.25)";
        setTimeout(() => {
            avatarEl.style.transform = "scale(1)";
        }, 300);
    }
    
    // Populate waterer selector options
    const select = document.getElementById("watererSelect");
    if (select) {
        select.innerHTML = "";
        members.forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.name;
            opt.textContent = `${m.name} (${m.role.replace("คณะกรรมการนักศึกษา", "")})`;
            select.appendChild(opt);
        });
    }
    
    openModal("wateringModal");
}

function handleWateringSubmit(e) {
    e.preventDefault();
    
    const memberId = document.getElementById("wateringMemberId").value;
    const watererName = document.getElementById("watererSelect").value;
    const phraseRadio = document.querySelector('input[name="positivePhrase"]:checked');
    const positivePhrase = phraseRadio ? phraseRadio.value : "สู้ๆ นะค๊าคนเก่ง!";
    
    const res = waterTree(memberId, positivePhrase, watererName);
    
    if (res) {
        closeModal("wateringModal");
        renderTrees();
        playSynthChime();
        triggerWaterSplash(memberId);
        
        const growthMsg = res.growthAdded ? " และต้นไม้อายุเติบโตขึ้น +1 วันค๊า!" : " (แต้มอายุเพิ่มขึ้นได้วันละ 1 ครั้งค๊า)";
        alert(`รดน้ำต้นไม้ของเพื่อนสำเร็จด้วยคำพูดส่งกำลังใจ: "${positivePhrase}"\nความชุ่มชื้นเพิ่มขึ้นแล้วค๊า${growthMsg} 🥰💧`);
    }
}

function handleCheatGrowth() {
    const memberId = document.getElementById("wateringMemberId").value;
    
    // Add 30 days growth
    const updatedTree = addGrowthCheat(memberId, 30);
    
    if (updatedTree && updatedTree.error === "already_fertilized") {
        alert("⚠️ ต้นไม้นี้เคยได้รับปุ๋ยวิเศษไปแล้วในเดือนนี้ค่ะ! สามารถใส่ปุ๋ยได้อีกครั้งในเดือนถัดไปนะคะ (จำกัด 1 ครั้งต่อเดือนต่อต้นค่ะ) 🌱");
        return;
    }
    
    if (updatedTree) {
        // Update stats directly in modal
        const treeSpecies = getTreeType(memberId);
        document.getElementById("wateringTreeStatus").textContent = `ระดับน้ำในดิน: ${updatedTree.waterPercent}% | อายุต้นไม้: ${updatedTree.growthPoints} วัน`;
        
        let treeEmoji = "🌱";
        if (updatedTree.growthPoints >= 301) treeEmoji = "🌳";
        else if (updatedTree.growthPoints >= 181) treeEmoji = "🪴";
        else if (updatedTree.growthPoints >= 61) treeEmoji = "🌿";
        
        const avatarEl = document.getElementById("wateringTreeAvatar");
        if (avatarEl) avatarEl.textContent = treeEmoji;
        
        renderTrees();
        playSynthChime();
        triggerWaterSplash(memberId);
    }
}

function triggerWaterSplash(memberId) {
    const container = document.getElementById(`treeSvgContainer_${memberId}`);
    if (!container) return;
    
    const splash = document.createElement("div");
    splash.className = "water-splash";
    container.appendChild(splash);
    
    // Create 25 rain drops falling
    for (let i = 0; i < 25; i++) {
        const drop = document.createElement("div");
        drop.className = "water-drop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 0.4}s`;
        drop.style.opacity = Math.random();
        splash.appendChild(drop);
    }
    
    // Clean up splash
    setTimeout(() => {
        splash.remove();
    }, 1500);
}

// 11. WEBAUDIO CALMING MUSIC & SOUND SYNTHESIZER
let audioCtx = null;
let isPlayingMusic = false;
let musicInterval = null;

function initAudioSynth() {
    const musicBtn = document.getElementById("musicToggle");
    if (!musicBtn) return;
    
    musicBtn.addEventListener("click", () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (isPlayingMusic) {
            stopCalmingMusic();
            musicBtn.classList.remove("playing");
            musicBtn.innerHTML = `<span class="music-icon">🎵</span> Lofi บำบัด`;
        } else {
            startCalmingMusic();
            musicBtn.classList.add("playing");
            musicBtn.innerHTML = `<span class="music-icon">⏸️</span> หยุดดนตรี`;
        }
    });
}

function startCalmingMusic() {
    isPlayingMusic = true;
    const chords = [
        [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
        [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4
        [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
        [196.00, 246.94, 293.66, 329.63]  // G3, B3, D4, E4
    ];
    let currentChordIndex = 0;
    
    function playNextChord() {
        if (!isPlayingMusic || !audioCtx) return;
        const now = audioCtx.currentTime;
        const notes = chords[currentChordIndex];
        
        notes.forEach((freq) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.04, now + 1.2);
            gainNode.gain.setValueAtTime(0.04, now + 3.0);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 4.5);
        });
        
        playRainAmbient(now, 4.5);
        currentChordIndex = (currentChordIndex + 1) % chords.length;
    }
    
    playNextChord();
    musicInterval = setInterval(playNextChord, 4500);
}

function stopCalmingMusic() {
    isPlayingMusic = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

function playRainAmbient(startTime, duration) {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, startTime);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.006, startTime + 1.0);
    gainNode.gain.setValueAtTime(0.006, startTime + duration - 1.0);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noiseNode.start(startTime);
    noiseNode.stop(startTime + duration);
}

function playSynthChime() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    
    frequencies.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + (index * 0.1));
        
        gainNode.gain.setValueAtTime(0, now + (index * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.06, now + (index * 0.1) + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (index * 0.1) + 0.8);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now + (index * 0.1));
        osc.stop(now + (index * 0.1) + 0.8);
    });
}

function playSynthBeep() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
}

// 12. UTILITY FUNCTIONS FOR MODAL WINDOWS
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// 13. JOURNEY TRACKER LOGIC
function updateJourneyTracker() {
    const journeyCar = document.getElementById("journeyCar");
    const journeyDurationText = document.getElementById("journeyDurationText");
    if (!journeyCar || !journeyDurationText) return;

    // วันที่เริ่มต้นทำ กน. (7 พฤษภาคม 2026)
    const startDate = new Date("2026-05-07T00:00:00");
    const currentDate = new Date();

    // หาเวลาแตกต่างเป็นมิลลิวินาที
    const diffTime = Math.abs(currentDate - startDate);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // คำนวณเป็นเดือนและวัน
    let tempDate = new Date(startDate);
    let months = 0;
    while (true) {
        tempDate.setMonth(tempDate.getMonth() + 1);
        if (tempDate > currentDate) {
            // ถอยหลังกลับหนึ่งเดือน
            tempDate.setMonth(tempDate.getMonth() - 1);
            break;
        }
        months++;
    }
    const days = Math.floor((currentDate - tempDate) / (1000 * 60 * 60 * 24));

    // อัปเดตข้อความรายละเอียดการเดินทาง
    journeyDurationText.textContent = `เราเดินทางร่วมกันมาแล้ว... ${months} เดือน ${days} วัน (สะสม ${totalDays} วันแห่งความทรงจำแสนพิเศษ)`;

    // คำนวณความคืบหน้า (เป้าหมาย 1 ปี = 365 วัน)
    let progressPercent = (totalDays / 365) * 100;
    progressPercent = Math.max(0, Math.min(100, progressPercent)); // ตรึงไว้ไม่ให้เกิน 100%

    // ปรับย้ายตำแหน่งรถยนต์บนแถบความคืบหน้า
    journeyCar.style.left = `${progressPercent}%`;
}

// 14. MIDNIGHT RESET ENGINE
let lastCheckedDate = new Date().toDateString();

function startMidnightResetChecker() {
    setInterval(() => {
        const currentDate = new Date().toDateString();
        if (currentDate !== lastCheckedDate) {
            lastCheckedDate = currentDate;
            // รีเซ็ตการเปิดหน้าต่างและหลอดพลังงานใหม่ที่ 00:00 น.
            renderWindows();
            renderDashboard();
            console.log("Rollover at midnight detected! Resetting member daily windows and energy.");
        }
    }, 5000); // เช็กทุกๆ 5 วินาที
}

// 15. MBTI TEAM GUIDE INTERACTIVITY
function renderMbtiGuide() {
    const grid = document.getElementById("mbtiMembersGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const members = getMembers();
    members.forEach(member => {
        const card = document.createElement("div");
        card.className = "mbti-member-card";
        card.dataset.id = member.id;

        card.innerHTML = `
            <div class="mbti-card-avatar" style="background-color: ${member.avatarColor}; color: ${member.textColor};">
                ${member.name.charAt(0)}
            </div>
            <div class="mbti-card-name">${member.name}</div>
            <div class="mbti-card-role">${member.role.replace("คณะกรรมการนักศึกษา", "")}</div>
            <span class="mbti-card-badge">${member.mbti}</span>
        `;

        card.addEventListener("click", () => {
            // เอาคลาส active ออกจากการ์ดอื่นทั้งหมด
            document.querySelectorAll(".mbti-member-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            showMbtiDetails(member);
        });

        grid.appendChild(card);
    });
}

function showMbtiDetails(member) {
    const box = document.getElementById("mbtiDetailsBox");
    const nameText = document.getElementById("mbtiDetailName");
    const styleText = document.getElementById("mbtiDetailStyle");
    const workText = document.getElementById("mbtiDetailWork");
    const commText = document.getElementById("mbtiDetailComm");

    if (!box || !nameText) return;

    const profile = MBTI_PROFILES[member.mbti];
    if (profile) {
        nameText.innerHTML = `📚 คู่มือการสื่อสารของ ${member.name} (ฝ่าย${member.dept}) | MBTI: <span class="mbti-tag" style="margin-left: 2px;">${member.mbti}</span>`;
        styleText.textContent = profile.style || "-";
        workText.textContent = profile.workStyle || "-";
        commText.textContent = profile.communication || "-";
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

// ==========================================================================
// 16. KOI POND SIMULATION ENGINE (ระบบจำลองบ่อปลาคราฟ กน.)
// ==========================================================================
let koiFishList = [];
let koiFoodList = [];
let isKoiPondActive = false;
let koiAnimationId = null;

function initKoiPond() {
    const pond = document.getElementById("koiPondWater");
    if (!pond) return;

    // เคลียร์บ่อน้ำเก่าและอาหารที่จม
    pond.innerHTML = "";
    koiFoodList = [];

    // สุ่มสร้างฟองอากาศลอยผิวน้ำเริ่มต้น 6 ฟอง
    for (let i = 0; i < 6; i++) {
        createPondBubble(pond, true);
    }

    // สร้างสาหร่ายและใบบัวลอยน้ำประดับบ่อปลา
    createPondPlants(pond);

    const members = getMembers();
    const w = pond.clientWidth || 800;
    const h = pond.clientHeight || 480;

    // เติมจำนวนปลาคราฟ 16 ตัวครั้งแรก (ถ้ายังไม่ได้เตรียม)
    if (koiFishList.length === 0) {
        members.forEach((member) => {
            // ดึงสี avatar มาตั้งเป็นลายจุดบนปลาคราฟ
            const spotColor1 = member.avatarColor;
            const spotColor2 = member.textColor;
            const bodyColor = "#FFFFFF"; // ลำตัวปลาคราฟหลักสีขาวพาสเทลสะอาดตา

            koiFishList.push({
                id: member.id,
                name: member.name,
                mbti: member.mbti,
                member: member,
                x: Math.random() * (w - 120) + 60,
                y: Math.random() * (h - 120) + 60,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                angle: Math.random() * Math.PI * 2,
                speed: 0.8 + Math.random() * 0.7,
                targetX: Math.random() * w,
                targetY: Math.random() * h,
                bodyColor: bodyColor,
                spotColor1: spotColor1,
                spotColor2: spotColor2,
                element: null,
                eatingCooldown: 0
            });
        });
    }

    // วาดปลาคราฟลงไปในหน้าจอ HTML
    koiFishList.forEach(fish => {
        const fishEl = document.createElement("div");
        fishEl.className = "koi-fish-element" + (fish.isBaby ? " koi-baby" : "");
        fishEl.id = `koiFish_${fish.id}`;
        
        if (fish.isBaby) {
            fishEl.style.transform = `scale(0.35)`;
            fishEl.innerHTML = `
                <div class="koi-nametag" style="background: rgba(255, 182, 193, 0.95); border-color: #FF69B4; font-size: 8px; color: #D81B60;">ลูกปลา ${fish.parents[0]} & ${fish.parents[1]} 💖</div>
                <svg class="koi-svg" viewBox="0 0 80 40">
                    <!-- ครีบซ้าย -->
                    <path class="koi-fin koi-fin-left" d="M 30 10 C 15 5 10 15 25 18 Z" fill="${fish.spotColor1}" />
                    <!-- ครีบขวา -->
                    <path class="koi-fin koi-fin-right" d="M 30 30 C 15 35 10 25 25 22 Z" fill="${fish.spotColor1}" />
                    <!-- โครงสร้างลำตัว -->
                    <path class="koi-body" d="M 10 20 Q 30 2 60 20 Q 30 38 10 20 Z" fill="${fish.bodyColor}" stroke="${fish.spotColor1}" stroke-width="1.8" />
                    <!-- ลายจุดปลาคราฟ 1 -->
                    <ellipse cx="28" cy="16" rx="11" ry="6.5" fill="${fish.spotColor1}" transform="rotate(-15 28 16)" />
                    <!-- ลายจุดปลาคราฟ 2 -->
                    <ellipse cx="44" cy="22" rx="7.5" ry="5.5" fill="${fish.spotColor2}" />
                    <!-- ลายจุดปลาคราฟ 3 -->
                    <ellipse cx="18" cy="21" rx="5.5" ry="4" fill="${fish.spotColor1}" />
                    <!-- หางปลาคราฟดุ๊กดิ๊ก -->
                    <path class="koi-tail" d="M 60 20 C 70 14 80 8 74 20 C 80 32 70 26 60 20 Z" fill="${fish.spotColor1}" />
                    <!-- ตาปลาทั้งสองข้าง -->
                    <circle cx="14" cy="15" r="1.5" fill="#333" />
                    <circle cx="14" cy="25" r="1.5" fill="#333" />
                </svg>
            `;
            
            fishEl.addEventListener("click", (e) => {
                e.stopPropagation();
                playPondFeedingChime();
                alert(`👶 ลูกปลาคราฟตัวน้อยแสนซนของ ${fish.parents[0]} และ ${fish.parents[1]} กำลังแหวกว่ายอย่างสนุกสนานในบ่อค๊า! 💖`);
            });
        } else {
            fishEl.innerHTML = `
                <div class="koi-nametag">${fish.name} (${fish.mbti})</div>
                <svg class="koi-svg" viewBox="0 0 80 40">
                    <!-- ครีบซ้าย -->
                    <path class="koi-fin koi-fin-left" d="M 30 10 C 15 5 10 15 25 18 Z" fill="${fish.spotColor1}" />
                    <!-- ครีบขวา -->
                    <path class="koi-fin koi-fin-right" d="M 30 30 C 15 35 10 25 25 22 Z" fill="${fish.spotColor1}" />
                    <!-- โครงสร้างลำตัว -->
                    <path class="koi-body" d="M 10 20 Q 30 2 60 20 Q 30 38 10 20 Z" fill="${fish.bodyColor}" stroke="${fish.spotColor1}" stroke-width="1.8" />
                    <!-- ลายจุดปลาคราฟ 1 -->
                    <ellipse cx="28" cy="16" rx="11" ry="6.5" fill="${fish.spotColor1}" transform="rotate(-15 28 16)" />
                    <!-- ลายจุดปลาคราฟ 2 -->
                    <ellipse cx="44" cy="22" rx="7.5" ry="5.5" fill="${fish.spotColor2}" />
                    <!-- ลายจุดปลาคราฟ 3 -->
                    <ellipse cx="18" cy="21" rx="5.5" ry="4" fill="${fish.spotColor1}" />
                    <!-- หางปลาคราฟดุ๊กดิ๊ก -->
                    <path class="koi-tail" d="M 60 20 C 70 14 80 8 74 20 C 80 32 70 26 60 20 Z" fill="${fish.spotColor1}" />
                    <!-- ตาปลาทั้งสองข้าง -->
                    <circle cx="14" cy="15" r="1.5" fill="#333" />
                    <circle cx="14" cy="25" r="1.5" fill="#333" />
                </svg>
            `;
            
            // ผูกการคลิกที่ปลาเพื่อดูประวัติ MBTI ของเพื่อน
            fishEl.addEventListener("click", (e) => {
                e.stopPropagation();
                showKoiMbtiDetails(fish.member);
                
                // แอนิเมชันเด้งรับการคลิก
                fishEl.style.transform = `scale(1.25) rotate(${fish.angle * (180 / Math.PI)}deg)`;
                setTimeout(() => {
                    fishEl.style.transform = `scale(1) rotate(${fish.angle * (180 / Math.PI)}deg)`;
                }, 250);
            });
        }

        pond.appendChild(fishEl);
        fish.element = fishEl;
    });

    // ดักการคลิกพื้นผิวบ่อเพื่อหย่อนอาหารได้ด้วย
    pond.addEventListener("click", (e) => {
        if (e.target === pond || e.target.className === "pond-bubble" || e.target.classList.contains("koi-food")) {
            dropKoiFood(e);
        }
    });

    // เริ่มทำงานลูปฟิสิกส์แอนิเมชันปลา
    if (koiAnimationId) {
        cancelAnimationFrame(koiAnimationId);
    }
    koiAnimationId = requestAnimationFrame(updateKoiPondPhysics);
}

// 16.5 POND AQUATIC PLANTS & LILY PADS GENERATOR
function createPondPlants(pond) {
    // 1. สร้างกอสาหร่าย/พืชน้ำ (Seaweed clusters) พลิ้วไหว แบบหลากสีสัน (พืชทะเล)
    const plantPositions = [
        { left: "5%", height: "135px", delay: "0s", color1: "#2E7D32", color2: "#4CAF50", color3: "#81C784" },   // Green Seaweed
        { left: "22%", height: "110px", delay: "1.5s", color1: "#8E24AA", color2: "#BA68C8", color3: "#E1BEE7" }, // Purple/Lavender Seaweed
        { left: "38%", height: "95px", delay: "0.8s", color1: "#00796B", color2: "#009688", color3: "#4DB6AC" },  // Turquoise Seaweed
        { left: "54%", height: "125px", delay: "2.3s", color1: "#E65100", color2: "#FF9800", color3: "#FFE082" }, // Golden/Orange Seaweed
        { left: "68%", height: "130px", delay: "0.5s", color1: "#D81B60", color2: "#FF4081", color3: "#FF80AB" }, // Pink Coral Seaweed
        { left: "86%", height: "145px", delay: "1.9s", color1: "#1B5E20", color2: "#388E3C", color3: "#66BB6A" }  // Emerald Seaweed
    ];
    
    plantPositions.forEach((pos, idx) => {
        const plant = document.createElement("div");
        plant.className = `pond-plant pond-plant-${idx}`;
        plant.style.left = pos.left;
        plant.style.height = pos.height;
        plant.style.animationDelay = pos.delay;
        
        plant.innerHTML = `
            <svg viewBox="0 0 50 120" style="width:100%; height:100%; pointer-events:none;">
                <path d="M 20 120 Q 5 80 15 40 Q 25 15 15 0 Q 10 15 5 40 Q 15 80 20 120 Z" fill="${pos.color1}" opacity="0.75" />
                <path d="M 25 120 Q 15 70 30 35 Q 40 10 25 0 Q 15 10 15 35 Q 25 70 25 120 Z" fill="${pos.color2}" opacity="0.9" />
                <path d="M 30 120 Q 45 90 35 60 Q 25 30 35 5 Q 40 30 30 60 Q 35 90 30 120 Z" fill="${pos.color3}" opacity="0.65" />
            </svg>
        `;
        pond.appendChild(plant);
    });

    // 2. สร้างปะการัง/ดอกไม้ทะเลสีสันสดใสที่ก้นบ่อ (Bottom Sea Corals & Anemones)
    const corals = [
        { left: "14%", bottom: "-8px", width: "70px", height: "50px", color: "#FF5E82", delay: "0.2s" }, // Coral Red
        { left: "47%", bottom: "-10px", width: "80px", height: "60px", color: "#9C27B0", delay: "1.1s" }, // Royal Purple
        { left: "73%", bottom: "-5px", width: "65px", height: "45px", color: "#FF9800", delay: "0.7s" }  // Golden Orange
    ];
    
    corals.forEach((coral, idx) => {
        const coralEl = document.createElement("div");
        coralEl.className = `pond-coral coral-${idx}`;
        coralEl.style.left = coral.left;
        coralEl.style.bottom = coral.bottom;
        coralEl.style.width = coral.width;
        coralEl.style.height = coral.height;
        coralEl.style.position = "absolute";
        coralEl.style.zIndex = "2"; // behind fish, in front of seaweed
        coralEl.style.pointerEvents = "none";
        coralEl.style.animation = "swayPlant 5s infinite alternate ease-in-out";
        coralEl.style.animationDelay = coral.delay;
        
        coralEl.innerHTML = `
            <svg viewBox="0 0 80 60" style="width:100%; height:100%;">
                <!-- Branching Coral Shapes -->
                <path d="M 40 60 C 35 45, 20 40, 25 25 C 28 15, 38 25, 40 10 C 42 25, 52 15, 55 25 C 60 40, 45 45, 40 60 Z" fill="${coral.color}" opacity="0.95" />
                <path d="M 20 60 C 15 50, 5 45, 10 35 C 13 28, 20 35, 25 60 Z" fill="${coral.color}" opacity="0.85" />
                <path d="M 60 60 C 65 50, 75 45, 70 35 C 67 28, 60 35, 55 60 Z" fill="${coral.color}" opacity="0.85" />
                <!-- Cute Coral details -->
                <circle cx="40" cy="22" r="2.5" fill="#FFF" opacity="0.5" />
                <circle cx="28" cy="30" r="2" fill="#FFF" opacity="0.5" />
                <circle cx="52" cy="30" r="2" fill="#FFF" opacity="0.5" />
                <circle cx="13" cy="40" r="1.5" fill="#FFF" opacity="0.5" />
                <circle cx="67" cy="40" r="1.5" fill="#FFF" opacity="0.5" />
            </svg>
        `;
        pond.appendChild(coralEl);
    });

    // 3. สร้างใบบัวลอยน้ำ (Floating Lily Pads) และดอกบัวบานหลากสีสัน (Multi-colored Lotus Flowers)
    const lilies = [
        { left: "12%", top: "15%", size: "50px", delay: "0s", hasFlower: true, c1: "#FF4081", c2: "#FF80AB", c3: "#FF1744" }, // Pink Lotus
        { left: "32%", top: "28%", size: "38px", delay: "4s", hasFlower: false },
        { left: "55%", top: "10%", size: "45px", delay: "2s", hasFlower: true, c1: "#E040FB", c2: "#EA80FC", c3: "#D500F9" }, // Purple Lotus
        { left: "75%", top: "22%", size: "55px", delay: "1s", hasFlower: true, c1: "#FFB300", c2: "#FFE082", c3: "#FF8F00" }, // Yellow/Orange Lotus
        { left: "90%", top: "15%", size: "40px", delay: "3s", hasFlower: false }
    ];

    lilies.forEach((lily, idx) => {
        const pad = document.createElement("div");
        pad.className = `floating-lily lily-${idx}`;
        pad.style.left = lily.left;
        pad.style.top = lily.top;
        pad.style.width = lily.size;
        pad.style.height = lily.size;
        pad.style.animationDelay = lily.delay;

        let flowerHtml = "";
        if (lily.hasFlower) {
            flowerHtml = `
                <g transform="translate(10, 10) scale(0.6)">
                    <path d="M 20 20 C 10 5, 30 5, 20 20" fill="${lily.c1}" />
                    <path d="M 20 20 C 5 10, 15 5, 20 20" fill="${lily.c2}" />
                    <path d="M 20 20 C 35 10, 25 5, 20 20" fill="${lily.c2}" />
                    <path d="M 20 20 C 12 12, 12 2, 20 20" fill="${lily.c3}" />
                    <path d="M 20 20 C 28 12, 28 2, 20 20" fill="${lily.c3}" />
                    <path d="M 20 20 C 20 10, 20 0, 20 20" fill="#FFF" />
                    <circle cx="20" cy="18" r="3.5" fill="#FFD54F" />
                </g>
            `;
        }

        pad.innerHTML = `
            <svg viewBox="0 0 40 40" style="width:100%; height:100%; pointer-events:none;">
                <path d="M 20 20 C 20 20, 26 8, 38 12 C 45 25, 35 38, 20 38 C 5 38, 0 25, 5 12 C 14 8, 20 20, 20 20 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1" />
                <path d="M 20 20 L 32 15" stroke="#81C784" stroke-width="0.6" />
                <path d="M 20 20 L 28 32" stroke="#81C784" stroke-width="0.6" />
                <path d="M 20 20 L 10 30" stroke="#81C784" stroke-width="0.6" />
                <path d="M 20 20 L 8 16" stroke="#81C784" stroke-width="0.6" />
                ${flowerHtml}
            </svg>
        `;
        pond.appendChild(pad);
    });
}

// 17. POND WATER BUBBLES GENERATOR
function createPondBubble(pond, randomStartHeight = false) {
    const bubble = document.createElement("div");
    bubble.className = "pond-bubble";
    
    const size = Math.random() * 8 + 4;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const w = pond.clientWidth || 800;
    bubble.style.left = `${Math.random() * w}px`;
    
    if (randomStartHeight) {
        const h = pond.clientHeight || 480;
        bubble.style.top = `${Math.random() * h}px`;
    } else {
        bubble.style.bottom = "-20px";
    }
    
    bubble.style.animationDuration = `${6 + Math.random() * 6}s`;
    bubble.style.animationDelay = `${Math.random() * 2}s`;
    
    bubble.addEventListener("animationend", () => {
        bubble.remove();
        if (isKoiPondActive) {
            createPondBubble(pond, false);
        }
    });
    
    pond.appendChild(bubble);
}

// 18. DROP FISH FOOD (ฟังก์ชันหย่อนอาหารปลา)
function dropKoiFood(e) {
    const pond = document.getElementById("koiPondWater");
    if (!pond) return;

    const foodEl = document.createElement("div");
    foodEl.className = "koi-food";
    
    const rect = pond.getBoundingClientRect();
    let foodX = Math.random() * (rect.width - 40) + 20;
    let foodY = 10;
    
    if (e && e.clientX && e.clientY) {
        // หยดลงจุดที่ผู้ใช้คลิกโดยตรง
        foodX = e.clientX - rect.left;
        foodY = e.clientY - rect.top;
    }
    
    foodEl.style.left = `${foodX}px`;
    foodEl.style.top = `${foodY}px`;
    
    pond.appendChild(foodEl);
    
    koiFoodList.push({
        x: foodX,
        y: foodY,
        targetY: rect.height - 15, // ก้นบ่อ
        element: foodEl
    });
    
    // บี๊บเสียงสั้นๆ เพื่อให้ความรู้สึกน่ารักของการป้อน
    playSynthBeep();
}

// 19. FEEDING SFX SYNTH (เสียงฟองน้ำบับเบิ้ลขณะปลาฮุบกิน)
function playPondFeedingChime() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
    
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.12);
}

// 20. FLOATING POP LOVE HEART (หัวใจความรักลอยฟองเมื่อกินเสร็จ)
function createFloatingLove(pond, x, y) {
    const heart = document.createElement("div");
    heart.className = "floating-koi-love";
    heart.textContent = "❤️";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    pond.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1200);
}

// 21. SHOW KOI MBTI DETAILS (แสดงคู่มือรายปลาคราฟ)
function showKoiMbtiDetails(member) {
    const box = document.getElementById("koiMbtiDetailsBox");
    const nameText = document.getElementById("koiMbtiDetailName");
    const styleText = document.getElementById("koiMbtiDetailStyle");
    const workText = document.getElementById("koiMbtiDetailWork");
    const commText = document.getElementById("koiMbtiDetailComm");

    if (!box || !nameText) return;

    const profile = MBTI_PROFILES[member.mbti];
    if (profile) {
        nameText.innerHTML = `📚 คู่มือการสื่อสารของ ${member.name} (ฝ่าย${member.dept}) | MBTI: <span class="mbti-tag" style="margin-left: 2px;">${member.mbti}</span>`;
        styleText.textContent = profile.style || "-";
        workText.textContent = profile.workStyle || "-";
        commText.textContent = profile.communication || "-";
        box.style.display = "block";
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        box.style.display = "none";
    }
}

// 22. PHYSICS ANIMATION LOOP (ควบคุมทิศทางและการเคลื่อนที่ของฝูงปลา)
function updateKoiPondPhysics() {
    if (!isKoiPondActive) return;

    const pond = document.getElementById("koiPondWater");
    if (!pond) return;

    const w = pond.clientWidth || 800;
    const h = pond.clientHeight || 480;

    // 1. อัปเดตเม็ดอาหารที่หย่อนลงไป
    koiFoodList.forEach(food => {
        if (food.y < food.targetY) {
            food.y += 1.4; // ความเร็วการจมในน้ำ
            food.element.style.top = `${food.y}px`;
        }
    });

    // 2. อัปเดตปลาคราฟทั้งหมด (เต็มวัย + ลูกปลา)
    koiFishList.forEach(fish => {
        // คูลดาวน์การกิน
        if (fish.eatingCooldown > 0) {
            fish.eatingCooldown--;
        }
        
        // คูลดาวน์การผสมพันธุ์ (ปลาโตเต็มวัย)
        if (fish.breedCooldown && fish.breedCooldown > 0) {
            fish.breedCooldown--;
        }

        // ระบบควบคุมอายุนิเวศน์ของลูกปลาคราฟ
        if (fish.isBaby) {
            fish.age++;
            if (fish.age >= fish.maxAge && !fish.leaving) {
                fish.leaving = true;
                // สุ่มทิศทางการว่ายหนีออกขอบตลิ่ง
                const edge = Math.floor(Math.random() * 4);
                if (edge === 0) { fish.targetX = -100; fish.targetY = Math.random() * h; }
                else if (edge === 1) { fish.targetX = w + 100; fish.targetY = Math.random() * h; }
                else if (edge === 2) { fish.targetX = Math.random() * w; fish.targetY = -100; }
                else { fish.targetX = Math.random() * w; fish.targetY = h + 100; }
                fish.speed = 1.6; // เร่งความเร็วตอนว่ายออกไป
            }
        }

        let targetX = fish.targetX;
        let targetY = fish.targetY;
        
        let targetedFoodIndex = -1;
        let minDist = Infinity;

        // ค้นหาอาหารเม็ดที่ใกล้ที่สุด (ลูกปลาและปลาปกติหาอาหารเหมือนกัน)
        if (koiFoodList.length > 0 && !fish.leaving) {
            koiFoodList.forEach((food, idx) => {
                let dist = Math.hypot(food.x - fish.x, food.y - fish.y);
                if (dist < minDist) {
                    minDist = dist;
                    targetedFoodIndex = idx;
                }
            });
        }

        // ตรวจสอบการฮุบอาหารในประสาทสัมผัส
        if (targetedFoodIndex !== -1 && minDist < 250) {
            const food = koiFoodList[targetedFoodIndex];
            targetX = food.x;
            targetY = food.y;

            // ฮุบกินอาหารเมื่อประชิดตัว
            if (minDist < 18 && fish.eatingCooldown === 0) {
                food.element.remove();
                koiFoodList.splice(targetedFoodIndex, 1);
                
                playPondFeedingChime();
                createFloatingLove(pond, fish.x, fish.y - 20);
                
                fish.speed = fish.isBaby ? 2.8 : 2.4;
                fish.eatingCooldown = 40;
                
                fish.targetX = Math.random() * w;
                fish.targetY = Math.random() * h;
                return;
            }
        } else {
            // ความเร็วปกติ
            if (fish.speed > (fish.isBaby ? 1.5 : 1.2)) {
                fish.speed -= 0.04;
            } else {
                // ความเร็วธรรมชาติ
                if (fish.isBaby) {
                    fish.speed = 1.0 + Math.random() * 0.4;
                } else {
                    fish.speed = 0.8 + (fish.id.charCodeAt(0) % 5) * 0.12;
                }
            }

            // ถ้าใกล้ถึงเป้าหมาย หรือว่ายนานไป ให้สุ่มจุดหมายใหม่
            let distToTarget = Math.hypot(fish.targetX - fish.x, fish.targetY - fish.y);
            if (distToTarget < 30 || Math.random() < 0.006) {
                if (!fish.leaving) {
                    fish.targetX = Math.random() * (w - 120) + 60;
                    fish.targetY = Math.random() * (h - 120) + 60;
                }
            }
        }

        // คำนวณแรงแยกฝูง (Separation Force - Craig Reynolds) ป้องกันปลากองทับกัน
        let sepX = 0;
        let sepY = 0;
        koiFishList.forEach(other => {
            if (other.id === fish.id) return;
            let dist = Math.hypot(other.x - fish.x, other.y - fish.y);
            const minAllowedDist = (fish.isBaby || other.isBaby) ? 25 : 38;
            if (dist > 0 && dist < minAllowedDist) {
                let force = (minAllowedDist - dist) / minAllowedDist;
                // ดันออกจากกัน
                sepX += ((fish.x - other.x) / dist) * force * 0.8;
                sepY += ((fish.y - other.y) / dist) * force * 0.8;
            }
        });

        // คำนวณมุมเลี้ยวตามตรรกะ Steering
        let targetAngle = Math.atan2(targetY - fish.y, targetX - fish.x);
        let angleDiff = targetAngle - fish.angle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        
        // เลี้ยวช้าหรือเร็วขึ้นอยู่กับความหนาแน่นและสถานะปลา
        fish.angle += angleDiff * 0.05;

        // เวกเตอร์การว่าย = ทิศทางหลัก + แรงดันแยกฝูง
        let vx = Math.cos(fish.angle) * fish.speed + sepX;
        let vy = Math.sin(fish.angle) * fish.speed + sepY;

        // หมุนตัวตามเวกเตอร์จริง
        fish.angle = Math.atan2(vy, vx);

        fish.x += vx;
        fish.y += vy;

        // ขอบกั้นตลิ่งสี่ทิศ (เฉพาะปลาที่ไม่ได้กำลังว่ายออกจากบ่อ)
        if (!fish.leaving) {
            if (fish.x < 30) { fish.x = 30; fish.targetX = w / 2; }
            if (fish.x > w - 30) { fish.x = w - 30; fish.targetX = w / 2; }
            if (fish.y < 30) { fish.y = 30; fish.targetY = h / 2; }
            if (fish.y > h - 30) { fish.y = h - 30; fish.targetY = h / 2; }
        }

        // เช็กถ้าปลาจางหายหรือหลุดจอ
        if (fish.isBaby && fish.leaving) {
            const isOffscreen = fish.x < -80 || fish.x > w + 80 || fish.y < -80 || fish.y > h + 80;
            const isFaded = fish.element && parseFloat(fish.element.style.opacity) <= 0.05;
            if (isOffscreen || isFaded) {
                if (fish.element) fish.element.remove();
                fish.toBeRemoved = true;
            }
        }

        // วาดภาพปลาอัปเดตแกน CSS
        if (fish.element) {
            fish.element.style.left = `${fish.x - 37.5}px`;
            fish.element.style.top = `${fish.y - 22.5}px`;
            
            const rotationDeg = fish.angle * (180 / Math.PI);
            if (fish.isBaby) {
                if (fish.leaving) {
                    let opacity = parseFloat(fish.element.style.opacity || "1");
                    opacity = Math.max(0, opacity - 0.012);
                    fish.element.style.opacity = opacity;
                }
                fish.element.style.transform = `scale(0.35) rotate(${rotationDeg}deg)`;
            } else {
                fish.element.style.transform = `rotate(${rotationDeg}deg)`;
            }
        }
    });

    // 3. ระบบการรักกันมีลูกปลาตามธรรมชาติ (Breeding System)
    const maxBabies = 5;
    const currentBabies = koiFishList.filter(f => f.isBaby).length;
    
    if (currentBabies < maxBabies) {
        for (let i = 0; i < koiFishList.length; i++) {
            const fishA = koiFishList[i];
            if (fishA.isBaby || (fishA.breedCooldown && fishA.breedCooldown > 0)) continue;
            
            for (let j = i + 1; j < koiFishList.length; j++) {
                const fishB = koiFishList[j];
                if (fishB.isBaby || (fishB.breedCooldown && fishB.breedCooldown > 0)) continue;
                
                // ถ้าระยะห่างของปลาสองตัวใกล้กัน (ผสมพันธุ์)
                let dist = Math.hypot(fishB.x - fishA.x, fishB.y - fishA.y);
                if (dist < 42) {
                    // โอกาสเกิดลูกปลาคราฟ (สูงขึ้นเมื่ออยู่ในโหมดได้กินอาหาร)
                    let breedChance = 0.0003;
                    if (fishA.eatingCooldown > 0 || fishB.eatingCooldown > 0) {
                        breedChance = 0.0035; // กระตุ้นการผสมพันธุ์หลังกินอิ่ม
                    }
                    
                    if (Math.random() < breedChance) {
                        spawnBabyKoi(pond, fishA, fishB);
                        break; // ออกจากลูปเพื่อไปกำเนิดทีละตัว
                    }
                }
            }
        }
    }

    // 4. ล้างลูกปลาที่ออกเดินทางแล้วออกจากลิสต์อาร์เรย์
    koiFishList = koiFishList.filter(fish => !fish.toBeRemoved);

    koiAnimationId = requestAnimationFrame(updateKoiPondPhysics);
}

function spawnBabyKoi(pond, parentA, parentB) {
    parentA.breedCooldown = 1500; // ~25 วินาทีคูลดาวน์
    parentB.breedCooldown = 1500;
    
    const babyId = `baby_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // ผสมสีพันธุกรรมของพ่อกับแม่
    const spotColor1 = parentA.spotColor1;
    const spotColor2 = parentB.spotColor1;
    
    const baby = {
        id: babyId,
        isBaby: true,
        name: `ลูกปลาของ ${parentA.name} & ${parentB.name}`,
        parents: [parentA.name, parentB.name],
        x: (parentA.x + parentB.x) / 2,
        y: (parentA.y + parentB.y) / 2,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        speed: 1.1 + Math.random() * 0.5,
        targetX: Math.random() * pond.clientWidth,
        targetY: Math.random() * pond.clientHeight,
        bodyColor: "#FFFFFF",
        spotColor1: spotColor1,
        spotColor2: spotColor2,
        element: null,
        eatingCooldown: 0,
        age: 0,
        maxAge: 3600 + Math.random() * 3600, // 60-120 วินาที
        leaving: false
    };
    
    koiFishList.push(baby);
    
    // สร้าง DIV Element
    const fishEl = document.createElement("div");
    fishEl.className = "koi-fish-element koi-baby";
    fishEl.id = `koiFish_${baby.id}`;
    fishEl.style.transform = `scale(0.35)`;
    fishEl.style.opacity = "1";
    
    fishEl.innerHTML = `
        <div class="koi-nametag" style="background: rgba(255, 182, 193, 0.95); border-color: #FF69B4; font-size: 8px; color: #D81B60; padding: 1px 4px;">ลูกปลา ${parentA.name} & ${parentB.name} 💖</div>
        <svg class="koi-svg" viewBox="0 0 80 40">
            <!-- ครีบซ้าย -->
            <path class="koi-fin koi-fin-left" d="M 30 10 C 15 5 10 15 25 18 Z" fill="${baby.spotColor1}" />
            <!-- ครีบขวา -->
            <path class="koi-fin koi-fin-right" d="M 30 30 C 15 35 10 25 25 22 Z" fill="${baby.spotColor1}" />
            <!-- โครงสร้างลำตัว -->
            <path class="koi-body" d="M 10 20 Q 30 2 60 20 Q 30 38 10 20 Z" fill="${baby.bodyColor}" stroke="${baby.spotColor1}" stroke-width="1.8" />
            <!-- ลายจุดปลาคราฟ 1 -->
            <ellipse cx="28" cy="16" rx="11" ry="6.5" fill="${baby.spotColor1}" transform="rotate(-15 28 16)" />
            <!-- ลายจุดปลาคราฟ 2 -->
            <ellipse cx="44" cy="22" rx="7.5" ry="5.5" fill="${baby.spotColor2}" />
            <!-- ลายจุดปลาคราฟ 3 -->
            <ellipse cx="18" cy="21" rx="5.5" ry="4" fill="${baby.spotColor1}" />
            <!-- หางปลาคราฟดุ๊กดิ๊ก -->
            <path class="koi-tail" d="M 60 20 C 70 14 80 8 74 20 C 80 32 70 26 60 20 Z" fill="${baby.spotColor1}" />
            <!-- ตาปลาทั้งสองข้าง -->
            <circle cx="14" cy="15" r="1.5" fill="#333" />
            <circle cx="14" cy="25" r="1.5" fill="#333" />
        </svg>
    `;
    
    fishEl.addEventListener("click", (e) => {
        e.stopPropagation();
        playPondFeedingChime();
        alert(`👶 ลูกปลาคราฟตัวน้อยแสนซนของ ${parentA.name} และ ${parentB.name} กำลังแหวกว่ายอย่างสนุกสนานในบ่อค๊า! 💖`);
    });
    
    pond.appendChild(fishEl);
    baby.element = fishEl;
    
    // พ่นฟองหัวใจขึ้นผิวน้ำ 3 ฟองเพื่อฉลอง
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            if (isKoiPondActive) {
                createFloatingLove(pond, baby.x + (Math.random() - 0.5) * 16, baby.y - 15 - Math.random() * 10);
            }
        }, i * 250);
    }
}

