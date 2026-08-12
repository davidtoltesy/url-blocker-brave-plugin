const SITES_KEY = "sites";
const QUARTERS = ["00", "15", "30", "45"];

document.addEventListener("DOMContentLoaded", () => {
    const tabAdd = document.getElementById("tabAdd");
    const tabList = document.getElementById("tabList");
    const panelAdd = document.getElementById("panelAdd");
    const panelList = document.getElementById("panelList");

    const addForm = document.getElementById("addForm");
    const urlInput = document.getElementById("urlInput");
    const timeFields = document.getElementById("timeFields");
    const startSelect = document.getElementById("startSelect");
    const endSelect = document.getElementById("endSelect");
    const msg = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");
    const list = document.getElementById("list");
    const empty = document.getElementById("empty");
    const countEl = document.getElementById("count");
    const headerDot = document.getElementById("headerDot");
    const sortSelect = document.getElementById("sortSelect");
    const pager = document.getElementById("pager");
    const pageNumbers = document.getElementById("pageNumbers");
    const pagePrev = document.getElementById("pagePrev");
    const pageNext = document.getElementById("pageNext");

    const modeButtons = Array.from(document.querySelectorAll(".mode"));
    const presetButtons = Array.from(document.querySelectorAll(".preset"));

    const PAGE_SIZE = 10;

    let sites = [];
    let editingId = null;
    let sortMode = "az";
    let currentPage = 1;

    populateTimeSelect(startSelect);
    populateTimeSelect(endSelect);
    startSelect.value = "10:00";
    endSelect.value = "16:00";

    prefillFromActiveTab();

    bindEvents();
    loadSites();

    function populateTimeSelect(select) {
        const fragment = document.createDocumentFragment();
        for (let h = 0; h < 24; h++) {
            const hh = String(h).padStart(2, "0");
            for (const m of QUARTERS) {
                const option = document.createElement("option");
                option.value = `${hh}:${m}`;
                option.textContent = `${hh}:${m}`;
                fragment.appendChild(option);
            }
        }
        select.appendChild(fragment);
    }

    function bindEvents() {
        tabAdd.addEventListener("click", () => activateTab("add"));
        tabList.addEventListener("click", () => activateTab("list"));

        modeButtons.forEach((btn) => {
            btn.addEventListener("click", () => setMode(btn.dataset.mode));
        });

        presetButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const [start, end] = btn.dataset.preset.split(",");
                startSelect.value = start;
                endSelect.value = end;
            });
        });

        addForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleSubmit();
        });

        list.addEventListener("click", handleListClick);

        sortSelect.addEventListener("change", () => {
            sortMode = sortSelect.value;
            currentPage = 1;
            renderList();
        });

        pagePrev.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderList();
            }
        });

        pageNext.addEventListener("click", () => {
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                currentPage++;
                renderList();
            }
        });
    }

    function activateTab(name) {
        const isAdd = name === "add";
        tabAdd.classList.toggle("active", isAdd);
        tabList.classList.toggle("active", !isAdd);
        tabAdd.setAttribute("aria-selected", String(isAdd));
        tabList.setAttribute("aria-selected", String(!isAdd));
        panelAdd.classList.toggle("active", isAdd);
        panelList.classList.toggle("active", !isAdd);
        if (isAdd) urlInput.focus();
    }

    function setMode(mode) {
        modeButtons.forEach((btn) => {
            const active = btn.dataset.mode === mode;
            btn.classList.toggle("active", active);
        });
        timeFields.hidden = mode !== "time_window";
    }

    function currentMode() {
        const active = modeButtons.find((btn) => btn.classList.contains("active"));
        return active ? active.dataset.mode : "all_day";
    }

    function showMsg(text, type) {
        msg.textContent = text;
        msg.className = "msg show " + (type || "error");
    }

    function clearMsg() {
        msg.textContent = "";
        msg.className = "msg";
    }

    function normalizeUrl(value) {
        let input = (value || "").trim().toLowerCase();
        if (!input) return "";
        if (!/^[a-z][a-z0-9+.-]*:\/\//.test(input)) input = "http://" + input;
        let hostname;
        try {
            hostname = new URL(input).hostname;
        } catch {
            return "";
        }
        if (!hostname) return "";
        hostname = hostname.replace(/^www\./, "");
        if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(hostname)) return "";
        return hostname;
    }

    function prefillFromActiveTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs && tabs[0];
            if (!tab || !tab.url) return;
            if (!/^https?:\/\//.test(tab.url)) return;
            const hostname = normalizeUrl(tab.url);
            if (!hostname || urlInput.value) return;
            const url = new URL(tab.url);
            if (/^(www\.)?(chrome|about|brave|edge|moz-extension|chrome-extension):/i.test(url.hostname)) return;
            urlInput.value = hostname;
            urlInput.placeholder = hostname;
            showMsg(`Active tab address prefilled: ${hostname}`, "ok");
            setTimeout(clearMsg, 2500);
        });
    }

    function loadSites() {
        chrome.storage.local.get([SITES_KEY, "blockedUrls"], (result) => {
            sites = Array.isArray(result[SITES_KEY]) ? result[SITES_KEY] : [];
            renderList();
        });
    }

    function saveSites() {
        chrome.storage.local.set({ [SITES_KEY]: sites });
    }

    function handleSubmit() {
        const mode = currentMode();
        const url = normalizeUrl(urlInput.value);
        const start = startSelect.value;
        const end = endSelect.value;

        if (!url) {
            showMsg("Enter a valid website address (e.g. facebook.com).");
            return;
        }

        let cleanStart = start;
        let cleanEnd = end;
        if (mode === "time_window") {
            cleanStart = start || "10:00";
            cleanEnd = end || "16:00";
        }

        const duplicate = sites.some(
            (site) => site.url === url && (!editingId || site.id !== editingId)
        );
        if (duplicate) {
            showMsg(`${url} is already on the list.`);
            return;
        }

        if (editingId) {
            const index = sites.findIndex((site) => site.id === editingId);
            if (index !== -1) {
                sites[index] = {
                    ...sites[index],
                    url,
                    mode,
                    start: mode === "time_window" ? cleanStart : undefined,
                    end: mode === "time_window" ? cleanEnd : undefined,
                };
            }
            editingId = null;
            submitBtn.textContent = "Block";
            activateTab("list");
            renderList();
            saveSites();
            return;
        }

        const id = sites.reduce((max, site) => Math.max(max, site.id || 0), 0) + 1;
        sites.push({
            id,
            url,
            mode,
            start: mode === "time_window" ? cleanStart : undefined,
            end: mode === "time_window" ? cleanEnd : undefined,
            active: true,
            createdAt: Date.now(),
        });

        renderList();
        saveSites();
        urlInput.value = "";
        urlInput.placeholder = "e.g. facebook.com";
        activateTab("list");
    }

    function handleListClick(event) {
        const toggle = event.target.closest("[data-toggle]");
        if (toggle) {
            const id = Number(toggle.dataset.toggle);
            const site = sites.find((s) => s.id === id);
            if (site) {
                site.active = !site.active;
                renderList();
                saveSites();
            }
            return;
        }

        const edit = event.target.closest("[data-edit]");
        if (edit) {
            const id = Number(edit.dataset.edit);
            startEdit(id);
            return;
        }

        const del = event.target.closest("[data-delete]");
        if (del) {
            const id = Number(del.dataset.delete);
            const site = sites.find((s) => s.id === id);
            if (site && confirm(`Delete the block? (${site.url})`)) {
                sites = sites.filter((s) => s.id !== id);
                renderList();
                saveSites();
            }
        }
    }

    function startEdit(id) {
        const site = sites.find((s) => s.id === id);
        if (!site) return;

        editingId = id;
        activateTab("add");

        urlInput.value = site.url;
        setMode(site.mode);
        if (site.mode === "time_window") {
            startSelect.value = site.start || "10:00";
            endSelect.value = site.end || "16:00";
        }

        submitBtn.textContent = "Save";
        urlInput.focus();
    }

    function getTotalPages() {
        return Math.max(1, Math.ceil(sites.length / PAGE_SIZE));
    }

    function getSortedSites() {
        const copy = sites.slice();
        if (sortMode === "az") {
            copy.sort((a, b) => a.url.localeCompare(b.url, "en"));
        } else if (sortMode === "za") {
            copy.sort((a, b) => b.url.localeCompare(a.url, "en"));
        } else if (sortMode === "newest") {
            copy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } else if (sortMode === "oldest") {
            copy.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        }
        return copy;
    }

    function buildPageList(totalPages) {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages = new Set();
        pages.add(1);
        pages.add(totalPages);
        for (let d = -1; d <= 1; d++) {
            const p = currentPage + d;
            if (p >= 1 && p <= totalPages) pages.add(p);
        }
        const sorted = [...pages].sort((a, b) => a - b);
        const result = [];
        let prev = null;
        for (const p of sorted) {
            if (prev !== null && p - prev > 1) result.push("…");
            result.push(p);
            prev = p;
        }
        return result;
    }

    function renderPager(totalPages) {
        pageNumbers.textContent = "";
        for (const entry of buildPageList(totalPages)) {
            if (entry === "…") {
                const ellipsis = document.createElement("span");
                ellipsis.textContent = "…";
                ellipsis.className = "pager-ellipsis";
                pageNumbers.appendChild(ellipsis);
                continue;
            }
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = entry;
            if (entry === currentPage) btn.classList.add("current");
            btn.disabled = entry === currentPage;
            btn.setAttribute("aria-current", entry === currentPage ? "page" : "false");
            btn.addEventListener("click", () => {
                currentPage = entry;
                renderList();
            });
            pageNumbers.appendChild(btn);
        }
    }

    function renderList() {
        const sortedSites = getSortedSites();
        const totalPages = getTotalPages();
        if (currentPage > totalPages) currentPage = totalPages;

        list.textContent = "";
        countEl.textContent = sites.length ? `${sites.length} blocked` : "";

        if (!sites.length) {
            empty.hidden = false;
            pager.hidden = true;
            headerDot.style.background = "var(--text-muted)";
            return;
        }
        empty.hidden = true;

        if (totalPages > 1) {
            pager.hidden = false;
            pagePrev.disabled = currentPage <= 1;
            pageNext.disabled = currentPage >= totalPages;
            renderPager(totalPages);
        } else {
            pager.hidden = true;
        }

        const blockedNow = sites.some(
            (site) => site.active && (site.mode === "all_day" || isTimeWindowActive(site))
        );
        headerDot.style.background = blockedNow ? "var(--danger)" : "var(--ok)";

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const pageSites = sortedSites.slice(startIndex, startIndex + PAGE_SIZE);

        const fragment = document.createDocumentFragment();
        pageSites.forEach((site) => {
            const item = document.createElement("li");
            item.className = "item" + (site.active ? "" : " item-suspended");

            const info = document.createElement("div");
            info.className = "item-info";

            const domain = document.createElement("div");
            domain.className = "item-domain";
            domain.textContent = site.url;

            const sub = document.createElement("div");
            sub.className = "item-sub";
            sub.textContent = describeSchedule(site);

            info.appendChild(domain);
            info.appendChild(sub);

            const toggle = document.createElement("button");
            toggle.className = "switch" + (site.active ? " on" : "");
            toggle.type = "button";
            toggle.dataset.toggle = site.id;
            toggle.setAttribute("role", "switch");
            toggle.setAttribute("aria-checked", String(!!site.active));
            toggle.title = site.active ? "Suspend" : "Re-enable";

            const actions = document.createElement("div");
            actions.className = "actions";

            const editBtn = document.createElement("button");
            editBtn.className = "icon-btn";
            editBtn.innerHTML = "&#9998;";
            editBtn.title = "Edit";
            editBtn.dataset.edit = site.id;

            const delBtn = document.createElement("button");
            delBtn.className = "icon-btn danger";
            delBtn.innerHTML = "&#10005;";
            delBtn.title = "Delete";
            delBtn.dataset.delete = site.id;

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);

            item.appendChild(info);
            item.appendChild(toggle);
            item.appendChild(actions);

            fragment.appendChild(item);
        });
        list.appendChild(fragment);
    }

    function isTimeWindowActive(site) {
        if (site.mode !== "time_window") return false;
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const start = toMinutes(site.start || "10:00");
        const end = toMinutes(site.end || "16:00");
        if (start === end) return true;
        if (start < end) return minutes >= start && minutes < end;
        return minutes >= start || minutes < end;
    }

    function toMinutes(value) {
        const [h, m] = String(value).split(":").map(Number);
        return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    }

    function describeSchedule(site) {
        if (!site.active) return "suspended";
        if (site.mode === "all_day") return "all day";
        const start = site.start || "10:00";
        const end = site.end || "16:00";
        const isOvernight = toMinutes(start) > toMinutes(end);
        return `${start} – ${end}${isOvernight ? " (overnight)" : ""}`;
    }
});