// data.js - ระบบฐานข้อมูลและวิเคราะห์คำปรึกษาฮีลใจสำหรับ House of Love

// รายชื่อสมาชิก กน. ทั้ง 16 คน พร้อมข้อมูลเริ่มต้นตามรูปภาพจริง
const INITIAL_MEMBERS = [
    {
        id: "prim",
        name: "PRIM",
        role: "ประธานคณะกรรมการนักศึกษา",
        dept: "บริหาร",
        mbti: "ENFJ",
        items: ["คอมพิวเตอร์", "เมาส์ปากกา", "กระติกน้ำร้อน"],
        avatarColor: "#FBC4D2",
        textColor: "#5C3A21"
    },
    {
        id: "dell",
        name: "DELL",
        role: "รองประธานคณะกรรมการนักศึกษา",
        dept: "บริหาร",
        mbti: "ENFJ",
        items: ["สมุดโน้ต", "ปากกาไฮไลท์", "กล้องฟิล์ม"],
        avatarColor: "#D0E8FF",
        textColor: "#2B4C7E"
    },
    {
        id: "angoon",
        name: "ANGOON",
        role: "เลขานุการ",
        dept: "บริหาร",
        mbti: "INTJ",
        items: ["ยาดม", "ลูกอม", "ไอแพด"],
        avatarColor: "#FFFDF9",
        textColor: "#5C3A21"
    },
    {
        id: "tongteng",
        name: "TONGTENG",
        role: "หัวหน้าฝ่ายประเมินและพัฒนา",
        dept: "เลขาและประเมิน",
        mbti: "ENFJ",
        items: ["น้ำหวาน", "หูฟัง", "ยาดม"],
        avatarColor: "#FBC4D2",
        textColor: "#5C3A21"
    },
    {
        id: "view",
        name: "VIEW",
        role: "หัวหน้าฝ่ายงบประมาณ",
        dept: "บัญชี",
        mbti: "INTP",
        items: ["หมวกแก๊ปสีดำ", "หูฟังสีดำ", "แว่นสายตา"],
        avatarColor: "#E2F0D9",
        textColor: "#385723"
    },
    {
        id: "khim",
        name: "KHIM",
        role: "กรรมการฝ่ายงบประมาณ",
        dept: "บัญชี",
        mbti: "ESFJ",
        items: ["กิ๊บดำ", "น้ำยาปรับผ้านุ่ม", "ขนมคลีน"],
        avatarColor: "#FFF2CC",
        textColor: "#7F6000"
    },
    {
        id: "stang",
        name: "STANG",
        role: "หัวหน้าฝ่ายประชาสัมพันธ์",
        dept: "PR",
        mbti: "INTP",
        items: ["โทรศัพท์", "ลิปสติก", "สเปรย์แอลกอฮอล์"],
        avatarColor: "#FCE4D6",
        textColor: "#C65911"
    },
    {
        id: "ruangrice",
        name: "RUANGRICE",
        role: "กรรมการฝ่ายประชาสัมพันธ์",
        dept: "PR",
        mbti: "INFJ",
        items: ["กิ๊บหนีบผม", "หูฟัง", "ร่ม"],
        avatarColor: "#F8CBAD",
        textColor: "#843C0C"
    },
    {
        id: "pe",
        name: "PE",
        role: "กรรมการฝ่ายประชาสัมพันธ์",
        dept: "PR",
        mbti: "INFP",
        items: ["หูฟัง", "ยางมัดผม", "ยาดมพาสเทล"],
        avatarColor: "#E1D5E7",
        textColor: "#6C5B7B"
    },
    {
        id: "frung",
        name: "FRUNG",
        role: "กรรมการฝ่ายประชาสัมพันธ์",
        dept: "PR",
        mbti: "INFP",
        items: ["ยาดม", "ลิป", "ยางรัดผม"],
        avatarColor: "#F8CBAD",
        textColor: "#843C0C"
    },
    {
        id: "aomsin",
        name: "AOMSIN",
        role: "หัวหน้าฝ่ายกิจกรรม",
        dept: "กิจกรรม",
        mbti: "ISFJ",
        items: ["คอนแทกเลนส์", "ยางมัดผม", "กระเป๋าเครื่องสำอาง"],
        avatarColor: "#FFF2CC",
        textColor: "#7F6000"
    },
    {
        id: "gundam",
        name: "GUNDAM",
        role: "กรรมการฝ่ายกิจกรรม",
        dept: "กิจกรรม",
        mbti: "INFP",
        items: ["ยาแก้แพ้", "ยาดม", "แว่นสายตา"],
        avatarColor: "#FFFDF9",
        textColor: "#5C3A21"
    },
    {
        id: "namwan",
        name: "NAMWAN",
        role: "หัวหน้าฝ่ายส่งเสริมวิชาการ",
        dept: "วิชาการ",
        mbti: "ENFP",
        items: ["เพื่อน", "โพสต์อิท", "ไฟล์สีพาสเทล"],
        avatarColor: "#D9E1F2",
        textColor: "#1F4E79"
    },
    {
        id: "rie",
        name: "RIE",
        role: "กรรมการฝ่ายส่งเสริมวิชาการ",
        dept: "วิชาการ",
        mbti: "INFJ",
        items: ["ยาดม", "สมุดบันทึก", "ยางรัดผม"],
        avatarColor: "#E2F0D9",
        textColor: "#385723"
    },
    {
        id: "meiw",
        name: "MEIW",
        role: "หัวหน้าฝ่ายสวัสดิการและสถานที่",
        dept: "สวัสดิการและสถานที่",
        mbti: "ENFP",
        items: ["ร่มพกพา", "น้ำสิงห์", "พัดลมพกพา"],
        avatarColor: "#FFFDF9",
        textColor: "#5C3A21"
    },
    {
        id: "kib",
        name: "KIB",
        role: "กรรมการฝ่ายสวัสดิการและสถานที่",
        dept: "สวัสดิการและสถานที่",
        mbti: "INFJ",
        items: ["ถุงผ้า", "ยาดม", "หูฟัง"],
        avatarColor: "#FFF2CC",
        textColor: "#7F6000"
    }
];

