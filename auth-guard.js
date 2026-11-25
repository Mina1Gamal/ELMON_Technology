// auth-guard.js
// يتحقق من حالة تسجيل الدخول ويظهر زر لوحة التحكم للأدمن فقط

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// تجنب تهيئة Firebase أكثر من مرة إذا استُدعي السكريبت في أكثر من مكان
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// التحقق من صلاحية الأدمن عبر collection
async function checkIsAdmin(user) {
    try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        if (!adminDoc.exists()) return false;
        const data = adminDoc.data();
        return data.active === true || data.active === "true";
    } catch {
        return false;
    }
}

// إظهار/إخفاء زر لوحة التحكم
onAuthStateChanged(auth, async (user) => {
    const adminLinks = document.querySelectorAll('.admin-only-link');
    
    if (!user) {
        adminLinks.forEach(el => el.style.display = 'none');
        return;
    }
    
    const isAdmin = await checkIsAdmin(user);
    adminLinks.forEach(el => {
        el.style.display = isAdmin ? 'inline-flex' : 'none';
    });
});