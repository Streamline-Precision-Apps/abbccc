if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>i(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(n(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Calendar.svg",revision:"9de4bc2b869a1f7da5ff08e5560c7365"},{url:"/Inbox.svg",revision:"092c367c507b6d2bef5032e8f7fc61c0"},{url:"/Settings.svg",revision:"0229e611da8cd1cd10b16b5c1accfedc"},{url:"/_next/static/chunks/1132-f1b562b45c7db25a.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/1229-d6e758ded0475aa6.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/1333-975b26b4ea7c7e63.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/1650-953d6623d1aa1caa.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/2279-b8b97ba4834f9e44.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/2285-dcce56ad8ddd8d24.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/2347-86a4af7c4b855820.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/2586-6581820b3e37ae44.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/2791-7623ec5b12a87ef9.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/304-4f4dbfdc582afd09.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/3149-51f2884d41db0a02.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/3340-39d563315921bebd.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/3816-d0054e3af6f693bd.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/5338-a0cea32c33189e6d.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/5798-cc206a57607af64c.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/5961-b6017f81159eee01.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/655-a64704ee3061c340.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/6997-9367f8002633280d.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/7215-616738784c4b2df4.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/7526-60076c26da4c98e9.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/8215.14f885dd5ba30ded.js",revision:"14f885dd5ba30ded"},{url:"/_next/static/chunks/8277-5acd26387a1f50ce.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/8376-d65b7d94f3d33e04.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/8792-b3d94f742e984254.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/9356-5d7b0f94a716d9eb.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/9653-ced1a7697835235a.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/9741-cf6f67c90e21109d.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/9752-0c463353452ee3a1.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/aaea2bcf-6962612a017290e0.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@search/default-bd7cae914e8fd521.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@search/page-120683c4f65d886a.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/%5Bequipment%5D/page-cf96029108259adf.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/%5Bid%5D/page-1ef06d2855f14fbc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/page-76f428f896be1cbb.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/%5Bid%5D/page-c6919438b14ed783.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/page-f5b3af46c779cc78.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-cost-codes/page-5da007c58683fa0d.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-equipment/page-f5e91eeb95b33aa4.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-jobsite/page-e851820bbd50824f.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-tag/page-6d3955c33f5e3557.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/page-57a629253a9e8ed0.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/tags/%5Bid%5D/page-fd3bc347b57cce80.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/tags/page-3f57cb95a617d9c3.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/default-41ba51aee4f816bc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/layout-daf5c284bd5ed6b3.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/assets/page-21e4668696510e84.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@search/default-3433a2d1069a8dd0.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@search/page-5a22b030d87ae497.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/%5Bid%5D/page-ca0b023429e20f36.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/new-request/page-8973b113a8122440.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/page-289a770759506809.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/default-7455bf2ad9cfc5c5.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/layout-68ce7aaa3cbaf039.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/page-55508eb29150211a.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/layout-b0e2125bc85352fc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/page-a96b9938690d994f.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@search/default-e9143b6de67c987e.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@search/page-2a53ae82cae1fe01.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/%5Bemployee%5D/page-01c6eb2127445525.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/%5Bcrew%5D/page-7b5c09b57173086a.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/new-crew/page-891f12dfd54c4fc8.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/page-bd3455f21840b74d.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/new-employee/page-bdd626e04f8be63e.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/page-69ea5374ed1679f9.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/timesheets/%5Bemployee%5D/page-902dcfb45dfc331e.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/default-153346575cbaa666.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/layout-b642295c0cde8839.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/page-854a5866ddc5ed8f.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/reports/@search/page-4486ee1275c38bd7.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/reports/@view/page-938014ddffc7f230.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/reports/layout-28f0afbc659ec11b.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/reports/page-198796c24a6593cc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/admins/settings/page-456200a4e0038f75.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/break/page-db6d19e237938a1a.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/clock/page-54a07ef62725c15c.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/clock-out/(components)/log/page-4972ea8ec5632ebc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/clock-out/page-3a3baf414dd40290.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/equipment/%5Bid%5D/page-f996ceeb53d43147.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/equipment/page-880b3a97741c7596.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/forms/(forms)/report-bug/page-2f53e27caa2738a9.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/forms/page-4a934e9690163306.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/log-new/page-38ed85c388bf88b2.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/employee/%5BemployeeId%5D/page-11bd07cd93ceb51e.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/page-32651469e1ec0340.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/timecards/page-46f63a24d6227c2f.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/page-ebd8da3a067e4b80.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/page-6ddb2b39d16570cc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-equipment/page-60907a22b0934dde.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-jobsite/page-d8972a2681ef0096.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/page-60c04c0d861e131b.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/switch-jobs/page-30cd4ab8f5b3be4b.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/add-drive/page-2998a286011505a6.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/form/page-c0354ee8cff18cbf.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/page-ee96fd1359dccbfc.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/signin/forgot-password/page-4a40fff2a31c52aa.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/signin/new-password/page-b70a42c3b890cad8.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/signin/page-a994ac584686014e.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/signin/signup/page-a0c4810daa62498c.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/(routes)/timesheets/page-b35fa9a6a2b7df2d.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/_not-found/page-630732db21505395.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/changePassword/page-f894571a38d31cdb.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/inbox/form/page-85657e7ed770e76e.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/inbox/page-c33aed8218d54e95.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/inbox/received/%5Bid%5D/page-ec51ba5860990968.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/%5Bid%5D/page-645eac1460465979.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/approved/page-0a4f77908ff192b8.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/denied/page-3f4d718254b8d536.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/profile/page-20ccefdb349b96f2.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/hamburger/settings/page-d6a66d0e6bd11290.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/layout-ab5881c333866bdd.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/not-found-f182b78a2f9c1ecd.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/app/page-56be9ff236280637.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/fd9d1056-00acd23b90364850.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/main-96c11e27b24deb68.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/main-app-27a20e1c77657182.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/pages/_app-3c9ca398d360b709.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ae3de69b075b4c4c.js",revision:"kiE5S_yJCje6kingY5G69"},{url:"/_next/static/css/3a24c022f69a36a9.css",revision:"3a24c022f69a36a9"},{url:"/_next/static/css/686b2bb1a182bcee.css",revision:"686b2bb1a182bcee"},{url:"/_next/static/css/86ff4d37a022af21.css",revision:"86ff4d37a022af21"},{url:"/_next/static/css/bd3e86b47b870895.css",revision:"bd3e86b47b870895"},{url:"/_next/static/css/fe7f853c81d41c3e.css",revision:"fe7f853c81d41c3e"},{url:"/_next/static/kiE5S_yJCje6kingY5G69/_buildManifest.js",revision:"6310079bf1ae7bebeb6a2135896e4564"},{url:"/_next/static/kiE5S_yJCje6kingY5G69/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/1ff84563a719c397-s.woff2",revision:"e712ed5089ed58f92ea8fdc63424ecf5"},{url:"/_next/static/media/4c7655c11f7bd97b-s.p.woff2",revision:"38800f6020b9402854bbc3527199612c"},{url:"/_next/static/media/5df40a3eb8df1a4c-s.p.woff2",revision:"2f46a0d75dfff5f623a08402583e7ee9"},{url:"/_next/static/media/75cde960c2842862-s.woff2",revision:"8ba5d067487510340d843c0a3c0d9949"},{url:"/_next/static/media/92c2336771404627-s.woff2",revision:"e456d9e276ba68ad76f65962e88fab81"},{url:"/_next/static/media/ajax-loader.0b80f665.gif",revision:"0b80f665"},{url:"/_next/static/media/slick.25572f22.eot",revision:"25572f22"},{url:"/_next/static/media/slick.653a4cbb.woff",revision:"653a4cbb"},{url:"/_next/static/media/slick.6aa1ee46.ttf",revision:"6aa1ee46"},{url:"/_next/static/media/slick.f895cfdf.svg",revision:"f895cfdf"},{url:"/admin-sm.svg",revision:"4e4d775800c20779586a23e9a047f924"},{url:"/backArrow.svg",revision:"da74415b88ccd51c33a79f7009eb35e5"},{url:"/biometrics.svg",revision:"90f9c38f35305155d0d921156292b7db"},{url:"/break.svg",revision:"a9e520058faa1a47873f3ebba298c6c6"},{url:"/camera.svg",revision:"739de149ec873f07336818d576da3671"},{url:"/clock-in.svg",revision:"5cc76380767642af5976ce8741b7ee8f"},{url:"/clock-out.svg",revision:"b60f7aa110e5777db4188628fe63b802"},{url:"/clock.svg",revision:"0527e223336c6ad980b4bbf29f24a541"},{url:"/clockedIn.svg",revision:"14c95ea7f9e2dd1be61d85a271fbccbc"},{url:"/clockedOut.svg",revision:"4f9a601be0a183490ebdb359f8c18692"},{url:"/comment.svg",revision:"39d21138041caf591a59da0b88f5a961"},{url:"/current-equipment.svg",revision:"972eb4e8c271e0ab53e1a3e647a6f0f1"},{url:"/downArrow.svg",revision:"aaab7feb54f041c46e18042a3536b13c"},{url:"/drag.svg",revision:"4e1daf8f41d29612303381ff1bf2f422"},{url:"/edit-form.svg",revision:"161147557471d61b7dc3ec6aa913654a"},{url:"/end-day.svg",revision:"2225798f9c80e7005cad42cfc1dbf93a"},{url:"/equipment.svg",revision:"765560d85bac6e035e0e5b7922526817"},{url:"/equipmentSubmit.png",revision:"d6a2e187205020214845c525943b8f99"},{url:"/eraser.svg",revision:"5f83641cc313e902e8915115cca46d3b"},{url:"/expandLeft.svg",revision:"dee268e91a5aeef03393cf16c186450c"},{url:"/eye-slash.svg",revision:"705b334d7e6debae9b4bcc4cf27e33b1"},{url:"/eye.svg",revision:"005402d6c94e1ffb59b9fcbe7f614059"},{url:"/favicon_io/android-chrome-192x192.png",revision:"07281900d7ffa5690cc984da6e613805"},{url:"/favicon_io/android-chrome-512x512.png",revision:"ee520bf09fd4e101b8952887694905fc"},{url:"/favicon_io/apple-touch-icon.png",revision:"6f682a595255e6aab2bf0f2daa78403a"},{url:"/favicon_io/favicon-16x16.png",revision:"2d00862eea3e0a26607d3d0ce24d1747"},{url:"/favicon_io/favicon-32x32.png",revision:"84f7a4563c6fb8cd905f2dbedcffede8"},{url:"/favicon_io/site.webmanifest",revision:"053100cb84a50d2ae7f5492f7dd7f25e"},{url:"/form.svg",revision:"a35402b6d479f34ad3b549785598a7f1"},{url:"/forwardArrow.svg",revision:"a2b678c76996903036d84d5c89aa2dfb"},{url:"/home.svg",revision:"50a825dab6f5e92f45b8addccf7985f1"},{url:"/icon-192x192.png",revision:"f2cb51e1461b8abf460df455d269dc13"},{url:"/icon-384x384.png",revision:"99d1987d20b874836d950b95586968ae"},{url:"/icon-512x512.png",revision:"c16feee422d814c946012979c0d02f00"},{url:"/inbox-sm.svg",revision:"2dc0b94129840c59c8b6161195c2eef7"},{url:"/injury.svg",revision:"625eabed27919428c5e8aab838cc69f2"},{url:"/jobsite.svg",revision:"c8edd9826da9b48ee2aa2704bd615a2b"},{url:"/key.svg",revision:"0f028cc9d6580dbbddfb480589ff2e25"},{url:"/language.svg",revision:"1efe74a3132b6106c6cdf88522eb90d9"},{url:"/list.svg",revision:"57868fe9d4dccd2eb31df472b3e2bd28"},{url:"/logo.svg",revision:"5013b0a843053e8d6d5a440fda05d2d6"},{url:"/magnifyingGlass.svg",revision:"a9c40b79190bd3d8a176acc01266e0b2"},{url:"/manifest.json",revision:"60c9a2466798a0f00e8bf274fa7e5f63"},{url:"/ongoing.svg",revision:"3efff004f1392862e938669f0bb65b90"},{url:"/person.svg",revision:"e8731cb0a913b8af5dc73b5e03eddc37"},{url:"/plus.svg",revision:"0b79f0a634d27010a0a06eb78c130ca1"},{url:"/profile-default.svg",revision:"94707b315bf413dd3b5311475eba7478"},{url:"/profile-sm.svg",revision:"51f312b77b5853c99ab56c5f0602c010"},{url:"/qr.svg",revision:"ce7279da70aaf0dc0a5c45d028517cb9"},{url:"/save-edit.svg",revision:"d75cb71852091f18a83a7c2e30471778"},{url:"/settings-sm.svg",revision:"21ef24cf84e23e6157a7a311b729802b"},{url:"/shiftScanLogo.svg",revision:"4e8ca932058d8f8b165df2892e241641"},{url:"/shiftscanlogoHorizontal.svg",revision:"424537f3cb1e54ebab9d2b8bcfe2f9c3"},{url:"/spinner.svg",revision:"1a71d33ba295f6737f31c4955932db2c"},{url:"/star.svg",revision:"5c311edc3093435e1ab27e50a5a7d73a"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"},{url:"/tasco.svg",revision:"06ca0e6de3cad1beffe2dfb6790545f2"},{url:"/team.svg",revision:"7e6842913d4e85c43fd6995760003c18"},{url:"/trash.svg",revision:"fc7d330b7bd6b58b59f1841865700c09"},{url:"/trucking.svg",revision:"6f7dba7191fe2fd70fca921f5e94c17a"},{url:"/turnBack.svg",revision:"576dc3082777e03f3cee11cd96aa96a1"},{url:"/undo-edit.svg",revision:"4dfbfce951fa87f16774e6f8eff9fbc9"},{url:"/x.svg",revision:"f5bb4dbea4bcd2b0f2c79320047c8cff"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