// ข้อมูลคู่มือวิเคราะห์สไตล์การทำงานและการสื่อสารราย MBTI
const MBTI_PROFILES = {
    "ENFJ": {
        style: "ผู้สร้างแรงบันดาลใจและนักซัพพอร์ตมืออาชีพ",
        workStyle: "มุ่งมั่นและทุ่มเทอย่างสูงเพื่อเป้าหมายของทีม กน. มักเป็นผู้นำที่ดึงเอาศักยภาพของเพื่อนๆ ออกมาได้ดีเยี่ยม แต่อาจมีแนวโน้มแบกรับความรับผิดชอบและความกังวลของทุกคนไว้คนเดียวจนลืมดูแลตัวเอง",
        communication: "ชอบพูดคุยด้วยความจริงใจและคำขอบคุณอย่างอบอุ่น ชื่นชมการทำงานร่วมกันอย่างสามัคคี หากจะตักเตือนควรพูดด้วยเหตุผลที่นุ่มนวลและไม่ละเลยความตั้งใจของเขา"
    },
    "INTJ": {
        style: "นักยุทธศาสตร์ผู้เงียบขรึมและรักสมบูรณ์แบบ",
        workStyle: "ทำงานอย่างมีระบบ ระเบียบแผนสูงมาก ชอบวิเคราะห์ปัญหาในภาพรวมและหาวิธีแก้แบบเด็ดขาด มีประสิทธิภาพสูง รักอิสระในการคิดและทำ",
        communication: "ชอบการสื่อสารที่ตรงประเด็น กระชับ มีเหตุมีผลรองรับ หลีกเลี่ยงการคุยเล่นที่ยาวเกินไปในเวลาทำงาน และควรเคารพพื้นที่ส่วนตัวของเขาอย่างสูง"
    },
    "INTP": {
        style: "นักคิดวิเคราะห์ผู้รักอิสระและไอเดียสร้างสรรค์",
        workStyle: "ชอบแก้ไขปัญหาที่ซับซ้อนด้วยตรรกะและนวัตกรรมแปลกใหม่ เก่งการวางกรอบแนวคิด แต่อาจจะรู้สึกเหนื่อยหน่ายหรือง่วงได้ง่ายกับงานรูทีนหรืองานเอกสารซ้ำซาก",
        communication: "ควรสื่อสารด้วยการแลกเปลี่ยนไอเดียกว้างๆ ให้อิสระแก่เขาในการหาคำตอบ ไม่ตีกรอบด้วยกฎเกณฑ์ที่เข้มงวดเกินไป และรับฟังตรรกะของเขาอย่างตั้งใจ"
    },
    "ESFJ": {
        style: "ผู้พิทักษ์ความสามัคคีและกาวใจประจำบ้าน",
        workStyle: "ชอบช่วยเหลือ ใส่ใจรายละเอียดเล็กๆ น้อยๆ จัดการงานพิธีการหรืองานประสานงานได้ดีเลิศ คอยสังเกตและดูแลสารทุกข์สุกดิบของเพื่อน กน. ทุกคนอยู่เสมอ",
        communication: "ชอบการสื่อสารที่เป็นมิตร สุภาพ เป็นกันเอง การไถ่ถามสารทุกข์สุกดิบ การชื่นชมความทุ่มเทใส่ใจของเขา และต้องการความรู้สึกว่าเขาเป็นส่วนสำคัญ of ทีม"
    },
    "INFJ": {
        style: "นักปราชญ์ผู้อ่อนโยนและเปี่ยมอุดมการณ์",
        workStyle: "ทำงานเบื้องหลังอย่างเงียบเชียบและมีเป้าหมายลึกซึ้ง ใส่ใจความรู้สึกและบรรยากาศในทีมเป็นอันดับแรก มีความเห็นอกเห็นใจสูง แต่อาจเก็บความเครียดไว้เงียบๆ จนไฟมอดได้ง่าย",
        communication: "ต้องการการสื่อสารที่จริงใจ ลึกซึ้ง และไม่ใช้อารมณ์ตัดสิน รับฟังความกังวลใจของเขาโดยไม่ขัดจังหวะ และย้ำเตือนให้เขาลดความกดดันในตนเองลงบ้าง"
    },
    "INFP": {
        style: "ผู้เยียวยาจิตใจและนักสร้างสรรค์โลกสวยงาม",
        workStyle: "ทำงานด้วยคุณค่าและความรู้สึกส่วนตัว มีจินตนาการสูง คอยเติมแต่งความน่ารักและสร้างสรรค์ให้กับทีม รักสงบ หลีกเลี่ยงความขัดแย้ง แต่อาจทำงานช้าลงเมื่อรู้สึกเครียดจัด",
        communication: "ควรสื่อสารด้วยคำพูดที่อ่อนโยน ให้เกียรติจินตนาการ หลีกเลี่ยงการใช้น้ำเสียงแข็งกร้าวหรือการบีบคั้นกดดันทางเวลาแบบกระชั้นชิด"
    },
    "ISFJ": {
        style: "ผู้ปิดทองหลังพระผู้ภักดีและละเอียดถี่ถ้วน",
        workStyle: "รับผิดชอบงานเบื้องหลังได้อย่างมั่นคง ไว้วางใจได้ 100% ละเอียดและจำข้อมูลเล็กๆ น้อยๆ ของทีมได้ดี มักปฏิเสธคำขอของคนอื่นไม่เป็นจนงานล้นมือ",
        communication: "ชอบการคุยด้วยน้ำเสียงอบอุ่นและสุภาพ ชื่นชมในสิ่งเล็กๆ ที่เขาช่วยทำให้ทีมเบื้องหลังอย่างจริงใจ และพยายามช่วยเหลือเมื่อเห็นเขากำลังแบกงานเงียบๆ"
    },
    "ENFP": {
        style: "นักสร้างสีสันและพลังบวกผู้จุดประกายความสุข",
        workStyle: "เต็มไปด้วยไอเดียสร้างสรรค์นับล้าน คอยแจกจ่ายพลังงานบวกและสร้างเสียงหัวเราะให้บ้านมีชีวิตชีวา ทำงานได้ดีเมื่อมีอิสระ แต่อาจมีปัญหากับการจัดระเบียบเอกสารหรือการทำโปรเจกต์ให้เสร็จตามกำหนด",
        communication: "ตอบรับการพูดคุยด้วยความสนุกสนานตื่นเต้น ยอมรับไอเดียแปลกใหม่ของเขา และคอยช่วยประคับประคองโฟกัสงานของเขาอย่างนุ่มนวล"
    }
};

// คลังคำคมฮีลใจและปลอบประโลมสำหรับส่งกำลังใจทำงาน
const HEALING_QUOTES = [
    "“ไม่ต้องพยายามเป็นคนที่เก่งที่สุดหรอกนะ แค่เป็นเธอในแบบที่สบายใจก็พอแล้วล่ะคนดี”",
    "“ในวันที่ท้องฟ้าครึ้มฝน จำไว้ว่าหลังก้อนเมฆสีเทานั้น ดวงอาทิตย์ยังคงส่องสว่างอยู่เสมอนะคะ”",
    "“เธอพยายามอย่างมากที่สุดแล้วนะในวันนี้ วางเรื่องเหนื่อยลงเถอะ ปล่อยให้หัวใจได้นอนหลับปุ๋ยนะคนเก่ง”",
    "“การได้พักผ่อนไม่ใช่ความอ่อนแอ แต่มันคือการรวบรวมพลังก้าวเดินต่อในวันพรุ่งนี้ต่างหากล่ะ”",
    "“งาน กน. มีวันหมดไป แต่หัวใจและรอยยิ้มของเธอต้องอยู่กับเธอตลอดไปนะ ดูแลใจตัวเองด้วยนะคะคนดี”",
    "“ไม่จำเป็นต้องรีบวิ่งหรอกนะ ค่อยๆ เดินไปด้วยกันก้าวเล็กๆ บ้านหลังนี้จะคอยระวังหลังให้เธอเอง”",
    "“ในแต่ละวันมีเรื่องเหนื่อยรุมเร้า แต่อย่าลืมบอกตัวเองในกระจกนะว่า 'วันนี้เธอเก่งมากแล้วนะ'”",
    "“หากไฟในใจเธอเริ่มริบหรี่ ให้เพื่อนข้างๆ กน. เป็นฟืนช่วยแบ่งปันไออุ่นให้เธอนะ เธอไม่ได้สู้เพียงลำพังหรอกค่ะ”",
    "“น้ำแก้วโตๆ นอนหลับยาวๆ และความใจดีต่อตัวเอง คือยารักษาใจที่ดีที่สุดในโลกเลยนะคนเก่ง”",
    "“ความผิดพลาดเป็นเรื่องธรรมดาของการเรียนรู้ มันไม่ได้ลดทอนความน่ารักในตัวเธอลงเลยสักนิดเดียว”"
];

// ตรวจเช็กว่า Log เกิดขึ้นในวันปฏิทินวันนี้หรือไม่
function isLogToday(logTimestamp) {
    const logDate = new Date(logTimestamp).toDateString();
    const todayDate = new Date().toDateString();
    return logDate === todayDate;
}

// หาดัชนีคะแนนพลังงานเฉลี่ยประจำวัน (วันนี้เท่านั้น) ของสมาชิกแต่ละคน
function getMemberDailyEnergy(memberId) {
    const logs = getLogs();
    const todayLogs = logs.filter(log => log.memberId === memberId && isLogToday(log.timestamp) && !log.clearedFromDaily);
    if (todayLogs.length === 0) {
        return null; // ยังไม่ได้เช็กอินวันนี้
    }
    const latestLog = todayLogs[todayLogs.length - 1];
    return {
        heartIndex: latestLog.heartIndex,
        fireIndex: latestLog.fireIndex,
        avgScore: latestLog.avgScore,
        moodEmoji: latestLog.moodEmoji,
        moodState: latestLog.moodState
    };
}

// รายการฝ่ายทั้งหมดใน กน. (รวมถึง ฝ่ายบริหาร)
const DEPARTMENTS = [
    "บริหาร",
    "เลขาและประเมิน",
    "บัญชี",
    "วิชาการ",
    "กิจกรรม",
    "สวัสดิการและสถานที่",
    "PR"
];

