/* 测试人员协议两版正文。
 *
 * 放在这里而不是单独的 .md，是因为要整段塞进弹窗，而且必须随语言切换重新渲染。
 * 条款编号和 TAI Teens 测试人员协议.md 一一对应，改条款时两边一起改——服务端记录的
 * 版本号（PROTOCOL_VERSION）也要跟着动，否则分不清谁同意的是哪一版。
 */
window.TAI_PROTOCOL = {
    version: "2026-11-01",

    zh: `
<h3>第一条　测试性质与服务连续性风险</h3>
<p>本项目为非正式商业版本的内部测试（Beta 测试）与安全红队测试（Red Teaming）。测试目的是评估情感陪伴模型的对话质量、拟人化表现，以及在极端或恶意输入下的安全边界。</p>
<p><strong>服务随时可能中断。</strong>本测试为临时性开放，我们不保证服务的连续性与稳定性。测试通道可能不定时、无预警地关闭、重启或直接下线，模型也可能随时被修改。请知悉并接受由此带来的体验中断。</p>

<h3>第二条　数据收集与隐私保护</h3>
<p><strong>无需登录，匿名参与。</strong>本测试不要求注册账号，也严禁输入姓名、住址、电话等任何真实个人身份信息。</p>
<p><strong>对话会被记录。</strong>为优化体验并进行模型安全对齐，我们会在后台记录你与模型的对话内容（仅限文本）。我们承诺：</p>
<ul>
<li>所有对话数据<strong>仅用于</strong> TAI Research 的模型训练、效果评估与攻防安全案例库建设；</li>
<li>不会以任何形式向第三方出售或公开披露（脱敏后的红队攻击案例分享除外）。</li>
</ul>
<p><em>请勿将本产品作为倾诉真实隐私（真实姓名、家庭住址、账户密码）的树洞。</em></p>

<h3>第三条　红队规则</h3>
<p>作为参与红队测试的成员，你可以尝试使用激进、尖锐甚至带有攻击性的语言来测试模型的底线，但必须遵守以下红线：</p>
<ul>
<li><strong>严禁违法内容。</strong>不得输入、生成或传播任何违反中华人民共和国法律法规的内容，包括但不限于涉黄、涉暴、恐怖主义、危害国家安全、侵犯他人隐私或诽谤他人的内容。</li>
<li><strong>严禁系统攻击。</strong>不得使用自动化脚本（爬虫、并发压测工具）恶意消耗算力，不得尝试 DDoS 攻击、注入攻击或获取系统源代码。</li>
<li><strong>未成年人须知。</strong>若你未满 18 周岁，请在监护人知情的情况下参与测试，且不得刻意生成严重越界或有害身心健康的内容。</li>
</ul>

<h3>第四条　免责声明</h3>
<p><strong>内容不代表平台立场。</strong>本测试涉及红队攻击，模型在受到极端诱导时可能生成不符合常理、不准确或令你不适的内容。这些内容纯属 AI 算法的概率性输出，绝不代表 TAI Research 的价值观、立场或观点。</p>
<p><strong>心理承受提示。</strong>AI 不是真人，不能替代专业心理医生，请勿过度沉迷。因你自身心理状况、过度代入或受生成内容刺激而导致的不良后果，平台不承担法律责任。</p>
<p><strong>数据丢失风险。</strong>因网络中断、服务器重启、临时关服或程序缺陷导致的对话中断或数据丢失，平台不承担责任。</p>

<h3>第五条　知识产权与反馈</h3>
<p>如在社交媒体分享测试体验，请注明「AI 生成内容，仅供娱乐」，且不得断章取义损害 TAI Research 名誉。</p>
<p>如通过指定渠道提交 Bug 反馈或红队攻击成功案例，我们默认你授权在未来的产品优化中参考你的思路，且无需支付报酬。</p>

<h3>第六条　协议的变更与终止</h3>
<p>我们有权随时修改本协议，修改后的协议将在测试页面公示。</p>
<p>如你违反第三条中的任何一条红线，我们有权通过 IP 限制、设备指纹封禁等技术手段立即终止你的测试权限。</p>
`,

    en: `
<h3>1. Nature of the Test and Service Continuity</h3>
<p>This is a <strong>non-commercial internal beta</strong> and a <strong>security red-teaming exercise</strong>. Its purpose is to evaluate the conversational quality and human-likeness of companion models, and to probe their safety boundaries under extreme or hostile input.</p>
<p><strong>The service may go down at any time.</strong> This is a temporary channel. We do not guarantee continuity or stability. It may be closed, restarted, or taken offline without notice, and the models may change at any moment.</p>

<h3>2. Data Collection and Privacy</h3>
<p><strong>No login. Anonymous.</strong> No account is required. Do not enter your real name, address, phone number, or any other identifying information.</p>
<p><strong>Conversations are recorded.</strong> To improve the product and to align the models, we record the text of your conversations with the models. Specifically:</p>
<ul>
<li>Conversation data is used <strong>only</strong> for model training, evaluation, and a red-team case library at TAI Research;</li>
<li>It will not be sold or publicly disclosed in any form, except for anonymised red-team case studies.</li>
</ul>
<p><em>Do not use this product as a confessional for real personal secrets.</em></p>

<h3>3. Red-Team Rules</h3>
<p>You may use aggressive, cutting, or hostile language to test the models' limits, but the following are absolute:</p>
<ul>
<li><strong>No unlawful content.</strong> Do not input, generate, or distribute content that violates the laws of the People's Republic of China, including sexual content, violence, terrorism, threats to national security, privacy violations, or defamation.</li>
<li><strong>No attacks on the system.</strong> Do not use automated scripts, crawlers, or load-testing tools to consume compute. Do not attempt DDoS, injection, or to obtain source code.</li>
<li><strong>Minors.</strong> If you are under 18, participate only with a guardian's knowledge, and do not deliberately generate severely harmful content.</li>
</ul>

<h3>4. Disclaimer</h3>
<p><strong>Model output is not the platform's position.</strong> Under adversarial prompting the models may produce content that is nonsensical, inaccurate, or upsetting. Such output is a probabilistic artefact of the model and does not represent the views of TAI Research.</p>
<p><strong>Not a substitute for care.</strong> The AI is not a person and cannot replace a mental-health professional. Do not over-rely on it. The platform accepts no liability for harm arising from your own psychological state or from over-identification with the model.</p>
<p><strong>Data loss.</strong> The platform is not liable for interrupted conversations or lost data caused by network failure, restarts, downtime, or software defects.</p>

<h3>5. Intellectual Property and Feedback</h3>
<p>If you share your experience on social media, note that it is "AI-generated content, for entertainment only", and do not misrepresent it to harm TAI Research's reputation.</p>
<p>If you submit bug reports or successful red-team cases through the designated channels, you grant us permission to draw on them in future product work, without compensation.</p>

<h3>6. Changes and Termination</h3>
<p>We may revise this agreement at any time; the current version is always displayed on the test page.</p>
<p>If you violate any item in Section 3, we may terminate your access immediately by IP restriction, device fingerprinting, or similar technical means.</p>
`
};
