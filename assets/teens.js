/* TAI Teens Public Beta —— 页面逻辑。
 *
 * 几条不能改的设计约束：
 *
 * **刷新即清空。** 对话只存在内存里，不碰 localStorage。协议承诺"匿名、下次不展示
 * 历史"，用持久化存储就违背了这一点。代价是误刷新会丢对话——这是刻意的取舍。
 *
 * **每次访问都过协议弹窗。** 同样因为不持久化，没有"已同意"标记可读，所以每次都弹。
 *
 * **一次回复渲染成多个气泡。** 服务端返回的 messages 是拆好的数组，要一条一条出现，
 * 而不是合成一大段。这是人设的说话方式，也是这个产品和其他聊天框的区别。
 */
(function () {
    "use strict";

    // ── 配置 ──────────────────────────────────────────

    var API = window.TAI_API;
    var PROTOCOL = window.TAI_PROTOCOL;

    var PERSONAS = [
        { key: "giggle",  name: "Giggle",  tagZh: "损友",   tagEn: "Roaster",
          descZh: "嘴有点欠，接得住梗，损完会收回来。",
          descEn: "Cheeky, quick with a comeback, never actually cruel." },
        { key: "bro",     name: "Bro",     tagZh: "兄弟",   tagEn: "Brother",
          descZh: "话不多，不安慰你，直接给你一个动作。",
          descEn: "Few words, no comfort — he gives you something to do." },
        { key: "sweetie", name: "Sweetie", tagZh: "闺蜜",   tagEn: "Bestie",
          descZh: "会听，会陪，不讲道理也不追问原因。",
          descEn: "She listens. No advice, no interrogation." }
    ];

    var TEXT = {
        zh: {
            "brand.sub": "公共测试 · 红队计划",
            "picker.title": "选一个人设开始测试",
            "picker.lede": "三个模型都能陪你聊天，但脾气不一样。随便挑一个，也可以随时换。对话不会被保存到你下次访问 —— 刷新就没了。",
            "composer.placeholder": "说点什么…",
            "protocol.title": "测试人员协议",
            "protocol.sub": "TAI Teens: Public Beta & Red Teaming Program",
            "protocol.agree": "我已阅读并同意以上全部条款，自愿参与本次测试",
            "protocol.go": "同意并开始",
            "err.net": "网络不通，检查一下连接",
            "err.busy": "服务器忙，稍等一下再试",
            "err.agree": "协议提交失败，请重试",
            "thinking": "对方正在输入",
            "guide.title": "怎么玩",
            "guide.sub": "TAI Teens: Public Beta & Red Teaming Program",
            "guide.ok": "知道了"
        },
        en: {
            "brand.sub": "Public Beta · Red Teaming",
            "picker.title": "Pick a persona to start",
            "picker.lede": "All three will talk to you, but they have different tempers. Pick one — you can switch any time. Nothing is kept between visits; a refresh clears it.",
            "composer.placeholder": "Say something…",
            "protocol.title": "Participant Agreement",
            "protocol.sub": "TAI Teens: Public Beta & Red Teaming Program",
            "protocol.agree": "I have read and accept all of the above, and take part voluntarily",
            "protocol.go": "Agree and start",
            "err.net": "Can't reach the server. Check your connection.",
            "err.busy": "The server is busy. Try again in a moment.",
            "err.agree": "Could not submit consent. Please retry.",
            "thinking": "typing",
            "guide.title": "How to play",
            "guide.sub": "TAI Teens: Public Beta & Red Teaming Program",
            "guide.ok": "Got it"
        }
    };

    // ── 状态 ──────────────────────────────────────────

    // 默认中文，不跟随浏览器语言。测试场在国内，英文版是给个别访客的选项，
    // 不该因为系统是英文就默认展示英文协议——协议是必须读的一份文件。
    // 默认中文。记住过就按记住的来——两个页面共用这个键，否则在说明页切了
    // 语言，回到聊天又是中文。
    var LANG_KEY = "tai.teens.lang";
    var lang = "zh";
    try { lang = localStorage.getItem(LANG_KEY) || "zh"; } catch (e) {}

    // 主题是界面偏好，不是对话数据，所以允许记住。用了 localStorage 而对话用内存，
    // 界线在这里：主题不涉及任何用户内容，对话涉及。
    var THEME_KEY = "tai.teens.theme";
    var theme = (function () {
        try { return localStorage.getItem(THEME_KEY) || "sunny"; }
        catch (e) { return "sunny"; }
    })();

    var session = newSessionId();
    var persona = null;
    var history = [];      // [{role, content}]，只存在内存
    var busy = false;

    function newSessionId() {
        // 无痕测试：只用于把同一次访问的多轮串起来，刷新即换
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }

    function $(id) { return document.getElementById(id); }

    function t(key) {
        return (TEXT[lang] && TEXT[lang][key]) || key;
    }

    // ── 语言 ──────────────────────────────────────────

    function applyTheme(next, persist) {
        theme = next === "starry" ? "starry" : "sunny";
        document.documentElement.setAttribute("data-theme", theme);

        // 地址栏着色跟着主题走，否则手机上会有一条突兀的深色带
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", theme === "sunny" ? "#fdf8f0" : "#0a0c12");

        document.querySelectorAll(".theme button").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.theme === theme));
        });

        if (persist) {
            try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
        }
    }

    function applyLang() {
        document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
        document.title = lang === "zh"
            ? "TAI Teens — 公共测试"
            : "TAI Teens — Public Beta";

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var v = t(el.getAttribute("data-i18n"));
            if (v) el.textContent = v;
        });
        document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
            var v = t(el.getAttribute("data-i18n-ph"));
            if (v) el.setAttribute("placeholder", v);
        });
        document.querySelectorAll(".theme button").forEach(function (b) {
            b.addEventListener("click", function () {
                applyTheme(b.dataset.theme, true);
            });
        });

        document.querySelectorAll(".lang button").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
        });

        renderProtocol();
        renderGuide();
        renderPersonas();
        if (persona) renderPlaceholder();
    }

    function renderProtocol() {
        $("protocol-body").innerHTML = PROTOCOL[lang] || PROTOCOL.zh;
    }

    function renderGuide() {
        var g = window.TAI_GUIDE || {};
        $("guide-body").innerHTML = g[lang] || g.zh || "";
        $("guide-body").scrollTop = 0;
    }

    function openGuide() {
        renderGuide();
        $("guide").hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeGuide() {
        $("guide").hidden = true;
        // 协议弹窗还开着的话不能解锁滚动
        if ($("protocol").hidden) document.body.style.overflow = "";
    }

    // ── 人设选择 ──────────────────────────────────────

    function renderPersonas() {
        var host = $("persona-list");
        if (!host) return;
        host.innerHTML = "";

        PERSONAS.forEach(function (p) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "persona";
            btn.innerHTML =
                '<div class="row"><span class="name">' + p.name + '</span>' +
                '<span class="tag">' + (lang === "zh" ? p.tagZh : p.tagEn) + '</span></div>' +
                '<div class="desc">' + (lang === "zh" ? p.descZh : p.descEn) + '</div>';
            btn.addEventListener("click", function () { enterChat(p.key); });
            host.appendChild(btn);
        });
    }

    // ── 协议门禁 ──────────────────────────────────────

    function showProtocol() {
        $("protocol").hidden = false;
        $("agree-box").checked = false;
        $("agree-go").disabled = true;
        document.body.style.overflow = "hidden";
    }

    function hideProtocol() {
        $("protocol").hidden = true;
        document.body.style.overflow = "";
    }

    function onAgree() {
        var btn = $("agree-go");
        btn.disabled = true;
        btn.textContent = lang === "zh" ? "提交中…" : "Submitting…";

        // 同意记录要落到服务端，否则协议条款无法证明
        fetch(API + "/v1/consent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session: session,
                protocol: PROTOCOL.version,
                lang: lang
            })
        }).then(function (r) {
            if (!r.ok) throw new Error("consent " + r.status);
            hideProtocol();
        }).catch(function () {
            btn.disabled = false;
            btn.textContent = t("protocol.go");
            showFailInline(t("err.agree"));
        });
    }

    // ── 聊天 ──────────────────────────────────────────

    function enterChat(key) {
        persona = PERSONAS.filter(function (p) { return p.key === key; })[0];
        history = [];
        $("picker").hidden = true;
        $("chat").hidden = false;
        $("composer").hidden = false;
        $("chat").innerHTML = "";
        renderPlaceholder();
        $("input").focus();
        scrollBottom();
    }

    function leaveChat() {
        persona = null;
        history = [];
        $("chat").hidden = true;
        $("chat").innerHTML = "";
        $("composer").hidden = true;
        $("picker").hidden = false;
        $("input").value = "";
        autoGrow();
        $("send").disabled = true;
    }

    function renderPlaceholder() {
        if (!persona || history.length) return;
        var hint = document.createElement("div");
        hint.className = "hello";
        hint.style.cssText = "text-align:center;color:#64748b;font-size:13px;padding:24px 8px;";
        hint.textContent = lang === "zh"
            ? "开始和 " + persona.name + " 聊天。它说什么都只是模型输出。"
            : "Start talking to " + persona.name + ". Everything it says is model output.";
        $("chat").appendChild(hint);
    }

    function addBubble(text, mine) {
        var el = document.createElement("div");
        el.className = "msg " + (mine ? "me" : "ai");
        el.textContent = text;
        $("chat").appendChild(el);
        scrollBottom();
        return el;
    }

    function addTyping() {
        var el = document.createElement("div");
        el.className = "msg ai";
        el.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
        $("chat").appendChild(el);
        scrollBottom();
        return el;
    }

    function showFail(msg) {
        var el = document.createElement("div");
        el.className = "fail";
        el.textContent = msg;
        $("chat").appendChild(el);
        scrollBottom();
    }

    function showFailInline(msg) {
        $("protocol-body").scrollTop = 0;
        alert(msg);
    }

    function scrollBottom() {
        var c = $("chat");
        c.scrollTop = c.scrollHeight;
    }

    function send() {
        var input = $("input");
        var text = input.value.trim();
        if (!text || busy || !persona) return;

        var hello = $("chat").querySelector(".hello");
        if (hello) hello.remove();

        busy = true;
        $("send").disabled = true;
        input.value = "";
        autoGrow();

        addBubble(text, true);
        history.push({ role: "user", content: text });

        var typing = addTyping();

        fetch(API + "/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "tai-" + persona.key,
                messages: history,
                session: session,
                lang: lang
            })
        }).then(function (r) {
            if (!r.ok) throw new Error("chat " + r.status);
            return r.json();
        }).then(function (data) {
            typing.remove();
            var choice = (data.choices || [])[0] || {};
            // 优先用拆好的数组：一条消息一个气泡
            var lines = choice.messages ||
                        ((choice.message && choice.message.content) || "").split("\n");
            lines = lines.filter(function (x) { return String(x).trim(); });
            if (!lines.length) lines = ["…"];

            // 连发的几条依次出现，像真的在打字
            lines.forEach(function (line, i) {
                setTimeout(function () { addBubble(line, false); }, i * 220);
            });

            history.push({ role: "assistant", content: lines.join("\n") });

            setTimeout(function () {
                busy = false;
                $("send").disabled = !$("input").value.trim();
            }, lines.length * 220);
        }).catch(function (e) {
            typing.remove();
            showFail(navigator.onLine ? t("err.busy") : t("err.net"));
            busy = false;
            $("send").disabled = !$("input").value.trim();
            // 失败时把这句从历史里退掉，否则下一轮上下文会多一句没人回的话
            if (history.length && history[history.length - 1].role === "user") {
                history.pop();
            }
        });
    }

    // ── 输入框自适应高度 ──────────────────────────────

    function autoGrow() {
        var ta = $("input");
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }

    // ── 键盘：iOS 上软键盘会盖住输入框 ────────────────

    function bindViewport() {
        if (!window.visualViewport) return;
        var vv = window.visualViewport;

        function resize() {
            // 键盘弹起时把可视高度差补到 body 上，否则输入框被盖住
            var gap = window.innerHeight - vv.height;
            document.body.style.paddingBottom = gap > 80 ? gap + "px" : "";
            if (gap > 80) scrollBottom();
        }
        vv.addEventListener("resize", resize);
        vv.addEventListener("scroll", resize);
    }

    // ── 启动 ──────────────────────────────────────────

    function boot() {
        applyTheme(theme, false);
        renderProtocol();
        renderPersonas();
        applyLang();

        document.querySelectorAll(".lang button").forEach(function (b) {
            b.addEventListener("click", function () {
                if (lang === b.dataset.lang) return;
                lang = b.dataset.lang;
                try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
                applyLang();
            });
        });

        $("help").addEventListener("click", openGuide);
        $("guide-close").addEventListener("click", closeGuide);
        $("guide-ok").addEventListener("click", closeGuide);
        // 点遮罩关闭，和协议弹窗不同：协议必须同意才能关，说明不用
        $("guide").addEventListener("click", function (e) {
            if (e.target === $("guide")) closeGuide();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !$("guide").hidden) closeGuide();
        });

        $("agree-box").addEventListener("change", function (e) {
            $("agree-go").disabled = !e.target.checked;
        });
        $("agree-go").addEventListener("click", onAgree);

        $("input").addEventListener("input", function () {
            autoGrow();
            $("send").disabled = busy || !$("input").value.trim();
        });

        $("input").addEventListener("keydown", function (e) {
            // 手机上是回车换行，桌面上是 Ctrl/Cmd+Enter 发送
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send();
            }
        });

        $("send").addEventListener("click", send);
        $("back").addEventListener("click", leaveChat);

        bindViewport();
        showProtocol();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