// คลังคำปรึกษาและความคิดเห็นระดับคะแนน (เมื่อคะแนนสรุปดัชนีใจ/ไฟอยู่ในช่วงต่างๆ)
const COUNSELING_TEMPLATES = {
    excellent: {
        title: "ระดับพลังใจแข็งแกร่ง ไฟลุกโชน! 🌟",
        comfort: "สุดยอดเลยคนเก่ง! วันนี้พลังใจเธอเต็มเปี่ยมและมีไฟพร้อมลุยงานสุดๆ ดีใจจังที่ได้เห็นเธอมีพลังในบ้านหลังนี้ด้วยกันนะ",
        advice: "ในช่วงที่พลังล้นแบบนี้ ลุยงานได้เต็มที่เลยค่ะ แต่อย่าลืมมองหาเพื่อนข้างๆ ที่อาจกำลังต้องการกำลังใจอยู่ หรือแอบชวนเพื่อนไปผ่อนคลายบ้างนะ และที่สำคัญ! อย่าลืมดื่มน้ำเยอะๆ และไม่หักโหมจนเกินไปนะคนเก่ง",
        action: "ลองชวนเพื่อนๆ ใน กน. ไปทำกิจกรรมน่ารักๆ หรือเปิดนัดหมาย 'แชร์พลังบวก' ในบอร์ดนัดหมายดูสิคะ เพื่อนๆ จะต้องได้รับพลังดีๆ จากเธอแน่นอนเลย!"
    },
    good: {
        title: "ใจยังสบาย ไฟกำลังพอดี ☀️",
        comfort: "ยินดีต้อนรับกลับบ้านนะคนดี... วันนี้พลังใจและไฟทำงานของเธอกำลังสมดุลและมั่นคงเลยล่ะ เรื่อยๆ สบายใจ ค่อยๆ ก้าวไปด้วยกันนะ",
        advice: "ประคองพลังระดับนี้ไว้ดีมากเลยค่ะ เดินไปตามความเร็วของตัวเอง ไม่ต้องรีบร้อนนะ ถ้าเจอปัญหาหรือเริ่มรู้สึกตึงๆ ตรงไหน ลองหยุดพักสายตาสัก 5 นาที หรือสูดหายใจลึกๆ ดูนะคะ",
        action: "หากวันนี้นึกอยากทำอะไรสนุกๆ ร่วมกัน ลองตั้งกระทู้นัดหมายคุยเล่นหรือทานของอร่อยๆ ในทีมหลังเลิกงานดูนะคะ"
    },
    tired: {
        title: "เริ่มเข้าสู่โหมดหน้าต่างเปียกฝน พลังงานแอบหดหาย 🌧️",
        comfort: "กอดๆ นะคะคนเก่ง... วันนี้ดูเหมือนว่าหัวใจหรือร่างกายของเธอจะแอบเริ่มล้าและโดนฝนซัดบ้างแล้วนะ ไม่เป็นไรเลยนะคะที่จะเหนื่อยบ้างหรือท้อบ้างในวันนี้",
        advice: "วางความรับผิดชอบไว้ตรงนี้สักครู่ แล้วหันกลับมาดูแลตัวเองก่อนนะคนดี ชาร้อนสักแก้ว นมเย็นสักกล่อง หรือการได้เอนหลังพักผ่อนจะช่วยเยียวยาได้เยอะเลยค่ะ ถ้างานไหนหนักเกินไป ลองปรึกษาและขอแรงเพื่อนในทีมช่วยแบ่งเบาดูนะ เธอไม่ต้องแบกมันไว้คนเดียวทั้งหมดหรอกนะรู้ไหม",
        action: "บอร์ดนัดหมายมีไว้เพื่อเธอเสมอนะ ลองไปตั้งโพสต์นัดขอกำลังใจ หรือชวนเพื่อน กน. ไปผ่อนคลายสั้นๆ ดูสิคะ เพื่อนๆ รอซัพพอร์ตเธออยู่เสมอเลยนะ"
    },
    burnout: {
        title: "ไฟมอดใจล้า ต้องการอ้อมกอดด่วนที่สุด! 🔥🌧️",
        comfort: "โอ๋ๆ นะคะคนดี... ลมพัดแรงจนไฟมอดไปใช่ไหมคะ? เข้ามากอดกันแน่นๆ นะ ตรงนี้เป็นพื้นที่ปลอดภัยที่สุดของเธอ และยินดีรับฟังทุกอย่างเลยนะ เธอเก่งและพยายามมาอย่างมากที่สุดแล้วล่ะ",
        advice: "ตอนนี้สิ่งที่เธอต้องการมากที่สุดคือ 'การหยุดพัก' อย่างจริงจังค่ะ ขอวางเรื่องงาน กน. ลงชั่วคราวเลยนะคนเก่ง ปล่อยให้หัวใจได้หายใจและเยียวยาตัวเองก่อน ไม่มีอะไรสำคัญไปกว่าสุขภาพจิตและสุขภาพกายของเธอเลยค่ะ พูดคุยระบายความรู้สึกกับคนที่ไว้ใจ หรือให้ฝ่ายประเมินและฝ่ายบริหารช่วยซัพพอร์ตเธอในเรื่องภาระงานนะ",
        action: "ด่วนที่สุดเลยนะคนดี! ลองตั้งโพสต์ในบอร์ดนัดหมายเพื่อขอคำปรึกษา ขอกอด หรือนัดเพื่อนคุยคลายเครียดแบบไม่มีเรื่องงานมาเกี่ยว หรือทักไปหาประธาน รองประธาน หรือพี่ๆ เพื่อนๆ ในทีมด่วนเลยนะ ทุกคนรักและห่วงใยเธอมากๆ เลยค่ะ"
    }
};

