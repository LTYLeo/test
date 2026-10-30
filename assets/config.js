/* 推理服务的地址。
 *
 * ngrok 每次启动域名都会变，所以单独放一个文件——换域名只改这一行，不用碰业务代码。
 * 也可以用 ?api=https://xxx.ngrok-free.app 临时覆盖，方便本地调试。
 */
window.TAI_API = (function () {
    var q = new URLSearchParams(location.search).get("api");
    if (q) return q.replace(/\/$/, "");
    return "https://110a-61-163-248-199.ngrok-free.app";
})();
