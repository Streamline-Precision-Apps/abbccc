if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + ".js", i).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, r) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[n]) return;
    let t = {};
    const c = (e) => a(e, n),
      o = { module: { uri: n }, exports: t, require: c };
    s[n] = Promise.all(i.map((e) => o[e] || c(e))).then((e) => (r(...e), t));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/Calendar.svg", revision: "9de4bc2b869a1f7da5ff08e5560c7365" },
        { url: "/Inbox.svg", revision: "092c367c507b6d2bef5032e8f7fc61c0" },
        { url: "/Settings.svg", revision: "0229e611da8cd1cd10b16b5c1accfedc" },
        {
          url: "/_next/static/Qmr1Pg7S_9Zuoyz2R0O1U/_buildManifest.js",
          revision: "3e2d62a10f4d6bf0b92e14aecf7836f4",
        },
        {
          url: "/_next/static/Qmr1Pg7S_9Zuoyz2R0O1U/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/119-781aaa1d953c36a3.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/1308-c62ac32717ba1fe0.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/150-dc96aadba5079ea3.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/1559-914b20abc95a9373.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/1731-cbb9b3f35590b341.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/174.277d460de34ad70c.js",
          revision: "277d460de34ad70c",
        },
        {
          url: "/_next/static/chunks/1781-109c6c23849d92ef.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/3208-2e6ba87cb8627c68.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/3759-11e4572c8aee88e2.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/4042-bdae0eb63db3f8ad.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/4991-98489514990d30fd.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/51-c0184d329070c0c5.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/5126-6bb7c2360bb4ee66.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/5190-ae7334ec4f3ef9de.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/563-77f8e5b994a697a8.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/566-c34ba2d28867298d.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/7729-3bb0fe34f74119c2.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/7754-b654961b1d0acb83.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/7970-d5641fe238259e62.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/8023-f771c94911352043.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/8087-5f7fe2ba9128afa9.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/8255-5e7593b525b11e21.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/8268-a2bf119a478102f8.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/874-689005302a7f2d0d.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/9772-9289938ed4b27b39.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/aaea2bcf-08ef882773a45efa.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@search/default-d319d168b0242288.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@search/page-0ccd2b38c22d82ba.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/%5Bequipment%5D/page-e2b0021554a1b488.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/%5Bid%5D/page-37ec09c0d4acab67.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/cost-code/page-836f7cf68125c81f.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/%5Bid%5D/page-43d581e66b3d3046.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/jobsite/page-2fc91a30e880a8d4.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/new-cost-codes/page-ea52e0f189d18409.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/new-equipment/page-368680f5006be878.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/new-jobsite/page-5097fc815d393b31.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/new-tag/page-05c53f3945832f3d.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/page-14347127a8c1d9a9.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/tags/%5Bid%5D/page-14959a5d333e19e6.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/@view/tags/page-2b3a555a42254af4.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/default-6561a67bcb197255.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/layout-001bca9d1563e054.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/assets/page-75a44fccf7ca2f2a.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/@search/default-ba64b0c4ed475cd9.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/@search/page-a835af744c4a5aa8.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/@view/%5Bid%5D/page-4650ce949101f2ae.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/@view/new-request/page-8538250e000113ad.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/@view/page-26e277548dc5d247.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/default-3cd79f7ecc35ff13.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/layout-22e63528c2fa2a11.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/inbox/page-026ab8838b53a744.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/layout-92e925a3227f237b.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/page-2dd8891b471b6d52.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@search/default-3838547a8f90c894.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@search/page-5ab23ba17ec3faa0.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/%5Bemployee%5D/page-09987588671b868c.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/%5Bcrew%5D/page-f037dcf97390dfbf.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/new-crew/page-08b09624e678bc00.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/crew/page-10d01de3c1ad2347.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/new-employee/page-903a13f4bec9737e.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/page-5e9b123aa2e3af1a.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/@view/timesheets/%5Bemployee%5D/page-9a7f0b9351c40a25.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/default-30321489a34d34b0.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/layout-444ad2b1a1ec460d.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/page-13798c7a4c6265fa.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/reports/@search/page-39d567ba2234c69a.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/reports/@view/page-34c4792188dc3443.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/reports/layout-b8ec3ada75cf9da4.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/reports/page-0bfc82bbc38b9821.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/settings/page-85fc8688f58332b9.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/break/page-21656992633db316.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/clock/page-39e1d7443e8f9344.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/clock-out/(components)/log/page-7395fc9a903f2de5.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/clock-out/page-ed98f44d2c82a6da.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/equipment/%5Bid%5D/page-50185ca042e5a07a.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/equipment/page-b48bb1f310bab2e5.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/forms/(forms)/report-bug/page-ee01e99c5cad7509.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/forms/page-1361b7968f6d3bae.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/log-new/page-cbafb2e85df35d64.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/employee/%5BemployeeId%5D/page-5862981bb6861c91.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/page-4bf5878f9e71ad08.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/timecards/page-e8f60e20b7d73e04.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/page-f8d97c4df6e882c3.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/page-931edda701ab7529.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-equipment/page-b9fd945de60d52ae.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-jobsite/page-12c061eae2f57b79.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/qr-generator/page-c35bedc324907d17.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/switch-jobs/page-10dbe0843ce0d6e9.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/add-drive/page-fc4107e047f53f5f.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/form/page-3e07dcba8a937bfb.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/page-583164fe6f05988e.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/forgot-password/page-d741fb68fe0e266f.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/new-password/page-bde911ac048d67ca.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/page-9041d4b836dd3f2c.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/signup/page-f54c4276e6ab213b.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/(routes)/timesheets/page-bb853bc1f1268179.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-43c338ea02bbeed5.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/changePassword/page-83491071ab1194c6.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/inbox/form/page-dc974c413bf8fede.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/inbox/page-b3376cb2e8b7abeb.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/inbox/received/%5Bid%5D/page-8bf00e18a7e008c3.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/inbox/sent/%5Bid%5D/page-b7c85b7265da7cf8.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/inbox/sent/approved/page-1b2f0fe6d7d57c4b.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/inbox/sent/denied/page-2d02f3096916ba6b.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/profile/page-5b7ec222eeca9d70.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/hamburger/settings/page-f88619541ccbe57e.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/layout-6278bb916d1a0d25.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/not-found-71495891569cc23d.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/app/page-fe0b534458ca21e6.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/fd9d1056-48b03f54ad0bc7f0.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/framework-8e0e0f4a6b83a956.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/main-04823440d5d4d268.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/main-app-b4487aa3cd80ce3e.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",
          revision: "79330112775102f91e1010318bae2bd3",
        },
        {
          url: "/_next/static/chunks/webpack-417d1c55f07ee64f.js",
          revision: "Qmr1Pg7S_9Zuoyz2R0O1U",
        },
        {
          url: "/_next/static/css/86ff4d37a022af21.css",
          revision: "86ff4d37a022af21",
        },
        {
          url: "/_next/static/css/90540a3f3dc83e27.css",
          revision: "90540a3f3dc83e27",
        },
        {
          url: "/_next/static/css/bd3e86b47b870895.css",
          revision: "bd3e86b47b870895",
        },
        {
          url: "/_next/static/css/fe7f853c81d41c3e.css",
          revision: "fe7f853c81d41c3e",
        },
        {
          url: "/_next/static/media/1ff84563a719c397-s.woff2",
          revision: "e712ed5089ed58f92ea8fdc63424ecf5",
        },
        {
          url: "/_next/static/media/4c7655c11f7bd97b-s.p.woff2",
          revision: "38800f6020b9402854bbc3527199612c",
        },
        {
          url: "/_next/static/media/5df40a3eb8df1a4c-s.p.woff2",
          revision: "2f46a0d75dfff5f623a08402583e7ee9",
        },
        {
          url: "/_next/static/media/75cde960c2842862-s.woff2",
          revision: "8ba5d067487510340d843c0a3c0d9949",
        },
        {
          url: "/_next/static/media/92c2336771404627-s.woff2",
          revision: "e456d9e276ba68ad76f65962e88fab81",
        },
        { url: "/admin-sm.svg", revision: "4e4d775800c20779586a23e9a047f924" },
        { url: "/backArrow.svg", revision: "da74415b88ccd51c33a79f7009eb35e5" },
        {
          url: "/biometrics.svg",
          revision: "90f9c38f35305155d0d921156292b7db",
        },
        { url: "/break.svg", revision: "a9e520058faa1a47873f3ebba298c6c6" },
        { url: "/camera.svg", revision: "739de149ec873f07336818d576da3671" },
        { url: "/clock-in.svg", revision: "5cc76380767642af5976ce8741b7ee8f" },
        { url: "/clock-out.svg", revision: "b60f7aa110e5777db4188628fe63b802" },
        { url: "/clock.svg", revision: "0527e223336c6ad980b4bbf29f24a541" },
        { url: "/comment.svg", revision: "39d21138041caf591a59da0b88f5a961" },
        {
          url: "/current-equipment.svg",
          revision: "972eb4e8c271e0ab53e1a3e647a6f0f1",
        },
        { url: "/downArrow.svg", revision: "aaab7feb54f041c46e18042a3536b13c" },
        { url: "/drag.svg", revision: "4e1daf8f41d29612303381ff1bf2f422" },
        { url: "/edit-form.svg", revision: "161147557471d61b7dc3ec6aa913654a" },
        { url: "/end-day.svg", revision: "2225798f9c80e7005cad42cfc1dbf93a" },
        { url: "/equipment.svg", revision: "765560d85bac6e035e0e5b7922526817" },
        { url: "/eraser.svg", revision: "5f83641cc313e902e8915115cca46d3b" },
        {
          url: "/expandLeft.svg",
          revision: "dee268e91a5aeef03393cf16c186450c",
        },
        { url: "/eye-slash.svg", revision: "705b334d7e6debae9b4bcc4cf27e33b1" },
        { url: "/eye.svg", revision: "005402d6c94e1ffb59b9fcbe7f614059" },
        { url: "/form.svg", revision: "a35402b6d479f34ad3b549785598a7f1" },
        {
          url: "/forwardArrow.svg",
          revision: "a2b678c76996903036d84d5c89aa2dfb",
        },
        { url: "/home.svg", revision: "50a825dab6f5e92f45b8addccf7985f1" },
        {
          url: "/icon-192x192.png",
          revision: "f2cb51e1461b8abf460df455d269dc13",
        },
        {
          url: "/icon-384x384.png",
          revision: "99d1987d20b874836d950b95586968ae",
        },
        {
          url: "/icon-512x512.png",
          revision: "c16feee422d814c946012979c0d02f00",
        },
        { url: "/inbox-sm.svg", revision: "2dc0b94129840c59c8b6161195c2eef7" },
        { url: "/injury.svg", revision: "625eabed27919428c5e8aab838cc69f2" },
        { url: "/jobsite.svg", revision: "c8edd9826da9b48ee2aa2704bd615a2b" },
        { url: "/key.svg", revision: "0f028cc9d6580dbbddfb480589ff2e25" },
        { url: "/language.svg", revision: "1efe74a3132b6106c6cdf88522eb90d9" },
        { url: "/list.svg", revision: "57868fe9d4dccd2eb31df472b3e2bd28" },
        { url: "/logo.svg", revision: "5013b0a843053e8d6d5a440fda05d2d6" },
        {
          url: "/magnifyingGlass.svg",
          revision: "a9c40b79190bd3d8a176acc01266e0b2",
        },
        { url: "/manifest.json", revision: "60c9a2466798a0f00e8bf274fa7e5f63" },
        { url: "/ongoing.svg", revision: "3efff004f1392862e938669f0bb65b90" },
        { url: "/person.svg", revision: "e8731cb0a913b8af5dc73b5e03eddc37" },
        { url: "/plus.svg", revision: "0b79f0a634d27010a0a06eb78c130ca1" },
        {
          url: "/profile-default.svg",
          revision: "94707b315bf413dd3b5311475eba7478",
        },
        {
          url: "/profile-sm.svg",
          revision: "51f312b77b5853c99ab56c5f0602c010",
        },
        { url: "/qr.svg", revision: "ce7279da70aaf0dc0a5c45d028517cb9" },
        { url: "/save-edit.svg", revision: "d75cb71852091f18a83a7c2e30471778" },
        {
          url: "/settings-sm.svg",
          revision: "21ef24cf84e23e6157a7a311b729802b",
        },
        {
          url: "/shiftScanLogo.svg",
          revision: "4e8ca932058d8f8b165df2892e241641",
        },
        {
          url: "/shiftscanlogoHorizontal.svg",
          revision: "424537f3cb1e54ebab9d2b8bcfe2f9c3",
        },
        { url: "/spinner.svg", revision: "1a71d33ba295f6737f31c4955932db2c" },
        { url: "/star.svg", revision: "5c311edc3093435e1ab27e50a5a7d73a" },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "5a47d90db13bb1309b25bdf7b363570e",
        },
        { url: "/tasco.svg", revision: "06ca0e6de3cad1beffe2dfb6790545f2" },
        { url: "/team.svg", revision: "7e6842913d4e85c43fd6995760003c18" },
        { url: "/trash.svg", revision: "fc7d330b7bd6b58b59f1841865700c09" },
        { url: "/trucking.svg", revision: "6f7dba7191fe2fd70fca921f5e94c17a" },
        { url: "/turnBack.svg", revision: "576dc3082777e03f3cee11cd96aa96a1" },
        { url: "/undo-edit.svg", revision: "4dfbfce951fa87f16774e6f8eff9fbc9" },
        { url: "/x.svg", revision: "f5bb4dbea4bcd2b0f2c79320047c8cff" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});