// ระบบตรวจจับความรู้สึกและอารมณ์จากข้อความปลายเปิด (Venting Text NLP Sentiment Analyzer)
function analyzeVentingText(text) {
    if (!text || text.trim() === "") {
        return {
            sentiment: "neutral",
            emotion: "neutral",
            emotionText: "เล่าเรื่องทั่วไป / กลางๆ ☀️",
            color: "#90A4AE",
            counsel: "ขอบคุณที่มาร่วมบอกเล่าเรื่องราวในวันนี้ให้ฉันฟังนะคะ ทุกข้อความและความรู้สึกของเธอเป็นสิ่งที่มีค่าเสมอ ขอให้ก้าวต่อไปอย่างมั่นคงและมีความสุขในแบบของตัวเองนะคะ ฉันคอยส่งกำลังใจให้เธออยู่ตรงนี้เสมอนะคะคนเก่ง"
        };
    }

    const lowerText = text.toLowerCase();

    // 1. คลังคำนิยามแยกตามอารมณ์และระดับน้ำหนักคะแนน
    const emotionDict = {
        burnout: {
            name: "เหนื่อยล้า / หมดไฟ 🌧️",
            color: "#FFA726",
            keywords: ["เหนื่อย", "ล้า", "ท้อ", "หมดแรง", "ไม่ไหว", "ง่วง", "นอนน้อย", "เพลีย", "หมดพลัง", "หมดไฟ", "ล้า", "ถอดใจ", "ขี้เกียจ", "ไม่อยากทำ", "พอแล้ว", "ขยาด", "ภาระ", "เพลีย", "เบลอ"],
            counsel: "ฉันรับรู้ได้ถึงความเหนื่อยล้าทางกายและทางใจที่แสนสาหัสผ่านตัวหนังสือของเธอนะคนเก่ง... เธอพยายามและแบกรับอะไรไว้มากมายจริงๆ ร่างกายและจิตใจเราไม่ใช่เครื่องจักรนะ มีขีดจำกัดและต้องการการดูแลรักษาใจ ลองอนุญาตให้ตัวเองได้ 'หยุดพัก' จริงๆ โดยไม่ต้องรู้สึกผิดดูนะคะ วางความสมบูรณ์แบบลงก่อน คืนนี้ลองนอนหลับปุ๋ยยาวๆ ชาร์จพลังแบตเตอรี่ในหัวใจให้ฟื้นฟูก่อนนะค๊า"
        },
        anxiety: {
            name: "เคร่งเครียด / กังวล 🌪️",
            color: "#FF7043",
            keywords: ["เครียด", "กดดัน", "กังวล", "คิดมาก", "ฟุ้งซ่าน", "กลัว", "ตื่นตระหนก", "สับสน", "อึดอัด", "หนักหัว", "วุ่นวายใจ", "แพนิค", "ระแวง", "ตึง", "เครียดมาก", "เครียดสะสม"],
            counsel: "ดูเหมือนว่าตอนนี้ความกังวลและความกดดันกำลังล้อมรอบตัวเธอจนรู้สึกตึงและอึดอัดใจไปหมดใช่ไหมคะ... ลมหายใจเข้าลึกๆ หายใจออกยาวๆ สูดลมหายใจช้าๆ นะคะ ปัญหาหรือภาระที่ดูยิ่งใหญ่ในตอนนี้ ลองซอยย่อยมันออกมาเป็นชิ้นเล็กๆ แล้วค่อยๆ ทำไปทีละจุดนะ ความผิดพลาดเกิดขึ้นได้เสมอและมันไม่ได้ลดทอนความเก่งของเธอลงเลย ทุกอย่างค่อยๆ แก้ไขไปด้วยกันร่วมกับเพื่อนๆ ในทีมนะคะ เธอมีพวกเราคอยซัพพอร์ตอยู่เสมอนะคนดี"
        },
        sadness: {
            name: "เศร้าใจ / ดิ่งหมอง 🌧️💔",
            color: "#EF5350",
            keywords: ["เศร้า", "ร้องไห้", "น้ำตา", "เสียใจ", "ผิดหวัง", "เจ็บ", "ดิ่ง", "หดหู่", "แย่", "หม่นหมอง", "ไม่อยากอยู่", "พัง", "เจ็บปวด", "น้อยใจ", "เหงาหงอย", "ร้องไห้หนักมาก", "เจ็บใจ", "เศร้าใจ"],
            counsel: "กอดเธอแน่นๆ นะคะคนเก่ง... การที่ใจโดนฝนซัดกระหน่ำจนรู้สึกเศร้าหรือดิ่งลงไปไม่ใช่เรื่องผิดเลยนะคะ หากเธอรู้สึกอยากร้องไห้ ปล่อยให้น้ำตาไหลระบายออกมาได้เลยนะ น้ำตาก็คือสบู่ที่คอยล้างทำความสะอาดให้คราบฝุ่นในหัวใจได้เบาบางลง การที่เธอบอกเล่าตรงนี้แสดงว่าเธอกำลังก้าวผ่านมันไปอย่างกล้าหาญ วางเรื่องทุกข์ใจไว้กับฉันสักครู่ แล้วหาสิ่งที่ทำให้รู้สึกปลอดภัย นมเย็นๆ สักแก้ว หรืออ้อมกอดอุ่นๆ ช่วยเยียวยาเธอได้นะ ตรงนี้มีพวกเราที่รักเธอคอยเป็นร่มกางกันฝนให้อยู่เสมอเลยนะคนดี"
        },
        loneliness: {
            name: "อ้างว้าง / โดดเดี่ยว 🌫️",
            color: "#AB47BC",
            keywords: ["เหงา", "คนเดียว", "โดดเดี่ยว", "ไม่มีใคร", "ไม่มีคนเข้าใจ", "ทิ้ง", "เมิน", "เว้งว้าง", "คว้าง", "ว่างเปล่า", "โดนลืม", "ละเลย", "ไม่มีเพื่อน", "เงียบเหงา"],
            counsel: "ความรู้สึกโดดเดี่ยวเหมือนยืนสู้คนเดียวท่ามกลางความมืดมันทำให้หัวใจหนาวเหน็บและว่างเปล่าเหลือเกินใช่ไหมคะ... แต่อย่าลืมมองมาที่บ้านหลังนี้นะคะ! ในบอร์ดนัดหมายหรือในแชทกลุ่มของพวกเรา มีเพื่อนๆ กน. อีก 15 คนที่ต่างเป็นห่วงและรักในความเป็นเธอเสมอนะ ลองส่งสัญญาณสะกิดเพื่อนสักนิด นัดกินข้าว ทานชาบู หรือขอกอดซ่อมแซมใจกันในบอร์ดนัดหมายดูนะคะ เธอไม่ได้อยู่ตัวคนเดียวในโลกที่กว้างใหญ่นี้หรอกนะคะ พวกเรายินดีโอบรับเธอด้วยความเต็มใจที่สุดเลยค่ะ"
        },
        anger: {
            name: "หงุดหงิด / ไม่พอใจ 🌋",
            color: "#E53935",
            keywords: ["โกรธ", "โมโห", "หงุดหงิด", "รำคาญ", "ไม่พอใจ", "เกลียด", "ชิ", "เบื่อ", "เซ็ง", "ห่วย", "แย่มาก", "ประชด", "หัวร้อน", "ขัดหูขัดตา", "ปรี๊ด"],
            counsel: "เมื่อมีความหงุดหงิดหรืออารมณ์ร้อนพุ่งพล่านขึ้นมา มันเป็นสัญญาณเตือนว่ามีบางสิ่งบางอย่างกำลังล้ำเส้นความสบายใจของเธอ หรือไม่เป็นไปตามที่ตั้งใจไว้นั่นเอง... ลองจิบน้ำเย็นๆ สักแก้ว สูดหายใจลึกๆ และเดินถอยออกมาเปลี่ยนบรรยากาศข้างนอกสักครู่นะคะ ปล่อยให้อารมณ์ร้อนได้ระเหยหายไปก่อน แล้วค่อยใช้เหตุผลมาทบทวนปัญหากับเพื่อนๆ ด้วยความถนอมน้ำใจกันนะค๊า บ้านเราเป็นกาวใจและพร้อมช่วยเหลือกันแก้ไขปัญหาเสมอค่ะคนเก่ง"
        },
        joy: {
            name: "มีความสุข / ใจฟู 🌈✨",
            color: "#4CAF50",
            keywords: ["ดีใจ", "มีความสุข", "แฮปปี้", "สนุก", "ขอบคุณ", "ยินดี", "รัก", "ใจฟู", "เย้", "สำเร็จ", "ผ่านฉลุย", "ยิ้มได้", "อบอุ่นใจ", "รักมาก", "ภูมิใจ", "ตื่นเต้น", "มีความสุขมาก"],
            counsel: "ว้าว! พลังใจฟูรอยยิ้มอันสดใสของเธอมันทะลุผ่านตัวหนังสือออกมาจนทำให้บ้านหลังนี้สว่างไสวขึ้นเยอะเลยค่ะ! ขอบคุณที่เป็นพลังความอบอุ่นและช่วยส่งต่อพลังงานดีๆ ให้กับครอบครัว กน. ของเรานะค๊า ดีใจจังที่ได้ร่วมงานและมีเธออยู่ข้างๆ ในบ้านหลังนี้ด้วยกัน ขอให้รอยยิ้มและความรู้สึกดีๆ นี้โอบล้อมเธอไปตลอดวัน และขอให้โปรเจกต์งาน กน. ของพวกเราก้าวหน้าด้วยรอยยิ้มแบบนี้เสมอไปนะค๊า รักเธอที่สุดเลยคนเก่ง!"
        }
    };

    // 2. คำนวณคะแนนตามคีย์เวิร์ด
    let scores = {
        burnout: 0,
        anxiety: 0,
        sadness: 0,
        loneliness: 0,
        anger: 0,
        joy: 0
    };

    // ลูปนับน้ำหนักความถี่คีย์เวิร์ด
    Object.keys(emotionDict).forEach(emotion => {
        const dict = emotionDict[emotion];
        dict.keywords.forEach(kw => {
            let index = lowerText.indexOf(kw);
            while (index !== -1) {
                scores[emotion] += 1;
                index = lowerText.indexOf(kw, index + kw.length);
            }
        });
    });

    // 3. หาอารมณ์เด่น
    let dominantEmotion = "neutral";
    let maxScore = 0;
    Object.keys(scores).forEach(emotion => {
        if (scores[emotion] > maxScore) {
            maxScore = scores[emotion];
            dominantEmotion = emotion;
        }
    });

    if (maxScore === 0) {
        return {
            sentiment: "neutral",
            emotion: "neutral",
            emotionText: "เล่าเรื่องทั่วไป / กลางๆ ☀️",
            color: "#90A4AE",
            counsel: "ขอบคุณที่มาร่วมระบายและบอกเล่าเรื่องราวในวันนี้ให้ฉันฟังนะคะ ทุกคำพูดของเธอเป็นสิ่งที่มีค่าเสมอ การได้ปลดปล่อยสิ่งต่างๆ ออกมาผ่านตัวอักษรจะช่วยให้สมองและหัวใจเธอเบาขึ้นนะ ขอให้ก้าวต่อไปอย่างมั่นคงและมีความสุขในวันนี้นะคะคนเก่ง ฉันคอยอยู่เคียงข้างส่งกำลังใจให้เธอเสมอตรงนี้ค๊า 🌟"
        };
    }

    const matched = emotionDict[dominantEmotion];
    return {
        sentiment: ["burnout", "anxiety", "sadness", "loneliness", "anger"].includes(dominantEmotion) ? "negative" : "positive",
        emotion: dominantEmotion,
        emotionText: matched.name,
        color: matched.color,
        counsel: matched.counsel
    };
}

// ระบบประมวลคะแนนและให้คำแนะนำแบบฮีลใจขั้นสุด
function generateCounselingReport(answers, ventingText, memberId) {
    // answers คืออาร์เรย์ตัวเลข 1-5 จำนวน 5 ข้อ
    const q1 = Number(answers[0]) || 3;
    const q2 = Number(answers[1]) || 3;
    const q3 = Number(answers[2]) || 3;
    const q4 = Number(answers[3]) || 3;
    const q5 = Number(answers[4]) || 3;

    // คำนวณดัชนีใจ (Heart Index %): Q2 + Q4 + (6 - Q3) -> คะแนนเต็ม 15, ต่ำสุด 3
    const heartScore = q2 + q4 + (6 - q3);
    const heartIndex = Math.round(((heartScore - 3) / 12) * 100);

    // คำนวณดัชนีไฟ (Fire Index %): Q5 + (6 - Q1) -> คะแนนเต็ม 10, ต่ำสุด 2
    const fireScore = q5 + (6 - q1);
    const fireIndex = Math.round(((fireScore - 2) / 8) * 100);

    // คำนวณดัชนีเฉลี่ยเพื่อจัดกลุ่มคำประเมิน
    const avgScore = (heartIndex + fireIndex) / 2;

    let evalKey = "good";
    let moodState = "เรื่อยๆ สบายดี";
    let moodEmoji = "☀️";
    
    if (avgScore >= 80) {
        evalKey = "excellent";
        moodState = "ท้องฟ้าสดใสหัวใจพองโต";
        moodEmoji = "🌈";
    } else if (avgScore >= 55) {
        evalKey = "good";
        moodState = "แดดส่องเบาๆ สบายดี";
        moodEmoji = "☀️";
    } else if (avgScore >= 35) {
        evalKey = "tired";
        moodState = "เริ่มมีเมฆครึ้มและฝนปรอย";
        moodEmoji = "🌧️";
    } else {
        evalKey = "burnout";
        moodState = "พายุฝนกระหน่ำไฟมอดสนิท";
        moodEmoji = "⚡🌧️";
    }

    const template = COUNSELING_TEMPLATES[evalKey];
    const sentimentResult = analyzeVentingText(ventingText);
    
    // รวมคะแนนแบบประเมินและน้ำหนักความรู้สึก (Joint Counseling Feedback)
    let finalComfort = template.comfort;
    let finalAdvice = template.advice;
    
    // หากคะแนนรวมออกมาดี แต่ข้อความที่ระบายประมวลผลได้เป็นอารมณ์ด้านลบ (ขัดแย้งกัน)
    if (sentimentResult.sentiment === "negative" && (evalKey === "excellent" || evalKey === "good")) {
        finalComfort = `💡 แม้ว่าแบบประเมินคะแนนรวมจะบอกว่าเธอสบายดี แต่ข้อความระบายใจของเธอแอบกระซิบว่าเธอกำลังกังวลหรือเหนื่อยอยู่ลึกๆ นะคะ... วางความเข้มแข็งของคนเก่งลงก่อนชั่วคราว เข้ามากอดกันแน่นๆ ตรงนี้น๊า ` + template.comfort;
    }
    
    // ดึงข้อมูลวิเคราะห์ MBTI และสุ่มคำฮีลใจ
    const members = getMembers();
    const member = members.find(m => m.id === memberId);
    const mbti = member ? member.mbti : null;
    const mbtiAnalysis = mbti ? MBTI_PROFILES[mbti] : null;
    const randomQuote = HEALING_QUOTES[Math.floor(Math.random() * HEALING_QUOTES.length)];

    return {
        heartIndex,
        fireIndex,
        avgScore,
        evalKey,
        moodState,
        moodEmoji,
        title: template.title,
        comfort: finalComfort,
        advice: finalAdvice,
        action: template.action,
        detectedEmotion: sentimentResult.emotionText,
        detectedEmotionColor: sentimentResult.color,
        storyCounsel: sentimentResult.counsel,
        mbtiAnalysis: mbtiAnalysis,
        mbti: mbti,
        randomQuote: randomQuote
    };
}

