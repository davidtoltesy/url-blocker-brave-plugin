// Funkció a blokkolási szabályok frissítésére
function updateBlockingRules() {
    chrome.storage.local.get("blockedUrls", (result) => {
        const blockedUrls = result.blockedUrls || [];

        // A szabályok dinamikus frissítése
        const rules = blockedUrls.map((urlObj, index) => {
            const now = new Date(); // Jelenlegi idő
            const startDate = new Date(now); // Kezdő idő
            const endDate = new Date(now);   // Befejező idő

            const [startHour, startMinute] = urlObj.startTime.split(':').map(Number);
            const [endHour, endMinute] = urlObj.endTime.split(':').map(Number);

            startDate.setHours(startHour, startMinute, 0, 0);
            endDate.setHours(endHour, endMinute, 0, 0);

            // Ha a jelenlegi idő nem esik a megadott időintervallumon kívül, ne blokkolja
            if (now < startDate || now > endDate) {
                return null;  // Ha nem érvényes, nem generálunk szabályt
            }

            // Szabályok létrehozása
            return {
                id: index + 1,  // A szabály id-je
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: urlObj.url,  // A blokkolni kívánt URL
                    resourceTypes: ["main_frame"],  // Csak az elsődleges oldalak blokkolása
                }
            };
        }).filter(rule => rule !== null);  // Csak érvényes szabályokat tartunk meg

        // Frissítjük a dinamikus szabályokat
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), // Az összes korábbi szabály eltávolítása
            addRules: rules  // Az új szabályok hozzáadása
        }, () => {
            console.log("Blokkolási szabályok frissítve.");
        });
    });
}

// Az üzenetkezelő, amely figyeli az updateRules üzeneteket
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateRules") {
        updateBlockingRules();
        sendResponse({ success: true });
    }
});

// Telepítéskor frissítjük a szabályokat
chrome.runtime.onInstalled.addListener(() => {
    updateBlockingRules();
});

// A szabályok időszakos frissítése
chrome.alarms.create("updateRules", { periodInMinutes: 1 });  // 1 percenkénti frissítés

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "updateRules") {
        updateBlockingRules();
    }
});

// Esetlegesen az URL-ek módosításához hozzáadott további funkciók, mint URL eltávolítása
function removeUrlFromRules(urlToRemove) {
    chrome.storage.local.get("blockedUrls", (result) => {
        const blockedUrls = result.blockedUrls || [];
        const updatedUrls = blockedUrls.filter(urlObj => urlObj.url !== urlToRemove);  // Az URL eltávolítása

        chrome.storage.local.set({ blockedUrls: updatedUrls }, () => {
            updateBlockingRules();  // A blokkolási szabályok frissítése az új URL-listával
        });
    });
}
