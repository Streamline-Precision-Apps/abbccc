if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const c=e=>a(e,n),u={module:{uri:n},exports:t,require:c};s[n]=Promise.all(i.map((e=>u[e]||c(e)))).then((e=>(r(...e),t)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Calendar.svg",revision:"9de4bc2b869a1f7da5ff08e5560c7365"},{url:"/Inbox.svg",revision:"092c367c507b6d2bef5032e8f7fc61c0"},{url:"/Settings.svg",revision:"0229e611da8cd1cd10b16b5c1accfedc"},{url:"/_next/static/SI3hrvLFJgj08JMEuGAKC/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/SI3hrvLFJgj08JMEuGAKC/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/119-781aaa1d953c36a3.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/1308-c62ac32717ba1fe0.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/150-dc96aadba5079ea3.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/1559-914b20abc95a9373.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/174.277d460de34ad70c.js",revision:"277d460de34ad70c"},{url:"/_next/static/chunks/1781-109c6c23849d92ef.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/3208-2e6ba87cb8627c68.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/3406-a5b0e9f27618177a.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/3759-11e4572c8aee88e2.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/4042-bdae0eb63db3f8ad.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/4296-bb3d69c9ab761fac.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/4991-98489514990d30fd.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/51-c0184d329070c0c5.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/5126-6bb7c2360bb4ee66.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/5190-ae7334ec4f3ef9de.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/563-77f8e5b994a697a8.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/566-c34ba2d28867298d.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/7729-3bb0fe34f74119c2.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/7754-b654961b1d0acb83.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/7970-203c339ba7462337.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/8023-f771c94911352043.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/8087-5f7fe2ba9128afa9.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/8255-44aabf19e23ae81d.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/8268-a2bf119a478102f8.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/9772-9289938ed4b27b39.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/aaea2bcf-08ef882773a45efa.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@search/default-fc2f1b06239bdbb2.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@search/page-c8e0771f3b1fd766.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/%5Bequipment%5D/page-1429c9f6e04b3e1e.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/%5Bid%5D/page-b995df39274c71b4.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/page-4b5e03ffff3e55bd.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/%5Bid%5D/page-61e997b4b5a333f7.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/page-8cb3e1bd0906f097.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-cost-codes/page-343bff1612081f6d.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-equipment/page-3375707ed74667b1.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-jobsite/page-d7617131b10a4569.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/new-tag/page-3f0ade40c54c00d0.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/page-14347127a8c1d9a9.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/tags/%5Bid%5D/page-85840db309a75aa7.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/@view/tags/page-351c1ee9cd9191f8.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/default-6561a67bcb197255.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/layout-4ab33927dd64900a.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/assets/page-75a44fccf7ca2f2a.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@search/default-94302683d8c296d5.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@search/page-02893bb49dd36284.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/%5Bid%5D/page-273365bdff30bcf7.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/new-request/page-796bd57f58015cdf.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/@view/page-26e277548dc5d247.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/default-3cd79f7ecc35ff13.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/layout-acd138b9a5a1e4cc.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/inbox/page-1ab9241a499a919b.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/layout-6c31b2df9c2c126c.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/page-78e85936651bbb09.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@search/default-0b2b027894fdbcd5.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@search/page-be9f34a8012cd853.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/%5Bemployee%5D/page-30ecfead41be6fd5.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/%5Bcrew%5D/page-9348b228f6f25bc8.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/new-crew/page-56cce3766674c3a5.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/page-f627104da69b1400.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/new-employee/page-404c500c16759162.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/page-5e9b123aa2e3af1a.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/@view/timesheets/%5Bemployee%5D/page-b98adcda96502f71.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/default-30321489a34d34b0.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/layout-a9ce2d91814733bf.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/personnel/page-13798c7a4c6265fa.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/reports/@search/page-aec11c31c0d63aff.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/reports/@view/page-f39ad57d3ae8e3f6.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/reports/layout-b8267a4d60dfbe63.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/reports/page-496c8f7776f6f8f2.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/admins/settings/page-e6300b747cbf2aba.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/break/page-d4b7bd3f365e7fce.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/clock/page-4d350c3f8fcfa837.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/clock-out/(components)/log/page-2cdb7104b148abff.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/clock-out/page-102d5327da4277b6.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/equipment/%5Bid%5D/page-cf6fdd9466675894.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/equipment/page-b3d682ba580a0d35.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/forms/(forms)/report-bug/page-b73ece363cb929a8.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/forms/page-51f44cebb9de278b.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/log-new/page-9ec458c597dcdcbe.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/employee/%5BemployeeId%5D/page-37030cbc74572ff4.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/page-87941584a6a47680.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/timecards/page-8811669a5de14e71.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/myTeam/page-7c44307dbb252338.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/page-41924666841c27dd.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-equipment/page-ccc556fcadb45b8f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-jobsite/page-5fcfe96fce8b08cf.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/qr-generator/page-0d62a4ba5b2541d7.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/switch-jobs/page-54c2c8bea8a78331.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/add-drive/page-4ce157e01cd2c30b.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/form/page-1249e5e8a2cf796c.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/page-c71bd36ac905143f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/signin/forgot-password/page-17e0ae408f519182.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/signin/new-password/page-874c72e1d031404f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/signin/page-583ae2b2d2d4cecb.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/signin/signup/page-53122b75733ee497.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/(routes)/timesheets/page-f0c304d9a5e8f050.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/_not-found/page-43c338ea02bbeed5.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/changePassword/page-43b6ee19b2520e1f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/inbox/form/page-e25ba6f5ad35a99a.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/inbox/page-3d747cbe6cd89a7c.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/inbox/received/%5Bid%5D/page-df3a0f88e03c4a83.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/%5Bid%5D/page-d0dfd3516b5868ba.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/approved/page-a05f17978c12ef0f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/inbox/sent/denied/page-0b61df2b2a6b6ee0.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/profile/page-39d1fcce347e6b8f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/hamburger/settings/page-de6bd23382fc9093.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/layout-fd62589758a4ec44.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/not-found-71495891569cc23d.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/app/page-7b5f69c52d0c0e70.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/fd9d1056-48b03f54ad0bc7f0.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/main-04823440d5d4d268.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/main-app-fa1cd9ff15c73062.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-417d1c55f07ee64f.js",revision:"SI3hrvLFJgj08JMEuGAKC"},{url:"/_next/static/css/86ff4d37a022af21.css",revision:"86ff4d37a022af21"},{url:"/_next/static/css/90540a3f3dc83e27.css",revision:"90540a3f3dc83e27"},{url:"/_next/static/css/bd3e86b47b870895.css",revision:"bd3e86b47b870895"},{url:"/_next/static/css/fe7f853c81d41c3e.css",revision:"fe7f853c81d41c3e"},{url:"/_next/static/media/1ff84563a719c397-s.woff2",revision:"e712ed5089ed58f92ea8fdc63424ecf5"},{url:"/_next/static/media/4c7655c11f7bd97b-s.p.woff2",revision:"38800f6020b9402854bbc3527199612c"},{url:"/_next/static/media/5df40a3eb8df1a4c-s.p.woff2",revision:"2f46a0d75dfff5f623a08402583e7ee9"},{url:"/_next/static/media/75cde960c2842862-s.woff2",revision:"8ba5d067487510340d843c0a3c0d9949"},{url:"/_next/static/media/92c2336771404627-s.woff2",revision:"e456d9e276ba68ad76f65962e88fab81"},{url:"/admin-sm.svg",revision:"4e4d775800c20779586a23e9a047f924"},{url:"/backArrow.svg",revision:"da74415b88ccd51c33a79f7009eb35e5"},{url:"/biometrics.svg",revision:"90f9c38f35305155d0d921156292b7db"},{url:"/break.svg",revision:"a9e520058faa1a47873f3ebba298c6c6"},{url:"/camera.svg",revision:"739de149ec873f07336818d576da3671"},{url:"/clock-in.svg",revision:"5cc76380767642af5976ce8741b7ee8f"},{url:"/clock-out.svg",revision:"b60f7aa110e5777db4188628fe63b802"},{url:"/clock.svg",revision:"0527e223336c6ad980b4bbf29f24a541"},{url:"/comment.svg",revision:"39d21138041caf591a59da0b88f5a961"},{url:"/current-equipment.svg",revision:"972eb4e8c271e0ab53e1a3e647a6f0f1"},{url:"/downArrow.svg",revision:"aaab7feb54f041c46e18042a3536b13c"},{url:"/drag.svg",revision:"4e1daf8f41d29612303381ff1bf2f422"},{url:"/edit-form.svg",revision:"161147557471d61b7dc3ec6aa913654a"},{url:"/end-day.svg",revision:"2225798f9c80e7005cad42cfc1dbf93a"},{url:"/equipment.svg",revision:"765560d85bac6e035e0e5b7922526817"},{url:"/eraser.svg",revision:"5f83641cc313e902e8915115cca46d3b"},{url:"/expandLeft.svg",revision:"dee268e91a5aeef03393cf16c186450c"},{url:"/eye-slash.svg",revision:"705b334d7e6debae9b4bcc4cf27e33b1"},{url:"/eye.svg",revision:"005402d6c94e1ffb59b9fcbe7f614059"},{url:"/form.svg",revision:"a35402b6d479f34ad3b549785598a7f1"},{url:"/forwardArrow.svg",revision:"a2b678c76996903036d84d5c89aa2dfb"},{url:"/home.svg",revision:"50a825dab6f5e92f45b8addccf7985f1"},{url:"/icon-192x192.png",revision:"f2cb51e1461b8abf460df455d269dc13"},{url:"/icon-384x384.png",revision:"99d1987d20b874836d950b95586968ae"},{url:"/icon-512x512.png",revision:"c16feee422d814c946012979c0d02f00"},{url:"/inbox-sm.svg",revision:"2dc0b94129840c59c8b6161195c2eef7"},{url:"/injury.svg",revision:"625eabed27919428c5e8aab838cc69f2"},{url:"/jobsite.svg",revision:"c8edd9826da9b48ee2aa2704bd615a2b"},{url:"/key.svg",revision:"0f028cc9d6580dbbddfb480589ff2e25"},{url:"/language.svg",revision:"1efe74a3132b6106c6cdf88522eb90d9"},{url:"/list.svg",revision:"57868fe9d4dccd2eb31df472b3e2bd28"},{url:"/logo.svg",revision:"5013b0a843053e8d6d5a440fda05d2d6"},{url:"/magnifyingGlass.svg",revision:"a9c40b79190bd3d8a176acc01266e0b2"},{url:"/manifest.json",revision:"60c9a2466798a0f00e8bf274fa7e5f63"},{url:"/ongoing.svg",revision:"3efff004f1392862e938669f0bb65b90"},{url:"/person.svg",revision:"e8731cb0a913b8af5dc73b5e03eddc37"},{url:"/plus.svg",revision:"0b79f0a634d27010a0a06eb78c130ca1"},{url:"/profile-default.svg",revision:"94707b315bf413dd3b5311475eba7478"},{url:"/profile-sm.svg",revision:"51f312b77b5853c99ab56c5f0602c010"},{url:"/qr.svg",revision:"ce7279da70aaf0dc0a5c45d028517cb9"},{url:"/save-edit.svg",revision:"d75cb71852091f18a83a7c2e30471778"},{url:"/settings-sm.svg",revision:"21ef24cf84e23e6157a7a311b729802b"},{url:"/shiftScanLogo.svg",revision:"4e8ca932058d8f8b165df2892e241641"},{url:"/shiftscanlogoHorizontal.svg",revision:"424537f3cb1e54ebab9d2b8bcfe2f9c3"},{url:"/spinner.svg",revision:"1a71d33ba295f6737f31c4955932db2c"},{url:"/star.svg",revision:"5c311edc3093435e1ab27e50a5a7d73a"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"},{url:"/tasco.svg",revision:"06ca0e6de3cad1beffe2dfb6790545f2"},{url:"/team.svg",revision:"7e6842913d4e85c43fd6995760003c18"},{url:"/trash.svg",revision:"fc7d330b7bd6b58b59f1841865700c09"},{url:"/trucking.svg",revision:"6f7dba7191fe2fd70fca921f5e94c17a"},{url:"/turnBack.svg",revision:"576dc3082777e03f3cee11cd96aa96a1"},{url:"/undo-edit.svg",revision:"4dfbfce951fa87f16774e6f8eff9fbc9"},{url:"/x.svg",revision:"f5bb4dbea4bcd2b0f2c79320047c8cff"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