// LOCAL STORAGE MANAGEMENT

// 1. จัดการข้อมูลสมาชิก กน.
function getMembers() {
    const stored = localStorage.getItem("house_of_love_members");
    if (!stored) {
        localStorage.setItem("house_of_love_members", JSON.stringify(INITIAL_MEMBERS));
        return INITIAL_MEMBERS;
    }
    
    // ซิงก์ข้อมูลของสำคัญ 3 ชิ้นให้อัตโนมัติในกรณีที่เบราว์เซอร์ของผู้ใช้เก็บข้อมูลชุดเก่าไว้
    const storedList = JSON.parse(stored);
    let updated = false;
    storedList.forEach(storedMem => {
        const initMem = INITIAL_MEMBERS.find(m => m.id === storedMem.id);
        if (initMem) {
            if (!storedMem.items || !Array.isArray(storedMem.items)) {
                storedMem.items = initMem.items;
                updated = true;
            }
            if (!storedMem.avatarColor) {
                storedMem.avatarColor = initMem.avatarColor;
                updated = true;
            }
            if (!storedMem.textColor) {
                storedMem.textColor = initMem.textColor;
                updated = true;
            }
        }
    });
    
    if (updated) {
        localStorage.setItem("house_of_love_members", JSON.stringify(storedList));
    }
    
    return storedList;
}

function saveMembers(members) {
    localStorage.setItem("house_of_love_members", JSON.stringify(members));
    syncDatabase();
}

function resetMembers() {
    localStorage.setItem("house_of_love_members", JSON.stringify(INITIAL_MEMBERS));
    syncDatabase();
    return INITIAL_MEMBERS;
}

// 2. จัดการประวัติการประเมินใจ (Logs)
function getLogs() {
    const stored = localStorage.getItem("house_of_love_logs");
    const logs = stored ? JSON.parse(stored) : [];
    const lastCleared = parseInt(localStorage.getItem("house_of_love_logs_last_cleared") || "0", 10);
    return logs.filter(l => new Date(l.timestamp).getTime() > lastCleared);
}

function saveLog(memberId, answers, ventingText, isAnonymous) {
    const logs = getLogs();
    const members = getMembers();
    const member = members.find(m => m.id === memberId);
    
    const report = generateCounselingReport(answers, ventingText, memberId);
    
    const newLog = {
        id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        memberId: memberId,
        memberName: isAnonymous ? "สมาชิกนิรนาม" : (member ? member.name : "ไม่ระบุชื่อ"),
        memberRole: isAnonymous ? "กน.นิรนาม" : (member ? member.role : ""),
        memberDept: member ? member.dept : "ทั่วไป",
        answers: answers,
        ventingText: ventingText,
        isAnonymous: isAnonymous,
        heartIndex: report.heartIndex,
        fireIndex: report.fireIndex,
        avgScore: report.avgScore,
        moodEmoji: report.moodEmoji,
        moodState: report.moodState
    };
    
    logs.push(newLog);
    localStorage.setItem("house_of_love_logs", JSON.stringify(logs));
    syncDatabase();

    // ส่งแจ้งเตือน Telegram (เช็กอินสุขภาพใจ)
    const nameStr = isAnonymous ? "สมาชิกนิรนาม" : (member ? member.name : "ไม่ระบุชื่อ");
    const moodBadge = `${newLog.moodEmoji} ${newLog.moodState}`;
    const message = `🌸 <b>เช็กอินดูแลใจแบบเจาะลึก</b>\n` +
                    `👤 <b>ผู้ส่ง:</b> ${nameStr}\n` +
                    `❤️ <b>พลังใจ:</b> ${newLog.heartIndex}%\n` +
                    `🔥 <b>พลังไฟ:</b> ${newLog.fireIndex}%\n` +
                    `☁️ <b>สถานะอารมณ์:</b> ${moodBadge}\n` +
                    (ventingText ? `💬 <b>เรื่องระบายใจ:</b> "${escapeHtml(ventingText)}"` : ``);
    triggerTelegramNotification(message);

    return { log: newLog, report: report };
}

function saveQuickEnergyLog(memberId, energyPercent) {
    const logs = getLogs();
    const members = getMembers();
    const member = members.find(m => m.id === memberId);
    
    let moodState = "เรื่อยๆ สบายดี";
    let moodEmoji = "☀️";
    
    if (energyPercent >= 90) {
        moodState = "ท้องฟ้าสดใสหัวใจพองโต";
        moodEmoji = "🌈";
    } else if (energyPercent >= 70) {
        moodState = "แดดส่องเบาๆ สบายดี";
        moodEmoji = "☀️";
    } else if (energyPercent >= 40) {
        moodState = "เริ่มมีเมฆครึ้มและฝนปรอย";
        moodEmoji = "🌧️";
    } else {
        moodState = "พายุฝนกระหน่ำไฟมอดสนิท";
        moodEmoji = "⚡🌧️";
    }
    
    const newLog = {
        id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        memberId: memberId,
        memberName: member ? member.name : "ไม่ระบุชื่อ",
        memberRole: member ? member.role : "",
        memberDept: member ? member.dept : "ทั่วไป",
        answers: [3, 3, 3, 3, 3], // dummy answers
        ventingText: "",
        isAnonymous: false,
        heartIndex: energyPercent,
        fireIndex: energyPercent,
        avgScore: energyPercent,
        moodEmoji: moodEmoji,
        moodState: moodState
    };
    
    logs.push(newLog);
    localStorage.setItem("house_of_love_logs", JSON.stringify(logs));
    syncDatabase();

    // ส่งแจ้งเตือน Telegram (เช็กอินพลังงานด่วน)
    const moodBadge = `${newLog.moodEmoji} ${newLog.moodState}`;
    const message = `⚡ <b>เช็กอินพลังงานด่วน</b>\n` +
                    `👤 <b>ผู้ส่ง:</b> ${member ? member.name : "ไม่ระบุชื่อ"}\n` +
                    `💪 <b>ระดับพลังงาน:</b> ${energyPercent}%\n` +
                    `☁️ <b>สถานะจิตใจ:</b> ${moodBadge}`;
    triggerTelegramNotification(message);

    return newLog;
}

function clearLogs() {
    const now = Date.now();
    localStorage.setItem("house_of_love_logs_last_cleared", now.toString());
    localStorage.setItem("house_of_love_logs", JSON.stringify([]));
    syncDatabase();
}

