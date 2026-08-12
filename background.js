const SITES_KEY = "sites";
const LEGACY_KEY = "blockedUrls";
const ALARM_NAME = "refreshRules";

function normalizeHost(input) {
    if (typeof input !== "string") return null;
    let value = input.trim().toLowerCase();
    if (!value) return null;
    if (!value.includes(".") && !value.includes(":")) return null;
    let hostname = value;
    try {
        if (!/^[a-z][a-z0-9+.-]*:\/\//.test(value)) value = "http://" + value;
        hostname = new URL(value).hostname;
    } catch {
        return null;
    }
    hostname = hostname.replace(/^(www\.|m\.)/, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(hostname)) return null;
    return hostname;
}

function toMinutes(site, field) {
    const raw = String(site[field] || "0");
    const [h, m] = raw.split(":").map(Number);
    return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

function isBlockedNow(site, now) {
    if (!site || site.active === false) return false;

    if (site.mode === "all_day") return true;
    if (site.mode !== "time_window") return false;

    const start = toMinutes(site, "start");
    const end = toMinutes(site, "end");
    const minutes = now.getHours() * 60 + now.getMinutes();

    if (start === end) return true;
    if (start < end) return minutes >= start && minutes < end;
    return minutes >= start || minutes < end;
}

function findNextTransition(sites, fromDate) {
    const fromMs = fromDate.getTime();
    let nextMs = Infinity;

    for (const site of sites || []) {
        if (!site || site.active === false || site.mode !== "time_window") continue;

        for (const field of ["start", "end"]) {
            const raw = String(site[field] || "0");
            const [h, m] = raw.split(":").map(Number);
            if (isNaN(h) || isNaN(m)) continue;

            const candidate = new Date(fromDate);
            candidate.setHours(h, m, 0, 0);
            let candidateMs = candidate.getTime();
            if (candidateMs <= fromMs) candidateMs += 24 * 60 * 60 * 1000;
            if (candidateMs < nextMs) nextMs = candidateMs;
        }
    }

    return nextMs === Infinity ? null : nextMs;
}

function scheduleNextRefresh(sites) {
    const nextMs = findNextTransition(sites, new Date());
    if (nextMs === null) {
        chrome.alarms.clear(ALARM_NAME);
        return;
    }
    chrome.alarms.create(ALARM_NAME, { when: nextMs + 2 * 1000 });
}

async function loadSites() {
    const data = await chrome.storage.local.get([SITES_KEY, LEGACY_KEY]);

    if (Array.isArray(data[SITES_KEY])) return data[SITES_KEY];

    if (Array.isArray(data[LEGACY_KEY]) && data[LEGACY_KEY].length) {
        const sites = data[LEGACY_KEY]
            .map((entry, index) => {
                const url = normalizeHost(entry.url);
                if (!url) return null;
                return {
                    id: index + 1,
                    url,
                    mode: "time_window",
                    start: entry.startTime || "09:00",
                    end: entry.endTime || "17:00",
                    active: true,
                };
            })
            .filter(Boolean);

        const next = {};
        next[SITES_KEY] = sites;
        await chrome.storage.local.set(next);
        await chrome.storage.local.remove(LEGACY_KEY);
        return sites;
    }

    return [];
}

async function updateBlockingRules() {
    const sites = await loadSites();
    const now = new Date();

    const rules = [];
    for (const site of sites) {
        if (!isBlockedNow(site, now)) continue;

        const url = normalizeHost(site.url);
        if (!url) continue;

        rules.push({
            id: site.id,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: "||" + url,
                resourceTypes: ["main_frame"],
            },
        });
    }

    const current = await chrome.declarativeNetRequest.getDynamicRules();
    const currentIds = current.map((rule) => rule.id).sort((a, b) => a - b);
    const desiredIds = rules.map((rule) => rule.id).sort((a, b) => a - b);

    const changed =
        currentIds.length !== desiredIds.length ||
        currentIds.some((id, i) => id !== desiredIds[i]);

    if (changed) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: currentIds,
            addRules: rules,
        });
    }

    scheduleNextRefresh(sites);
}

chrome.runtime.onInstalled.addListener(() => {
    updateBlockingRules();
});

chrome.runtime.onStartup.addListener(() => {
    updateBlockingRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!(SITES_KEY in changes) && !(LEGACY_KEY in changes)) return;

    let sites = changes[SITES_KEY]?.newValue;
    if (!Array.isArray(sites)) {
        const legacy = changes[LEGACY_KEY]?.newValue;
        if (Array.isArray(legacy)) sites = legacy;
    }
    if (Array.isArray(sites)) scheduleNextRefresh(sites);
    updateBlockingRules();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        updateBlockingRules();
    }
});

updateBlockingRules();