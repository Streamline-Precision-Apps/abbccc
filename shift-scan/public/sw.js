if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>i(e,t),u={module:{uri:t},exports:c,require:r};s[t]=Promise.all(a.map((e=>u[e]||r(e)))).then((e=>(n(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Calendar.svg",revision:"9de4bc2b869a1f7da5ff08e5560c7365"},{url:"/Inbox.svg",revision:"092c367c507b6d2bef5032e8f7fc61c0"},{url:"/Settings.svg",revision:"0229e611da8cd1cd10b16b5c1accfedc"},{url:"/_next/static/HuO7iEh7dEZhUJy3C88ZI/_buildManifest.js",revision:"6310079bf1ae7bebeb6a2135896e4564"},{url:"/_next/static/HuO7iEh7dEZhUJy3C88ZI/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1229-d6e758ded0475aa6.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/1650-953d6623d1aa1caa.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/1857-04cbb19a0084d73e.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/2126-2f673a70a5a985e8.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/2285-dcce56ad8ddd8d24.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/2586-6581820b3e37ae44.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/2791-1f99524a1b7cb23a.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/304-76a8bfbe18662e47.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/3145-b285239fd4c9eb8f.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/3157-8da0fd5925452880.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/3340-cb5aaa2a99ed239d.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/3616-f071e9ccd0a86d15.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/3724-35213adcc4915d1e.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/3816-d0054e3af6f693bd.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/4036-0b153098fd5a1666.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/4402-72a95711108bdd22.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/5282-7684bde2df041a8f.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/5338-a0cea32c33189e6d.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/5798-5b2f10867601ad7b.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/5961-b6017f81159eee01.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/6721-7c6680dda342c614.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/6997-9367f8002633280d.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/7215-b08daf7a4e5980dd.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/7526-60076c26da4c98e9.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/8215.14f885dd5ba30ded.js",revision:"14f885dd5ba30ded"},{url:"/_next/static/chunks/8277-b006d352599f901b.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/8376-d65b7d94f3d33e04.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/9653-a366e6ac997bad62.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/9741-286c96db2460a702.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/aaea2bcf-6962612a017290e0.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@search/default-bd7cae914e8fd521.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@search/page-120683c4f65d886a.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/%5Bequipment%5D/page-db2138337e69daa3.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/%5Bid%5D/page-1ef06d2855f14fbc.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/page-aaf5ade19d0ab925.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/%5Bid%5D/page-c6919438b14ed783.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/page-f5b3af46c779cc78.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-cost-codes/page-5da007c58683fa0d.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-equipment/page-7f3333945dbf7b06.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-jobsite/page-e851820bbd50824f.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-tag/page-6d3955c33f5e3557.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/page-cbf6b4e880925670.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/tags/%5Bid%5D/page-fd3bc347b57cce80.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/tags/page-6e26ae93c6d0fd69.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/default-24ce85b665c19c2e.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/layout-78339cd31ec7c153.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/assets/page-1c5244e1c9fbbbf6.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@search/default-3433a2d1069a8dd0.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@search/page-5a22b030d87ae497.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/%5Bid%5D/page-ca0b023429e20f36.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/new-request/page-4243c7805216b2e0.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/page-4e8ae0eccb715efd.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/default-400aa677ef6103e6.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/layout-b0793cf3ad1ef6bc.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/page-55508eb29150211a.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/layout-df84997c2f43ce12.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/page-3204a86dea58adff.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@search/default-e9143b6de67c987e.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@search/page-2a53ae82cae1fe01.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/%5Bemployee%5D/page-77478bca82a4c6d4.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/%5Bcrew%5D/page-7b5c09b57173086a.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/new-crew/page-891f12dfd54c4fc8.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/page-1a11bb2ca35f5a19.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/new-employee/page-c663ce0f4db5ca60.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/page-d57d1159f0153ddd.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/timesheets/%5Bemployee%5D/page-350fb5bae532a84b.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/default-55f55351a42b2eb2.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/layout-9cd48cd635c80b16.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/page-68f0e69ed6225d71.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/reports/@search/page-e59c6eb178fb1352.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/reports/@view/page-aea19fb46a541648.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/reports/layout-4d819e6405f2f082.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/reports/page-198796c24a6593cc.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/admins/settings/page-68b260b779d9463c.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/break/page-7819559235b34467.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/clock/page-0b02946d270d8aeb.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/clock-out/(components)/log/page-4972ea8ec5632ebc.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/clock-out/page-a6bf454dcb0707be.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/equipment/%5Bid%5D/page-ce14764291872e7c.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/equipment/page-f71905ed20a1307d.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/forms/(forms)/report-bug/page-2f53e27caa2738a9.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/forms/page-4a934e9690163306.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/log-new/page-667f69b422c4f6ef.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/employee/%5BemployeeId%5D/page-fe733b9826db3a94.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/page-8f809d38f72564ef.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/timecards/page-46f63a24d6227c2f.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/page-cc395d77931a8c8f.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/page-b34e85f62971e7e2.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-equipment/page-53fc1f5370eafe26.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-jobsite/page-d8972a2681ef0096.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/page-e4d93eb4118eab30.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/switch-jobs/page-ca88d891f8a9e127.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/add-drive/page-e92984fbe9aff8be.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/form/page-c0354ee8cff18cbf.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/page-918d536cc9068cf5.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/signin/forgot-password/page-4a40fff2a31c52aa.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/signin/new-password/page-b70a42c3b890cad8.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/signin/page-03e14321c2117968.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/signin/signup/page-da0bfcab3712a223.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/(routes)/timesheets/page-6d6893e4a62ecc39.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/_not-found/page-2fb8e4a8c0fbae3b.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/changePassword/page-f2544412cdb6b442.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/inbox/form/page-85657e7ed770e76e.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/inbox/page-9077c8d957acbb1c.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/inbox/received/%5Bid%5D/page-91c653dced50dc79.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/%5Bid%5D/page-433704a3e2c0e19b.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/approved/page-0a4f77908ff192b8.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/denied/page-3f4d718254b8d536.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/profile/page-4442eb69a42aff25.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/hamburger/settings/page-74a8d7b86855c363.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/layout-e1fb0206d44483d6.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/not-found-d2cafa6385912251.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/app/page-dd15abc965414603.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/fd9d1056-00acd23b90364850.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/main-6095952c4f340f29.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/main-app-27a20e1c77657182.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/pages/_app-3c9ca398d360b709.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ae3de69b075b4c4c.js",revision:"HuO7iEh7dEZhUJy3C88ZI"},{url:"/_next/static/css/3a24c022f69a36a9.css",revision:"3a24c022f69a36a9"},{url:"/_next/static/css/7aa912f323473282.css",revision:"7aa912f323473282"},{url:"/_next/static/css/86ff4d37a022af21.css",revision:"86ff4d37a022af21"},{url:"/_next/static/css/bd3e86b47b870895.css",revision:"bd3e86b47b870895"},{url:"/_next/static/css/fe7f853c81d41c3e.css",revision:"fe7f853c81d41c3e"},{url:"/_next/static/media/1ff84563a719c397-s.woff2",revision:"e712ed5089ed58f92ea8fdc63424ecf5"},{url:"/_next/static/media/4c7655c11f7bd97b-s.p.woff2",revision:"38800f6020b9402854bbc3527199612c"},{url:"/_next/static/media/5df40a3eb8df1a4c-s.p.woff2",revision:"2f46a0d75dfff5f623a08402583e7ee9"},{url:"/_next/static/media/75cde960c2842862-s.woff2",revision:"8ba5d067487510340d843c0a3c0d9949"},{url:"/_next/static/media/92c2336771404627-s.woff2",revision:"e456d9e276ba68ad76f65962e88fab81"},{url:"/_next/static/media/ajax-loader.0b80f665.gif",revision:"0b80f665"},{url:"/_next/static/media/slick.25572f22.eot",revision:"25572f22"},{url:"/_next/static/media/slick.653a4cbb.woff",revision:"653a4cbb"},{url:"/_next/static/media/slick.6aa1ee46.ttf",revision:"6aa1ee46"},{url:"/_next/static/media/slick.f895cfdf.svg",revision:"f895cfdf"},{url:"/admin-sm.svg",revision:"4e4d775800c20779586a23e9a047f924"},{url:"/backArrow.svg",revision:"2690a3fe08866ea9844e1d75e03524dc"},{url:"/biometrics.svg",revision:"90f9c38f35305155d0d921156292b7db"},{url:"/break.svg",revision:"a9e520058faa1a47873f3ebba298c6c6"},{url:"/camera.svg",revision:"739de149ec873f07336818d576da3671"},{url:"/clock-in.svg",revision:"5cc76380767642af5976ce8741b7ee8f"},{url:"/clock-out.svg",revision:"b60f7aa110e5777db4188628fe63b802"},{url:"/clock.svg",revision:"0527e223336c6ad980b4bbf29f24a541"},{url:"/clockedIn.svg",revision:"14c95ea7f9e2dd1be61d85a271fbccbc"},{url:"/clockedOut.svg",revision:"4f9a601be0a183490ebdb359f8c18692"},{url:"/comment.svg",revision:"39d21138041caf591a59da0b88f5a961"},{url:"/current-equipment.svg",revision:"972eb4e8c271e0ab53e1a3e647a6f0f1"},{url:"/document-duplicate.svg",revision:"8c8239dee78c822863b5d6c5a2110482"},{url:"/downArrow.svg",revision:"aaab7feb54f041c46e18042a3536b13c"},{url:"/drag.svg",revision:"4e1daf8f41d29612303381ff1bf2f422"},{url:"/edit-form.svg",revision:"161147557471d61b7dc3ec6aa913654a"},{url:"/end-day.svg",revision:"2225798f9c80e7005cad42cfc1dbf93a"},{url:"/equipment.svg",revision:"765560d85bac6e035e0e5b7922526817"},{url:"/equipmentSubmit.png",revision:"d6a2e187205020214845c525943b8f99"},{url:"/eraser.svg",revision:"5f83641cc313e902e8915115cca46d3b"},{url:"/expandLeft.svg",revision:"dee268e91a5aeef03393cf16c186450c"},{url:"/eye-slash.svg",revision:"705b334d7e6debae9b4bcc4cf27e33b1"},{url:"/eye.svg",revision:"005402d6c94e1ffb59b9fcbe7f614059"},{url:"/favicon_io/android-chrome-192x192.png",revision:"07281900d7ffa5690cc984da6e613805"},{url:"/favicon_io/android-chrome-512x512.png",revision:"ee520bf09fd4e101b8952887694905fc"},{url:"/favicon_io/apple-touch-icon.png",revision:"6f682a595255e6aab2bf0f2daa78403a"},{url:"/favicon_io/favicon-16x16.png",revision:"2d00862eea3e0a26607d3d0ce24d1747"},{url:"/favicon_io/favicon-32x32.png",revision:"84f7a4563c6fb8cd905f2dbedcffede8"},{url:"/favicon_io/site.webmanifest",revision:"053100cb84a50d2ae7f5492f7dd7f25e"},{url:"/form.svg",revision:"a35402b6d479f34ad3b549785598a7f1"},{url:"/forwardArrow.svg",revision:"a2b678c76996903036d84d5c89aa2dfb"},{url:"/home.svg",revision:"50a825dab6f5e92f45b8addccf7985f1"},{url:"/icon-192x192.png",revision:"f2cb51e1461b8abf460df455d269dc13"},{url:"/icon-384x384.png",revision:"99d1987d20b874836d950b95586968ae"},{url:"/icon-512x512.png",revision:"c16feee422d814c946012979c0d02f00"},{url:"/inbox-sm.svg",revision:"2dc0b94129840c59c8b6161195c2eef7"},{url:"/injury.svg",revision:"625eabed27919428c5e8aab838cc69f2"},{url:"/jobsite.svg",revision:"c8edd9826da9b48ee2aa2704bd615a2b"},{url:"/key.svg",revision:"0f028cc9d6580dbbddfb480589ff2e25"},{url:"/language.svg",revision:"1efe74a3132b6106c6cdf88522eb90d9"},{url:"/list.svg",revision:"57868fe9d4dccd2eb31df472b3e2bd28"},{url:"/logo.svg",revision:"5013b0a843053e8d6d5a440fda05d2d6"},{url:"/magnifyingGlass.svg",revision:"a9c40b79190bd3d8a176acc01266e0b2"},{url:"/manifest.json",revision:"60c9a2466798a0f00e8bf274fa7e5f63"},{url:"/ongoing.svg",revision:"3efff004f1392862e938669f0bb65b90"},{url:"/person.svg",revision:"e8731cb0a913b8af5dc73b5e03eddc37"},{url:"/plus.svg",revision:"0b79f0a634d27010a0a06eb78c130ca1"},{url:"/profile-default.svg",revision:"94707b315bf413dd3b5311475eba7478"},{url:"/profile-sm.svg",revision:"51f312b77b5853c99ab56c5f0602c010"},{url:"/qr.svg",revision:"ce7279da70aaf0dc0a5c45d028517cb9"},{url:"/save-edit.svg",revision:"d75cb71852091f18a83a7c2e30471778"},{url:"/settings-sm.svg",revision:"21ef24cf84e23e6157a7a311b729802b"},{url:"/shiftScanLogo.svg",revision:"4e8ca932058d8f8b165df2892e241641"},{url:"/shiftscanlogoHorizontal.svg",revision:"424537f3cb1e54ebab9d2b8bcfe2f9c3"},{url:"/spinner.svg",revision:"1a71d33ba295f6737f31c4955932db2c"},{url:"/star.svg",revision:"5c311edc3093435e1ab27e50a5a7d73a"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"},{url:"/tasco.svg",revision:"06ca0e6de3cad1beffe2dfb6790545f2"},{url:"/team.svg",revision:"7e6842913d4e85c43fd6995760003c18"},{url:"/trash.svg",revision:"fc7d330b7bd6b58b59f1841865700c09"},{url:"/trucking.svg",revision:"6f7dba7191fe2fd70fca921f5e94c17a"},{url:"/turnBack.svg",revision:"576dc3082777e03f3cee11cd96aa96a1"},{url:"/undo-edit.svg",revision:"4dfbfce951fa87f16774e6f8eff9fbc9"},{url:"/x.svg",revision:"f5bb4dbea4bcd2b0f2c79320047c8cff"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