// 3. จัดการบอร์ดนัดหมายฮีลใจ (Appointments)
const INITIAL_APPOINTMENTS = [
    {
        id: "appt_1",
        title: "นัดกินหมูกระทะหลังงานเลิก ล้อมวงบ่นเรื่องงานประธานรับเลี้ยง 🐷",
        creatorName: "PRIM",
        creatorDept: "บริหาร",
        dateTime: "เย็นวันศุกร์นี้ หลังเคลียร์งาน กน. เสร็จ",
        location: "ร้านหมูกระทะปิ้งย่างแถว ม.",
        description: "ใครเหนื่อยล้า พลังหดหาย มาชาร์จพลังด้วยสามชั้นเกรียมๆ กันนะค๊าาา พี่พริมจ่ายเองลุยเล้ยยย!",
        joined: ["PRIM", "DELL", "TONGTENG", "PE", "FRUNG"]
    },
    {
        id: "appt_2",
        title: "ขอกอดเงียบๆ 5 นาทีเพื่อชาร์จแบตเตอรี่หัวใจ 🧸",
        creatorName: "PE",
        creatorDept: "PR",
        dateTime: "ทุกวันตอน 4 โมงเย็น",
        location: "โซฟามุมห้องสโมสร กน.",
        description: "งานประชาสัมพันธ์มันจุกอก อยากขอกอดอุ่นๆ จากเพื่อนๆ หรือพี่ๆ ช่วยฮีลใจสั้นๆ หน่อยนะคะ งดคุยเรื่องงานน๊า",
        joined: ["PE", "RUANGRICE", "DELL", "AOMSIN", "MEIW"]
    }
];

function getAppointments() {
    const stored = localStorage.getItem("house_of_love_appts");
    if (!stored) {
        localStorage.setItem("house_of_love_appts", JSON.stringify(INITIAL_APPOINTMENTS));
        return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(stored);
}

function saveAppointment(title, creatorName, creatorDept, dateTime, location, description) {
    const appts = getAppointments();
    const newAppt = {
        id: "appt_" + Date.now(),
        title,
        creatorName,
        creatorDept,
        dateTime,
        location,
        description,
        joined: [creatorName]
    };
    appts.push(newAppt);
    localStorage.setItem("house_of_love_appts", JSON.stringify(appts));
    syncDatabase();

    // ส่งแจ้งเตือน Telegram (นัดหมายใหม่)
    const message = `📅 <b>นัดหมายฮีลใจใหม่ชวนเพื่อนๆ</b>\n` +
                    `📌 <b>หัวข้อ:</b> ${escapeHtml(title)}\n` +
                    `👤 <b>ชวนโดย:</b> ${creatorName} (${creatorDept})\n` +
                    `⏰ <b>เวลานัด:</b> ${escapeHtml(dateTime)}\n` +
                    `📍 <b>สถานที่:</b> ${escapeHtml(location)}\n` +
                    `💬 <b>รายละเอียด:</b> "${escapeHtml(description)}"`;
    triggerTelegramNotification(message);

    return newAppt;
}

function joinAppointment(apptId, memberName) {
    const appts = getAppointments();
    const appt = appts.find(a => a.id === apptId);
    if (appt) {
        let message = "";
        if (!appt.joined.includes(memberName)) {
            appt.joined.push(memberName);
            localStorage.setItem("house_of_love_appts", JSON.stringify(appts));
            
            message = `🙋 <b>มีคนตอบตกลงนัดหมายแล้ว!</b>\n` +
                      `👤 <b>${memberName}</b> ตอบตกลงว่าจะไปร่วมกิจกรรม:\n` +
                      `📌 "${escapeHtml(appt.title)}"`;
        } else {
            // หากเคยเข้าร่วมแล้ว กดอีกครั้งเพื่อออกได้
            appt.joined = appt.joined.filter(name => name !== memberName);
            localStorage.setItem("house_of_love_appts", JSON.stringify(appts));
            
            message = `🙅 <b>มีคนถอนตัวจากนัดหมาย</b>\n` +
                      `👤 <b>${memberName}</b> ขอถอนตัวจากกิจกรรม:\n` +
                      `📌 "${escapeHtml(appt.title)}"`;
        }
        syncDatabase();
        
        if (message) {
            triggerTelegramNotification(message);
        }
    }
    return appts;
}

function deleteAppointment(apptId) {
    const stored = localStorage.getItem("house_of_love_appts");
    let appts = stored ? JSON.parse(stored) : [];
    const appt = appts.find(a => a.id === apptId);
    if (appt) {
        appt.deleted = true;
        
        // ส่งแจ้งเตือน Telegram (ยกเลิกนัด)
        const message = `🚫 <b>นัดหมายถูกยกเลิกแล้ว</b>\n` +
                        `📌 นัดหมาย "${escapeHtml(appt.title)}" ถูกยกเลิก`;
        triggerTelegramNotification(message);
    } else {
        appts.push({ id: apptId, deleted: true });
    }
    localStorage.setItem("house_of_love_appts", JSON.stringify(appts));
    syncDatabase();
    return appts.filter(a => !a.deleted);
}

function clearDailyCheckins() {
    const logs = getLogs();
    logs.forEach(log => {
        if (isLogToday(log.timestamp)) {
            log.clearedFromDaily = true;
        }
    });
    localStorage.setItem("house_of_love_logs", JSON.stringify(logs));
    syncDatabase();
}

// ==========================================================================
// REAL-TIME CLOUD SYNCHRONIZATION SYSTEM (JSONBLOB DATABASE API)
// ==========================================================================
let currentBlobId = localStorage.getItem("house_of_love_db_blob_id") || "019f1782-c543-7b6c-9dbd-c2b25ca1cf96";

function getCloudDbUrl() {
    return "https://api.jsonblob.com/api/jsonBlob/" + currentBlobId;
}

// ตรวจจับการเปิดลิงก์เชื่อมต่อด่วนผ่าน URL Hash (#db=...)
const hash = window.location.hash;
if (hash && hash.startsWith("#db=")) {
    const dbId = hash.substring(4).trim();
    if (dbId.length > 5) {
        localStorage.setItem("house_of_love_db_blob_id", dbId);
        currentBlobId = dbId;
        // ล้าง hash บน URL เพื่อความสะอาด
        history.replaceState("", document.title, window.location.pathname + window.location.search);
        alert("🔗 เชื่อมต่อกับฐานข้อมูลคลาวด์ตัวใหม่เรียบร้อยแล้วค๊า!");
    }
}

let isSyncing = false;
let syncPending = false;

const DEFAULT_TELEGRAM_TOKEN = "8538435768:AAGRJQHvT42CH6o9x6UuMG99e_nWuhREA18";
const DEFAULT_TELEGRAM_CHAT_ID = "-1003748723423";
const DEFAULT_TELEGRAM_THREAD_ID = "1";

// Telegram configuration variables (synced via cloud)
let telegramToken = localStorage.getItem("house_of_love_telegram_token") || DEFAULT_TELEGRAM_TOKEN;
let telegramChatId = localStorage.getItem("house_of_love_telegram_chat_id") || DEFAULT_TELEGRAM_CHAT_ID;
let telegramThreadId = localStorage.getItem("house_of_love_telegram_thread_id") || DEFAULT_TELEGRAM_THREAD_ID;

function saveTelegramSettings(token, chatId, threadId) {
    let cleanThreadId = threadId.trim();
    if (cleanThreadId.includes("/")) {
        const parts = cleanThreadId.split("/");
        const lastPart = parts[parts.length - 1];
        if (lastPart && !isNaN(lastPart)) {
            cleanThreadId = lastPart;
        }
    }

    localStorage.setItem("house_of_love_telegram_token", token);
    localStorage.setItem("house_of_love_telegram_chat_id", chatId);
    localStorage.setItem("house_of_love_telegram_thread_id", cleanThreadId);
    localStorage.setItem("house_of_love_telegram_updated", Date.now().toString());
    
    telegramToken = token;
    telegramChatId = chatId;
    telegramThreadId = cleanThreadId;
    
    syncDatabase();
}

async function recreateCloudDatabase() {
    try {
        const localMembers = JSON.parse(localStorage.getItem("house_of_love_members")) || [];
        const localLogs = JSON.parse(localStorage.getItem("house_of_love_logs")) || [];
        const localAppts = JSON.parse(localStorage.getItem("house_of_love_appts")) || [];
        const localTrees = JSON.parse(localStorage.getItem("house_of_love_trees")) || [];
        
        const localLastCleared = parseInt(localStorage.getItem("house_of_love_logs_last_cleared") || "0", 10);
        
        const localToken = localStorage.getItem("house_of_love_telegram_token") || DEFAULT_TELEGRAM_TOKEN;
        const localChatId = localStorage.getItem("house_of_love_telegram_chat_id") || DEFAULT_TELEGRAM_CHAT_ID;
        const localThread = localStorage.getItem("house_of_love_telegram_thread_id") || DEFAULT_TELEGRAM_THREAD_ID;
        const localUpdated = parseInt(localStorage.getItem("house_of_love_telegram_updated") || "0", 10);
        
        const initialData = {
            members: localMembers,
            logs: localLogs,
            appts: localAppts,
            trees: localTrees,
            lastClearedLogs: localLastCleared,
            telegramToken: localToken,
            telegramChatId: localChatId,
            telegramThreadId: localThread,
            telegramUpdated: localUpdated
        };
        
        const response = await fetch("https://api.jsonblob.com/api/jsonBlob", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(initialData)
        });
        
        if (!response.ok) throw new Error("Failed to create new cloud database");
        
        const newId = response.headers.get("X-jsonblob-id");
        if (!newId) throw new Error("No database ID received");
        
        localStorage.setItem("house_of_love_db_blob_id", newId);
        currentBlobId = newId;
        
        // อัปเดต UI ช่องกรอก
        const dbInput = document.getElementById("dbBlobId");
        if (dbInput) dbInput.value = newId;
        
        const shareLinkInput = document.getElementById("dbShareLink");
        if (shareLinkInput) {
            shareLinkInput.value = window.location.origin + window.location.pathname + "#db=" + newId;
        }
        
        syncDatabase();
        
        alert(`🎉 สร้างห้องฐานข้อมูลคลาวด์สำเร็จแล้วค่ะ!\n\nรหัสห้องใหม่คือ:\n${newId}\n\nคุณสามารถคัดลอกลิงก์แชร์สำหรับส่งให้เครื่องอื่นในปุ่มด้านล่างเพื่อซิงก์ข้อมูลได้ทันทีค๊า!`);
    } catch (e) {
        console.error("Error recreating database:", e);
        alert("ขออภัยค่ะ เกิดข้อผิดพลาดในการสร้างฐานข้อมูลใหม่ กรุณาลองใหม่อีกครั้งนะคนดี");
    }
}

