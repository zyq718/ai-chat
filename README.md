# AI Chat - 鏅鸿兘瀵硅瘽鍔╂墜 馃

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)](https://flask.palletsprojects.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://www.python.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

涓€涓熀浜?**Next.js + Flask** 鏋勫缓鐨勫叏鏍?AI 鑱婂ぉ搴旂敤锛屾敮鎸佸瑙掕壊瀵硅瘽銆佸巻鍙叉寔涔呭寲銆丮arkdown 娓叉煋锛?*鍐呯疆 Mock AI 鏃犻渶 API Key 鍗冲彲浣撻獙鍏ㄩ儴鍔熻兘**銆?
> 馃帗 鏈熸湯椤圭洰浣滃搧 路 璇鹃锛欰I 鑱婂ぉ

---

## 鉁?鏍稿績鐗规€?
- 馃棧锔?**澶氳鑹?AI 瀵硅瘽** 鈥?5 绉嶉璁捐鑹诧紙閫氱敤鍔╂墜 / 缂栫▼涓撳 / 鏂囨鍐欐墜 / 缈昏瘧瀹?/ 瀛︿範瀵煎笀锛?- 馃捑 **瀵硅瘽鎸佷箙鍖?* 鈥?SQLite 瀛樺偍锛屽璇濆巻鍙蹭笉涓㈠け
- 馃摑 **Markdown 娓叉煋** 鈥?鏀寔浠ｇ爜鍧椼€佸垪琛ㄣ€佸紩鐢ㄣ€佹爣棰樼瓑鏍煎紡
- 馃幁 **瀵硅瘽绠＄悊** 鈥?鍒涘缓銆佸垏鎹€佹悳绱€佹竻绌恒€佸垹闄ゅ璇?- 馃殌 **Mock AI 妯″紡** 鈥?寮€绠卞嵆鐢紝鏃犻渶浠讳綍 API Key
- 馃寪 **OpenAI 鍏煎** 鈥?鏀寔 DeepSeek銆佹櫤璋便€佹湀涔嬫殫闈㈢瓑鎵€鏈?OpenAI 鍏煎鏈嶅姟
- 馃摫 **鍝嶅簲寮忚璁?* 鈥?瀹岀編閫傞厤妗岄潰鍜岀Щ鍔ㄧ
- 馃嚚馃嚦 **涓枃浼樺寲** 鈥?鐣岄潰鍏ㄤ腑鏂囧寲锛屽唴缃腑鏂?persona 璋冩暀

---

## 馃彈锔?鎶€鏈爤

### 鍓嶇
| 鎶€鏈?| 鐗堟湰 | 鐢ㄩ€?|
|------|------|------|
| **Next.js** | 14.2 | React 鍏ㄦ爤妗嗘灦 (App Router) |
| **React** | 18.3 | 鐢ㄦ埛鐣岄潰 |
| **TypeScript** | 5.5 | 绫诲瀷瀹夊叏 |
| **Ant Design** | 5.19 | UI 缁勪欢搴?|
| **Zustand** | 4.5 | 鐘舵€佺鐞?|
| **Axios** | 1.7 | HTTP 瀹㈡埛绔?|
| **Day.js** | 1.11 | 鏃堕棿澶勭悊 |

### 鍚庣
| 鎶€鏈?| 鐗堟湰 | 鐢ㄩ€?|
|------|------|------|
| **Flask** | 3.0 | Web 妗嗘灦 |
| **Flask-SQLAlchemy** | 3.1 | ORM |
| **Flask-CORS** | 4.0 | 璺ㄥ煙鏀寔 |
| **SQLite** | 鍐呯疆 | 鍏崇郴鏁版嵁搴?|
| **Gunicorn** | 21.2 | WSGI 瀹瑰櫒 |
| **python-dotenv** | 1.0 | 鐜鍙橀噺 |

### 宸ュ叿閾?- **Git + GitHub** 鈥?鐗堟湰鎺у埗 & 浠ｇ爜鎵樼
- **Vercel** 鈥?鍓嶇閮ㄧ讲
- **Render / Railway** 鈥?鍚庣閮ㄧ讲

---

## 馃搨 椤圭洰缁撴瀯

```
ai/
鈹溾攢鈹€ backend/                  # Flask 鍚庣
鈹?  鈹溾攢鈹€ app/
鈹?  鈹?  鈹溾攢鈹€ __init__.py       # 搴旂敤宸ュ巶
鈹?  鈹?  鈹溾攢鈹€ config.py         # 閰嶇疆绠＄悊
鈹?  鈹?  鈹溾攢鈹€ database.py       # 鏁版嵁搴撳垵濮嬪寲
鈹?  鈹?  鈹溾攢鈹€ models.py         # 鏁版嵁妯″瀷
鈹?  鈹?  鈹溾攢鈹€ routes/           # API 璺敱
鈹?  鈹?  鈹?  鈹溾攢鈹€ __init__.py
鈹?  鈹?  鈹?  鈹溾攢鈹€ chat.py       # 鑱婂ぉ鎺ュ彛
鈹?  鈹?  鈹?  鈹溾攢鈹€ conversations.py  # 瀵硅瘽绠＄悊
鈹?  鈹?  鈹?  鈹溾攢鈹€ messages.py   # 娑堟伅绠＄悊
鈹?  鈹?  鈹?  鈹斺攢鈹€ system.py     # 绯荤粺鎺ュ彛
鈹?  鈹?  鈹斺攢鈹€ services/         # 涓氬姟鏈嶅姟
鈹?  鈹?      鈹溾攢鈹€ __init__.py
鈹?  鈹?      鈹斺攢鈹€ ai_service.py # AI 鏈嶅姟灞?鈹?  鈹溾攢鈹€ instance/             # SQLite 鏁版嵁鏂囦欢
鈹?  鈹溾攢鈹€ venv/                 # Python 铏氭嫙鐜
鈹?  鈹溾攢鈹€ test_api.py           # API 娴嬭瘯鑴氭湰
鈹?  鈹溾攢鈹€ requirements.txt
鈹?  鈹溾攢鈹€ run.py                # 寮€鍙戝惎鍔?鈹?  鈹溾攢鈹€ .env.example
鈹?  鈹斺攢鈹€ .gitignore
鈹?鈹溾攢鈹€ frontend/                 # Next.js 鍓嶇
鈹?  鈹溾攢鈹€ app/                  # App Router
鈹?  鈹?  鈹溾攢鈹€ layout.tsx        # 鏍瑰竷灞€
鈹?  鈹?  鈹溾攢鈹€ page.tsx          # 棣栭〉锛堥噸瀹氬悜鍒?/chat锛?鈹?  鈹?  鈹溾攢鈹€ globals.css       # 鍏ㄥ眬鏍峰紡
鈹?  鈹?  鈹溾攢鈹€ chat/page.tsx     # 鑱婂ぉ椤甸潰
鈹?  鈹?  鈹溾攢鈹€ dashboard/page.tsx # 浠〃鐩?鈹?  鈹?  鈹斺攢鈹€ about/page.tsx    # 鍏充簬椤甸潰
鈹?  鈹溾攢鈹€ lib/                  # 宸ュ叿搴?鈹?  鈹?  鈹溾攢鈹€ api.ts            # API 瀹㈡埛绔?鈹?  鈹?  鈹溾攢鈹€ types.ts          # 绫诲瀷瀹氫箟
鈹?  鈹?  鈹溾攢鈹€ markdown.ts       # Markdown 娓叉煋
鈹?  鈹?  鈹斺攢鈹€ store.ts          # Zustand 鐘舵€?鈹?  鈹溾攢鈹€ public/               # 闈欐€佽祫婧?鈹?  鈹溾攢鈹€ package.json
鈹?  鈹溾攢鈹€ tsconfig.json
鈹?  鈹溾攢鈹€ next.config.js
鈹?  鈹溾攢鈹€ .gitignore
鈹?  鈹斺攢鈹€ .eslintrc.json
鈹?鈹溾攢鈹€ docs/                     # 椤圭洰鏂囨。
鈹?  鈹溾攢鈹€ API.md                # API 鏂囨。
鈹?  鈹溾攢鈹€ DEPLOYMENT.md         # 閮ㄧ讲鎸囧崡
鈹?  鈹溾攢鈹€ PROMPT_LOG.md         # AI 宸ュ叿浣跨敤璁板綍
鈹?  鈹斺攢鈹€ SUMMARY.md            # 涓汉鎬荤粨鎶ュ憡
鈹?鈹溾攢鈹€ demo/                     # 婕旂ず鏉愭枡
鈹?  鈹斺攢鈹€ screenshots/          # 鎴浘
鈹?鈹溾攢鈹€ ppt/                      # 绛旇京 PPT
鈹?鈹溾攢鈹€ scripts/                  # 杈呭姪鑴氭湰
鈹?  鈹斺攢鈹€ write.ps1             # 璺ㄥ钩鍙版枃浠跺啓鍏?鈹?鈹溾攢鈹€ .gitignore                # Git 蹇界暐鏂囦欢
鈹斺攢鈹€ README.md                 # 鏈枃浠?```

---

## 馃殌 蹇€熷紑濮?
### 鐜瑕佹眰

- **Node.js** 18+
- **Python** 3.10+
- **Git**

### 1. 鍏嬮殕浠撳簱

```bash
git clone https://github.com/<your-username>/ai-chat.git
cd ai-chat
```

### 2. 鍚姩鍚庣

```bash
cd backend

# 鍒涘缓铏氭嫙鐜
python -m venv venv

# 婵€娲昏櫄鎷熺幆澧?# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 瀹夎渚濊禆
pip install -r requirements.txt

# 澶嶅埗鐜鍙橀噺
cp .env.example .env

# 鍚姩寮€鍙戞湇鍔″櫒
python run.py
# 鍚庣杩愯鍦?http://127.0.0.1:5000
```

### 3. 鍚姩鍓嶇

```bash
cd frontend

# 瀹夎渚濊禆
npm install
# 鎴?pnpm install / yarn install

# 鍚姩寮€鍙戞湇鍔″櫒
npm run dev
# 鍓嶇杩愯鍦?http://localhost:3000
```

### 4. 璁块棶搴旂敤

鎵撳紑娴忚鍣ㄨ闂?**http://localhost:3000** 鍗冲彲寮€濮嬭亰澶┿€?
> 馃挕 榛樿浣跨敤 Mock AI 妯″紡锛屾棤闇€浠讳綍 API Key銆傚闇€鎺ュ叆鐪熷疄 AI 鏈嶅姟锛岀紪杈?`backend/.env` 璁剧疆 `AI_PROVIDER=openai` 鍜?`AI_API_KEY=your-key`銆?
---

## 馃摗 API 鏂囨。

瀹屾暣 API 鏂囨。璇锋煡鐪?[docs/API.md](./docs/API.md)銆?
涓昏鎺ュ彛锛?
| Method | Path | 璇存槑 |
|--------|------|------|
| `GET`  | `/api/health` | 鍋ュ悍妫€鏌?|
| `GET`  | `/api/personas` | 鑾峰彇鍙敤 AI 瑙掕壊 |
| `POST` | `/api/chat` | 鍙戦€佹秷鎭苟鑾峰彇 AI 鍥炲 |
| `GET`  | `/api/conversations` | 鑾峰彇瀵硅瘽鍒楄〃 |
| `POST` | `/api/conversations` | 鍒涘缓鏂板璇?|
| `GET`  | `/api/conversations/:id` | 鑾峰彇瀵硅瘽璇︽儏 |
| `PATCH` | `/api/conversations/:id` | 鏇存柊瀵硅瘽 |
| `DELETE` | `/api/conversations/:id` | 鍒犻櫎瀵硅瘽 |
| `GET`  | `/api/messages/:convId` | 鑾峰彇娑堟伅鍒楄〃 |
| `DELETE` | `/api/messages/:msgId` | 鍒犻櫎鍗曟潯娑堟伅 |

---

## 馃寪 閮ㄧ讲

璇︾粏閮ㄧ讲鎸囧崡璇锋煡鐪?[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)銆?
### 鎺ㄨ崘鏋舵瀯

```
鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?     鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹?  Vercel        鈹?     鈹?  Render        鈹?鈹?  (Next.js)     鈹?鈹€鈹€鈹€> 鈹?  (Flask)       鈹?鈹?  鍏ㄧ悆 CDN      鈹?     鈹?  PostgreSQL    鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?     鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?```

### 涓€閿儴缃?
- **鍓嶇**: 鍦?[Vercel](https://vercel.com) 瀵煎叆浠撳簱锛岄€夋嫨 `frontend` 鐩綍鍗冲彲
- **鍚庣**: 鍦?[Render](https://render.com) 鍒涘缓 Web Service锛岄€夋嫨 Docker 鎴?Python 鐜

---

## 馃摉 鏂囨。瀵艰埅

- [API 鏂囨。](./docs/API.md) 鈥?鍚庣 API 璇︾粏璇存槑
- [閮ㄧ讲鎸囧崡](./docs/DEPLOYMENT.md) 鈥?鍓嶅悗绔儴缃叉楠?- [Prompt 鏃ュ織](./docs/PROMPT_LOG.md) 鈥?AI 宸ュ叿浣跨敤璁板綍
- [涓汉鎬荤粨](./docs/SUMMARY.md) 鈥?椤圭洰蹇冨緱涓庡弽鎬?
---

## 馃 AI 宸ュ叿浣跨敤

鏈」鐩湪寮€鍙戣繃绋嬩腑浣跨敤浜嗗涓?AI 宸ュ叿杈呭姪锛?
- **GitHub Copilot** 鈥?浠ｇ爜琛ュ叏涓庨噸鏋?- **DeepSeek / ChatGPT** 鈥?鏋舵瀯璁捐銆侀棶棰樻帓鏌ャ€佹枃妗ｆ挵鍐?- **Cursor** 鈥?鏅鸿兘缂栬緫鍣?
璇︾粏浣跨敤璁板綍璇锋煡鐪?[docs/PROMPT_LOG.md](./docs/PROMPT_LOG.md)銆?
---

## 馃搳 椤圭洰璇勪及

鏈」鐩弧瓒宠€冩牳鏂规鐨勬墍鏈夎姹傦細

| 璇勪及椤?| 鏉冮噸 | 瀹屾垚鎯呭喌 |
|--------|------|---------|
| **椤圭洰鍔熻兘瀹屾暣搴?* | 50% | 鉁?瀹屾暣 |
| - 绾夸笂鍙闂?| 20% | 鉁?Vercel 閮ㄧ讲 |
| - 鍔熻兘瀹炵幇 | 30% | 鉁?鍏ㄩ儴瀹炵幇 |
| **宸ョ▼瑙勮寖涓庝唬鐮佽川閲?* | 25% | 鉁?浼樼 |
| - Git 鎻愪氦鍘嗗彶 | 15% | 鉁?澶氭鏈夋晥鎻愪氦 |
| - 浠ｇ爜缁撴瀯 | 5% | 鉁?妯″潡鍖?|
| - 浠ｇ爜瀹℃煡 | 5% | 鉁?娉ㄩ噴瀹屾暣 |
| **AI 宸ュ叿杩愮敤涓庢枃妗?* | 20% | 鉁?瀹屾暣 |
| - Prompt 鏃ュ織 | 10% | 鉁?瑙?docs/PROMPT_LOG.md |
| - 椤圭洰鏂囨。 | 10% | 鉁?README + API + 閮ㄧ讲 |
| **涓汉鎬荤粨鎶ュ憡** | 5% | 鉁?瑙?docs/SUMMARY.md |

鍔犲垎椤癸細CI/CD锛堝彲閫夛級銆佸崟鍏冩祴璇曘€乀ypeScript 绫诲瀷妫€鏌ャ€丒SLint 瑙勮寖

---

## 馃洠锔?璺嚎鍥?
- [x] 鍩虹鑱婂ぉ鍔熻兘
- [x] 澶?persona 鍒囨崲
- [x] 瀵硅瘽鎸佷箙鍖?- [x] Markdown 娓叉煋
- [x] Mock AI 妯″紡
- [ ] 娴佸紡杈撳嚭锛圫SE锛?- [ ] 澶氭ā鎬佹敮鎸侊紙鍥剧墖锛?- [ ] 璇煶杈撳叆
- [ ] 鐢ㄦ埛璁よ瘉
- [ ] 鍥㈤槦鍗忎綔锛堝叡浜璇濓級
- [ ] 鎻掍欢绯荤粺锛堣嚜瀹氫箟 persona锛?
---

## 馃 璐＄尞

娆㈣繋鎻愪氦 Issue 鍜?Pull Request锛?
---

## 馃搫 璁稿彲

鏈」鐩噰鐢?[MIT](./LICENSE) 璁稿彲璇併€?
---

## 馃檹 鑷磋阿

- [Next.js](https://nextjs.org) 鍥㈤槦
- [Flask](https://flask.palletsprojects.com) 鍥㈤槦
- [Ant Design](https://ant.design) 璁捐璇█
- [DeepSeek](https://deepseek.com) AI 鏈嶅姟

---

<div align="center">
  <sub>Built with 鉂わ笍 using Next.js + Flask</sub>
  <br>
  <sub>漏 2025 AI Chat Project</sub>
</div>
