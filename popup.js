document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById("url");
    const addButton = document.getElementById("add");
    const urlList = document.getElementById("urlList");
    const startHourInput = document.getElementById("startHour");
    const startMinuteInput = document.getElementById("startMinute");
    const endHourInput = document.getElementById("endHour");
    const endMinuteInput = document.getElementById("endMinute");

    // Ellenőrizzük, hogy minden input elem létezik
    if (!startHourInput || !startMinuteInput || !endHourInput || !endMinuteInput) {
        console.error("Hiányzó input mezők! Ellenőrizd a HTML-t!");
        return;
    }

    // URL-ek betöltése
    function loadURLs() {
        chrome.storage.local.get("blockedUrls", (result) => {
            const blockedUrls = result.blockedUrls || [];

            // A lista kiürítése és újrarajzolása
            urlList.innerHTML = "";

            blockedUrls.forEach((urlObj, index) => {
                const listItem = document.createElement("li");

                // Az időpontok formázása
                const startTime = new Date();
                const endTime = new Date();
                const [startHour, startMinute] = urlObj.startTime.split(':').map(Number);
                const [endHour, endMinute] = urlObj.endTime.split(':').map(Number);

                startTime.setHours(startHour, startMinute, 0, 0);
                endTime.setHours(endHour, endMinute, 0, 0);

                const startTimeFormatted = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
                const endTimeFormatted = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

                listItem.textContent = `${urlObj.url} | ${startTimeFormatted} - ${endTimeFormatted}`;

                // Hozzáadjuk az eltávolító X gombot
                const removeButton = document.createElement("button");
                removeButton.textContent = "X";
                removeButton.classList.add("remove-button");
                removeButton.addEventListener("click", () => removeUrlFromRules(index));

                // A gomb hozzáadása a listaelemhez
                listItem.appendChild(removeButton);

                // Az URL és időtartam megjelenítése
                urlList.appendChild(listItem);
            });
        });
    }

    // URL hozzáadása a listához
    addButton.addEventListener("click", () => {
        const url = urlInput.value.trim();
        const startHour = startHourInput.value;
        const startMinute = startMinuteInput.value;
        const endHour = endHourInput.value;
        const endMinute = endMinuteInput.value;

        if (!url || !startHour || !startMinute || !endHour || !endMinute) {
            console.error("Minden mező kitöltése kötelező!");
            return;
        }

        // URL-ek betöltése és új URL hozzáadása
        chrome.storage.local.get("blockedUrls", (result) => {
            const blockedUrls = result.blockedUrls || [];
            const newUrlObj = {
                url,
                startTime: `${startHour}:${startMinute}`,
                endTime: `${endHour}:${endMinute}`
            };
            blockedUrls.push(newUrlObj);

            chrome.storage.local.set({ blockedUrls }, () => {
                loadURLs();  // A lista frissítése
            });
        });
    });

    // Eltávolítási funkció
    function removeUrlFromRules(index) {
        chrome.storage.local.get("blockedUrls", (result) => {
            const blockedUrls = result.blockedUrls || [];

            // Az URL eltávolítása a tárolóból
            blockedUrls.splice(index, 1);

            chrome.storage.local.set({ blockedUrls }, () => {
                loadURLs();  // A lista frissítése eltávolítás után
            });
        });
    }

    // Betöltjük az elmentett URL-eket a popup megnyitásakor
    loadURLs();
});