async function triggerTelegramNotification(messageText) {
    if (!telegramToken || !telegramChatId) {
        console.log("Telegram settings not configured. Skipping notification.");
        return;
    }
    
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    
    const formData = new URLSearchParams();
    formData.append("chat_id", telegramChatId);
    formData.append("text", messageText);
    formData.append("parse_mode", "HTML");
    if (telegramThreadId) {
        formData.append("message_thread_id", telegramThreadId);
    }
    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });
        if (!response.ok) {
            console.error("Telegram notification failed:", await response.text());
        }
    } catch (e) {
        console.error("Error sending Telegram notification:", e);
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

async function fetchCloudData() {
    try {
        // Add cache-busting query parameter and no-store option to bypass CDN/browser caches
        const response = await fetch(getCloudDbUrl() + "?t=" + Date.now(), { 
            cache: "no-store" 
        });
        if (!response.ok) throw new Error("Cloud fetch failed");
        return await response.json();
    } catch (e) {
        console.error("Error fetching cloud data:", e);
        return null;
    }
}

async function saveCloudData(data) {
    try {
        const response = await fetch(getCloudDbUrl(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.ok;
    } catch (e) {
        console.error("Error saving cloud data:", e);
        return false;
    }
}

async function syncDatabase() {
    if (isSyncing) {
        syncPending = true;
        return;
    }
    isSyncing = true;
    syncPending = false;
    
    try {
        const localMembers = JSON.parse(localStorage.getItem("house_of_love_members")) || [];
        const localLogs = JSON.parse(localStorage.getItem("house_of_love_logs")) || [];
        const localAppts = JSON.parse(localStorage.getItem("house_of_love_appts")) || [];
        const localTrees = JSON.parse(localStorage.getItem("house_of_love_trees")) || [];
        
        const localLastCleared = parseInt(localStorage.getItem("house_of_love_logs_last_cleared") || "0", 10);
        
        // Read local telegram settings
        const localToken = localStorage.getItem("house_of_love_telegram_token") || DEFAULT_TELEGRAM_TOKEN;
        const localChatId = localStorage.getItem("house_of_love_telegram_chat_id") || DEFAULT_TELEGRAM_CHAT_ID;
        const localThread = localStorage.getItem("house_of_love_telegram_thread_id") || DEFAULT_TELEGRAM_THREAD_ID;
        const localUpdated = parseInt(localStorage.getItem("house_of_love_telegram_updated") || "0", 10);
        
        const cloudData = await fetchCloudData();
        
        if (!cloudData) {
            console.warn("Could not retrieve cloud data. Offline mode active.");
            window.dispatchEvent(new CustomEvent("db-sync-status", { detail: { status: "offline" } }));
            isSyncing = false;
            return;
        }
        
        window.dispatchEvent(new CustomEvent("db-sync-status", { detail: { status: "online" } }));
        
        // Handle sync cleared logs history
        const activeClearedLogs = Math.max(localLastCleared, cloudData.lastClearedLogs || 0);
        const filterCleared = (list) => list.filter(l => new Date(l.timestamp).getTime() > activeClearedLogs);
        
        const filteredCloudLogs = filterCleared(cloudData.logs || []);
        const filteredLocalLogs = filterCleared(localLogs);
        
        // 1. Merge Members (Roster changes)
        const mergedMembers = [];
        const memberMap = new Map();
        INITIAL_MEMBERS.forEach(m => memberMap.set(m.id, m));
        (cloudData.members || []).forEach(m => memberMap.set(m.id, m));
        localMembers.forEach(m => {
            const init = INITIAL_MEMBERS.find(im => im.id === m.id);
            if (init && JSON.stringify(m) !== JSON.stringify(init)) {
                memberMap.set(m.id, m);
            }
        });
        memberMap.forEach(m => mergedMembers.push(m));
        
        // 2. Merge Logs (Evaluations / Mood updates)
        const mergedLogs = [];
        const logMap = new Map();
        filteredCloudLogs.forEach(l => logMap.set(l.id, l));
        filteredLocalLogs.forEach(l => {
            if (logMap.has(l.id)) {
                const cloudLog = logMap.get(l.id);
                // Merge clearedFromDaily status
                l.clearedFromDaily = cloudLog.clearedFromDaily || l.clearedFromDaily;
            }
            logMap.set(l.id, l);
        });
        logMap.forEach(l => mergedLogs.push(l));
        mergedLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // 3. Merge Appointments (including deleted tombstones)
        const mergedAppts = [];
        const apptMap = new Map();
        (cloudData.appts || []).forEach(a => apptMap.set(a.id, a));
        localAppts.forEach(a => {
            if (apptMap.has(a.id)) {
                const cloudAppt = apptMap.get(a.id);
                const joinedSet = new Set([...cloudAppt.joined, ...a.joined]);
                a.joined = Array.from(joinedSet);
                a.deleted = cloudAppt.deleted || a.deleted;
            }
            apptMap.set(a.id, a);
        });
        apptMap.forEach(a => mergedAppts.push(a));
        
        // 4. Merge Trees (Newest wins based on lastWatered)
        const mergedTrees = [];
        const treeMap = new Map();
        // Setup initial default trees
        INITIAL_MEMBERS.forEach(m => {
            treeMap.set(m.id, {
                memberId: m.id,
                waterPercent: 50,
                growthPoints: 0,
                lastWatered: null,
                lastWateredBy: null,
                lastPhrase: null,
                lastFertilized: null
            });
        });
        
        // Merge from cloud
        (cloudData.trees || []).forEach(t => {
            if (treeMap.has(t.memberId)) {
                treeMap.set(t.memberId, t);
            }
        });
        
        // Merge from local
        localTrees.forEach(t => {
            if (treeMap.has(t.memberId)) {
                const cloudTree = treeMap.get(t.memberId);
                const cloudTime = cloudTree.lastWatered ? new Date(cloudTree.lastWatered).getTime() : 0;
                const localTime = t.lastWatered ? new Date(t.lastWatered).getTime() : 0;
                if (localTime >= cloudTime) {
                    treeMap.set(t.memberId, t);
                } else {
                    treeMap.set(t.memberId, cloudTree);
                }
            }
        });
        
        treeMap.forEach(t => mergedTrees.push(t));
        
        // 5. Merge Telegram settings
        const cloudToken = cloudData.telegramToken || "";
        const cloudChatId = cloudData.telegramChatId || "";
        const cloudThread = cloudData.telegramThreadId || "";
        const cloudUpdated = cloudData.telegramUpdated || 0;
        
        const activeTelegramUpdated = Math.max(localUpdated, cloudUpdated);
        let mergedToken = localToken;
        let mergedChatId = localChatId;
        let mergedThread = localThread;
        
        if (cloudUpdated > localUpdated) {
            mergedToken = cloudToken;
            mergedChatId = cloudChatId;
            mergedThread = cloudThread;
        }

        // Apply 90-day logs auto-pruning for the cloud database
        const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
        const cloudTargetLogs = mergedLogs.filter(l => l.timestamp && new Date(l.timestamp).getTime() > ninetyDaysAgo);
        
        // Check if local storage needs updating (local != merged)
        const localChanged = 
            JSON.stringify(localMembers) !== JSON.stringify(mergedMembers) ||
            JSON.stringify(localLogs) !== JSON.stringify(mergedLogs) ||
            JSON.stringify(localAppts) !== JSON.stringify(mergedAppts) ||
            JSON.stringify(localTrees) !== JSON.stringify(mergedTrees) ||
            localLastCleared !== activeClearedLogs ||
            localToken !== mergedToken ||
            localChatId !== mergedChatId ||
            localThread !== mergedThread ||
            localUpdated !== activeTelegramUpdated;
            
        // Check if cloud database needs updating (cloud != merged/pruned)
        const cloudChanged = 
            JSON.stringify(cloudData.members) !== JSON.stringify(mergedMembers) ||
            JSON.stringify(cloudData.logs) !== JSON.stringify(cloudTargetLogs) ||
            JSON.stringify(cloudData.appts) !== JSON.stringify(mergedAppts) ||
            JSON.stringify(cloudData.trees) !== JSON.stringify(mergedTrees) ||
            (cloudData.lastClearedLogs || 0) !== activeClearedLogs ||
            cloudToken !== mergedToken ||
            cloudChatId !== mergedChatId ||
            cloudThread !== mergedThread ||
            (cloudData.telegramUpdated || 0) !== activeTelegramUpdated;
            
        if (localChanged) {
            localStorage.setItem("house_of_love_members", JSON.stringify(mergedMembers));
            localStorage.setItem("house_of_love_logs", JSON.stringify(mergedLogs));
            localStorage.setItem("house_of_love_appts", JSON.stringify(mergedAppts));
            localStorage.setItem("house_of_love_trees", JSON.stringify(mergedTrees));
            localStorage.setItem("house_of_love_logs_last_cleared", activeClearedLogs.toString());
            
            // Save merged telegram settings
            localStorage.setItem("house_of_love_telegram_token", mergedToken);
            localStorage.setItem("house_of_love_telegram_chat_id", mergedChatId);
            localStorage.setItem("house_of_love_telegram_thread_id", mergedThread);
            localStorage.setItem("house_of_love_telegram_updated", activeTelegramUpdated.toString());
            telegramToken = mergedToken;
            telegramChatId = mergedChatId;
            telegramThreadId = mergedThread;
            
            // Notify UI to re-render
            window.dispatchEvent(new CustomEvent("db-synced"));
        }
        
        if (cloudChanged) {
            const success = await saveCloudData({
                members: mergedMembers,
                logs: cloudTargetLogs, // save pruned logs in cloud
                appts: mergedAppts,
                trees: mergedTrees,
                lastClearedLogs: activeClearedLogs,
                telegramToken: mergedToken,
                telegramChatId: mergedChatId,
                telegramThreadId: mergedThread,
                telegramUpdated: activeTelegramUpdated
            });
            if (!success) {
                console.warn("Failed to sync local changes to cloud database. Will retry in the next sync loop.");
            }
        }
    } catch (e) {
        console.error("Error syncing database:", e);
    } finally {
        isSyncing = false;
        if (syncPending) {
            setTimeout(syncDatabase, 1000);
        }
    }
}

// ==========================================================================
// 4. จัดการข้อมูลต้นไม้ กน. (Trees)
// ==========================================================================
const TREE_SPECIES = [
    { type: "sakura", name: "ต้นซากุระสีชมพู", leafColor: "#81C784", flowerColor1: "#FF85A2", flowerColor2: "#FFB3C6", leafShape: "circle", flowerEmoji: "🌸" },
    { type: "orchid", name: "ต้นดอกเอื้องสีส้ม", leafColor: "#A5D6A7", flowerColor1: "#FF9800", flowerColor2: "#FFE082", leafShape: "polygon", flowerEmoji: "🍁" },
    { type: "wisteria", name: "ต้นวิสทีเรียสีม่วง", leafColor: "#66BB6A", flowerColor1: "#AB47BC", flowerColor2: "#E1BEE7", leafShape: "ellipse", flowerEmoji: "🍇" },
    { type: "jasmine", name: "ต้นพิกุลทองสีเหลือง", leafColor: "#C8E6C9", flowerColor1: "#FFD54F", flowerColor2: "#FFF59D", leafShape: "rect", flowerEmoji: "🌼" }
];

function getTreeType(memberId) {
    const members = getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    const safeIdx = idx === -1 ? 0 : idx;
    return TREE_SPECIES[safeIdx % 4];
}

function getTrees() {
    const stored = localStorage.getItem("house_of_love_trees");
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Initialize default trees for 16 members
    const members = getMembers();
    const defaultTrees = members.map(m => ({
        memberId: m.id,
        waterPercent: 50,
        growthPoints: 0,
        lastWatered: null,
        lastWateredBy: null,
        lastPhrase: null,
        lastFertilized: null
    }));
    
    localStorage.setItem("house_of_love_trees", JSON.stringify(defaultTrees));
    return defaultTrees;
}

function saveTrees(trees) {
    localStorage.setItem("house_of_love_trees", JSON.stringify(trees));
    syncDatabase();
}

function waterTree(memberId, positivePhrase, watererName) {
    const trees = getTrees();
    const tree = trees.find(t => t.memberId === memberId);
    if (!tree) return null;
    
    // Increment water moisture, cap at 100%
    tree.waterPercent = Math.min(100, tree.waterPercent + 25);
    
    // Increment growth points (+1 day) - limit to once per day per tree
    const todayStr = new Date().toDateString();
    const lastWateredDateStr = tree.lastWatered ? new Date(tree.lastWatered).toDateString() : null;
    
    let growthAdded = false;
    if (lastWateredDateStr !== todayStr) {
        tree.growthPoints = Math.min(365, tree.growthPoints + 1);
        growthAdded = true;
    }
    
    tree.lastWatered = new Date().toISOString();
    tree.lastWateredBy = watererName;
    tree.lastPhrase = positivePhrase;
    
    saveTrees(trees);

    // ส่งแจ้งเตือน Telegram (รดน้ำต้นไม้)
    const wateredMember = getMembers().find(m => m.id === memberId);
    const wateredName = wateredMember ? wateredMember.name : memberId;
    const message = `💧 <b>รดน้ำต้นไม้ฮีลใจ</b>\n` +
                    `👤 <b>คนรดน้ำ:</b> ${watererName}\n` +
                    `🌳 <b>รดน้ำให้ต้นไม้ของ:</b> ${wateredName}\n` +
                    `💬 <b>ข้อความส่งพลังบวก:</b> "${escapeHtml(positivePhrase)}"`;
    triggerTelegramNotification(message);

    return { tree, growthAdded };
}

// Cheat button function for testing (with monthly constraint)
function addGrowthCheat(memberId, days) {
    const trees = getTrees();
    const tree = trees.find(t => t.memberId === memberId);
    if (!tree) return null;
    
    // Check if already fertilized in current calendar month
    const now = new Date();
    if (tree.lastFertilized) {
        const lastFert = new Date(tree.lastFertilized);
        if (lastFert.getMonth() === now.getMonth() && lastFert.getFullYear() === now.getFullYear()) {
            return { error: "already_fertilized" };
        }
    }
    
    tree.growthPoints = Math.min(365, tree.growthPoints + days);
    tree.waterPercent = Math.min(100, tree.waterPercent + 20); // also water slightly
    tree.lastWatered = now.toISOString();
    tree.lastWateredBy = "ปุ๋ยเร่งโตวิเศษ";
    tree.lastPhrase = "เติบโตขึ้นอย่างรวดเร็วนะคนเก่ง!";
    tree.lastFertilized = now.toISOString();
    
    saveTrees(trees);

    // ส่งแจ้งเตือน Telegram (ใส่ปุ๋ย)
    const wateredMember = getMembers().find(m => m.id === memberId);
    const wateredName = wateredMember ? wateredMember.name : memberId;
    const message = `🧪 <b>ใส่ปุ๋ยวิเศษเพิ่มพลังเติบโต</b>\n` +
                    `🌳 <b>ต้นไม้ของ:</b> ${wateredName}\n` +
                    `⚡ <b>เร่งเวลาเติบโตขึ้น:</b> +${days} วัน\n` +
                    `💬 <b>ข้อความฮีลใจ:</b> "เติบโตขึ้นอย่างรวดเร็วนะคนเก่ง!"`;
    triggerTelegramNotification(message);

    return tree;
}

// Function to reset all trees back to seedling stage (age 0)
function resetTrees() {
    const members = getMembers();
    const defaultTrees = members.map(m => ({
        memberId: m.id,
        waterPercent: 50,
        growthPoints: 0,
        lastWatered: null,
        lastWateredBy: null,
        lastPhrase: null,
        lastFertilized: null
    }));
    localStorage.setItem("house_of_love_trees", JSON.stringify(defaultTrees));
    syncDatabase();
}

// Daily decay function for moisture - decreases moisture of all trees by 15% once a day
function applyMoistureDecay() {
    const lastDecayTime = localStorage.getItem("house_of_love_trees_last_decay") || "0";
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (now - parseInt(lastDecayTime, 10) > oneDayMs) {
        const trees = getTrees();
        const daysElapsed = Math.floor((now - parseInt(lastDecayTime, 10)) / oneDayMs);
        const decayAmt = Math.min(5, daysElapsed) * 15; // cap decay at 5 days to avoid dropping to 0 instantly if offline too long
        
        trees.forEach(t => {
            t.waterPercent = Math.max(0, t.waterPercent - decayAmt);
        });
        
        localStorage.setItem("house_of_love_trees", JSON.stringify(trees));
        localStorage.setItem("house_of_love_trees_last_decay", now.toString());
        syncDatabase();
    }
}

// Start auto sync on load and poll every 10 seconds
applyMoistureDecay();
syncDatabase();
setInterval(syncDatabase, 10000);
