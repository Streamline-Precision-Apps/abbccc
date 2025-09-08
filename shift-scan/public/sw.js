if (!self.define) {
  let e,
    a = {};
  const i = (i, s) => (
    (i = new URL(i + ".js", s).href),
    a[i] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = i), (e.onload = a), document.head.appendChild(e));
        } else ((e = i), importScripts(i), a());
      }).then(() => {
        let e = a[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, c) => {
    const r =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[r]) return;
    let n = {};
    const t = (e) => i(e, r),
      d = { module: { uri: r }, exports: n, require: t };
    a[r] = Promise.all(s.map((e) => d[e] || t(e))).then((e) => (c(...e), n));
  };
}
define(["./workbox-31da5539"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/Settings.svg", revision: "3f4048b1a6a7bfaa86c6e3388212b90c" },
        {
          url: "/_next/static/_YehFjJAi_zHdIsIdNOSW/_buildManifest.js",
          revision: "8ca6dd23364c1493e0b1297eb9247590",
        },
        {
          url: "/_next/static/_YehFjJAi_zHdIsIdNOSW/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1095-dd05211d0065ad45.js",
          revision: "dd05211d0065ad45",
        },
        {
          url: "/_next/static/chunks/1250-f545f04f1cb21a5d.js",
          revision: "f545f04f1cb21a5d",
        },
        {
          url: "/_next/static/chunks/1270-afa4c1a4ac573f0f.js",
          revision: "afa4c1a4ac573f0f",
        },
        {
          url: "/_next/static/chunks/1317-9f0d1d5b5b09b687.js",
          revision: "9f0d1d5b5b09b687",
        },
        {
          url: "/_next/static/chunks/1401-51aeeb09a6bff4ba.js",
          revision: "51aeeb09a6bff4ba",
        },
        {
          url: "/_next/static/chunks/2019-244f4105c4691c0c.js",
          revision: "244f4105c4691c0c",
        },
        {
          url: "/_next/static/chunks/2057-668deaa0eb77c6a4.js",
          revision: "668deaa0eb77c6a4",
        },
        {
          url: "/_next/static/chunks/2170a4aa-8c96009f60e20411.js",
          revision: "8c96009f60e20411",
        },
        {
          url: "/_next/static/chunks/2403.ca107014ddba66de.js",
          revision: "ca107014ddba66de",
        },
        {
          url: "/_next/static/chunks/2418-d24046d04b612eb7.js",
          revision: "d24046d04b612eb7",
        },
        {
          url: "/_next/static/chunks/2474-50479fe3861b01d9.js",
          revision: "50479fe3861b01d9",
        },
        {
          url: "/_next/static/chunks/2573-6cc45532904a664d.js",
          revision: "6cc45532904a664d",
        },
        {
          url: "/_next/static/chunks/2799-b4af39955ae250d6.js",
          revision: "b4af39955ae250d6",
        },
        {
          url: "/_next/static/chunks/2927-d284db3025e2bf77.js",
          revision: "d284db3025e2bf77",
        },
        {
          url: "/_next/static/chunks/3008-31aa8928ac008967.js",
          revision: "31aa8928ac008967",
        },
        {
          url: "/_next/static/chunks/3068-851add7d493a12dc.js",
          revision: "851add7d493a12dc",
        },
        {
          url: "/_next/static/chunks/3328-1e73249e263f1cb2.js",
          revision: "1e73249e263f1cb2",
        },
        {
          url: "/_next/static/chunks/3576-82d6282f657dc73c.js",
          revision: "82d6282f657dc73c",
        },
        {
          url: "/_next/static/chunks/3680-ae64b3fe79923503.js",
          revision: "ae64b3fe79923503",
        },
        {
          url: "/_next/static/chunks/3691-e840d21ad9c9318e.js",
          revision: "e840d21ad9c9318e",
        },
        {
          url: "/_next/static/chunks/3874-1eb241209c0983f6.js",
          revision: "1eb241209c0983f6",
        },
        {
          url: "/_next/static/chunks/4224-3a4f64c7f91d1fe3.js",
          revision: "3a4f64c7f91d1fe3",
        },
        {
          url: "/_next/static/chunks/460-f61ef1620abf1860.js",
          revision: "f61ef1620abf1860",
        },
        {
          url: "/_next/static/chunks/472.be94164b1343721c.js",
          revision: "be94164b1343721c",
        },
        {
          url: "/_next/static/chunks/4892-87379697284bad30.js",
          revision: "87379697284bad30",
        },
        {
          url: "/_next/static/chunks/4bd1b696-88e37c56edce0f59.js",
          revision: "88e37c56edce0f59",
        },
        {
          url: "/_next/static/chunks/5056-932e6f256747b426.js",
          revision: "932e6f256747b426",
        },
        {
          url: "/_next/static/chunks/5092-a5d86e9c277d95dc.js",
          revision: "a5d86e9c277d95dc",
        },
        {
          url: "/_next/static/chunks/52774a7f-9f526229934f791c.js",
          revision: "9f526229934f791c",
        },
        {
          url: "/_next/static/chunks/5493-002a49a6d796cca8.js",
          revision: "002a49a6d796cca8",
        },
        {
          url: "/_next/static/chunks/5535-ed37b1f77860aa26.js",
          revision: "ed37b1f77860aa26",
        },
        {
          url: "/_next/static/chunks/5705-b5aab87209c9b3a1.js",
          revision: "b5aab87209c9b3a1",
        },
        {
          url: "/_next/static/chunks/5707-d2ac7122a5faa8c3.js",
          revision: "d2ac7122a5faa8c3",
        },
        {
          url: "/_next/static/chunks/5751-277f95667565cf9f.js",
          revision: "277f95667565cf9f",
        },
        {
          url: "/_next/static/chunks/6168-31567a6cfce4a76c.js",
          revision: "31567a6cfce4a76c",
        },
        {
          url: "/_next/static/chunks/6215-490f10909735bf0f.js",
          revision: "490f10909735bf0f",
        },
        {
          url: "/_next/static/chunks/6544-4e850949104b7517.js",
          revision: "4e850949104b7517",
        },
        {
          url: "/_next/static/chunks/6614-a4a54883d1151e44.js",
          revision: "a4a54883d1151e44",
        },
        {
          url: "/_next/static/chunks/6671-0a246ed30be29b7d.js",
          revision: "0a246ed30be29b7d",
        },
        {
          url: "/_next/static/chunks/6862-81cfc3fff123ab8a.js",
          revision: "81cfc3fff123ab8a",
        },
        {
          url: "/_next/static/chunks/6874-bf3fa41ffddf2fd7.js",
          revision: "bf3fa41ffddf2fd7",
        },
        {
          url: "/_next/static/chunks/6983-3b825f621741bfa3.js",
          revision: "3b825f621741bfa3",
        },
        {
          url: "/_next/static/chunks/7031-487212d5730877d0.js",
          revision: "487212d5730877d0",
        },
        {
          url: "/_next/static/chunks/7475-0db652d040555578.js",
          revision: "0db652d040555578",
        },
        {
          url: "/_next/static/chunks/7655-ba134a5f6f33f363.js",
          revision: "ba134a5f6f33f363",
        },
        {
          url: "/_next/static/chunks/7726-cf526c586725d0a2.js",
          revision: "cf526c586725d0a2",
        },
        {
          url: "/_next/static/chunks/8032-1d3600db6dfbd66c.js",
          revision: "1d3600db6dfbd66c",
        },
        {
          url: "/_next/static/chunks/822-80583122bbb5dec9.js",
          revision: "80583122bbb5dec9",
        },
        {
          url: "/_next/static/chunks/8240-8f75342690f7927d.js",
          revision: "8f75342690f7927d",
        },
        {
          url: "/_next/static/chunks/8289-332b4c1b8216acbb.js",
          revision: "332b4c1b8216acbb",
        },
        {
          url: "/_next/static/chunks/8337-4601d6cac0a20d0c.js",
          revision: "4601d6cac0a20d0c",
        },
        {
          url: "/_next/static/chunks/8412-5fe11e5250272ace.js",
          revision: "5fe11e5250272ace",
        },
        {
          url: "/_next/static/chunks/8436.fe8b1513f8e56bfa.js",
          revision: "fe8b1513f8e56bfa",
        },
        {
          url: "/_next/static/chunks/8535-b2044db9d879c7b0.js",
          revision: "b2044db9d879c7b0",
        },
        {
          url: "/_next/static/chunks/8743.8a27c90d6de6b553.js",
          revision: "8a27c90d6de6b553",
        },
        {
          url: "/_next/static/chunks/9337-ed07232187c0fdae.js",
          revision: "ed07232187c0fdae",
        },
        {
          url: "/_next/static/chunks/9341.89fe4eba5ac18b94.js",
          revision: "89fe4eba5ac18b94",
        },
        {
          url: "/_next/static/chunks/9373-12ddcc70f6722621.js",
          revision: "12ddcc70f6722621",
        },
        {
          url: "/_next/static/chunks/9695-25ecb996cf054976.js",
          revision: "25ecb996cf054976",
        },
        {
          url: "/_next/static/chunks/9737-77409fdeaa6c66a1.js",
          revision: "77409fdeaa6c66a1",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/cost-codes/page-d19ee063735e622e.js",
          revision: "d19ee063735e622e",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/crew/page-a6fa6a6b68f89e96.js",
          revision: "a6fa6a6b68f89e96",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/equipment/page-77f0b743ff409f10.js",
          revision: "77f0b743ff409f10",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/forms/%5Bid%5D/page-42a5f1a7ff2a6912.js",
          revision: "42a5f1a7ff2a6912",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/forms/create/page-f340928f14c2a6bf.js",
          revision: "f340928f14c2a6bf",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/forms/edit/%5Bid%5D/page-8e231876a3ff2323.js",
          revision: "8e231876a3ff2323",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/forms/page-0d2c328cebc1b5b7.js",
          revision: "0d2c328cebc1b5b7",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/jobsites/page-6b1030af234c96f1.js",
          revision: "6b1030af234c96f1",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/layout-52d776d467aa7de8.js",
          revision: "52d776d467aa7de8",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/page-df2731159fbae4d2.js",
          revision: "df2731159fbae4d2",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/personnel/page-5dcee52b7fd766b3.js",
          revision: "5dcee52b7fd766b3",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/reports/page-51c30ef608b16dbb.js",
          revision: "51c30ef608b16dbb",
        },
        {
          url: "/_next/static/chunks/app/(routes)/admins/timesheets/page-5ebcfbd5a9c01027.js",
          revision: "5ebcfbd5a9c01027",
        },
        {
          url: "/_next/static/chunks/app/(routes)/break/page-35c38efc61d70bab.js",
          revision: "35c38efc61d70bab",
        },
        {
          url: "/_next/static/chunks/app/(routes)/clock/page-a35d208161b22e2f.js",
          revision: "a35d208161b22e2f",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/clock-out/(components)/log/page-ef578d11d9382416.js",
          revision: "ef578d11d9382416",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/clock-out/page-59854a75b090cc38.js",
          revision: "59854a75b090cc38",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/equipment/%5Bid%5D/page-a35341e5189a1819.js",
          revision: "a35341e5189a1819",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/equipment/log-new/page-c0edfe7dc587404e.js",
          revision: "c0edfe7dc587404e",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/equipment/page-8230ab27417fae24.js",
          revision: "8230ab27417fae24",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/mechanic/edit-repair-details/%5Bid%5D/page-27d95e345541e5cf.js",
          revision: "27d95e345541e5cf",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/mechanic/new-repair/page-93ecc5d881213dca.js",
          revision: "93ecc5d881213dca",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/mechanic/page-a26f40a7fe9d25e4.js",
          revision: "a26f40a7fe9d25e4",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/mechanic/projects/%5Bid%5D/page-1ab3efb8928bb256.js",
          revision: "1ab3efb8928bb256",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/employee/%5BemployeeId%5D/page-70e9ddef336b2848.js",
          revision: "70e9ddef336b2848",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/%5Bid%5D/page-313afee4b92b1419.js",
          revision: "313afee4b92b1419",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/page-caf552412ecb80af.js",
          revision: "caf552412ecb80af",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/myTeam/timecards/page-6b458fb2f1c09b5e.js",
          revision: "6b458fb2f1c09b5e",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/page-825d6a0a8df21267.js",
          revision: "825d6a0a8df21267",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-equipment/page-2e13389669500842.js",
          revision: "2e13389669500842",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/qr-generator/add-jobsite/page-86534078e21b2914.js",
          revision: "86534078e21b2914",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/qr-generator/page-14c2ad430cdcdcb6.js",
          revision: "14c2ad430cdcdcb6",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/switch-jobs/page-f855d350a25f7753.js",
          revision: "f855d350a25f7753",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/tasco/page-c0d88504f7120807.js",
          revision: "c0d88504f7120807",
        },
        {
          url: "/_next/static/chunks/app/(routes)/dashboard/truckingAssistant/page-0abb7b0de306079f.js",
          revision: "0abb7b0de306079f",
        },
        {
          url: "/_next/static/chunks/app/(routes)/forms/create/%5BformId%5D/page-358f1b21a521e026.js",
          revision: "358f1b21a521e026",
        },
        {
          url: "/_next/static/chunks/app/(routes)/forms/edit/%5Bid%5D/page-db716dc45107d52d.js",
          revision: "db716dc45107d52d",
        },
        {
          url: "/_next/static/chunks/app/(routes)/forms/page-15edfac430211f9e.js",
          revision: "15edfac430211f9e",
        },
        {
          url: "/_next/static/chunks/app/(routes)/hamburger/changePassword/page-c62b1f844af12626.js",
          revision: "c62b1f844af12626",
        },
        {
          url: "/_next/static/chunks/app/(routes)/hamburger/inbox/formSubmission/%5Bid%5D/page-115476e909f04ef5.js",
          revision: "115476e909f04ef5",
        },
        {
          url: "/_next/static/chunks/app/(routes)/hamburger/inbox/page-e263f323f7cca080.js",
          revision: "e263f323f7cca080",
        },
        {
          url: "/_next/static/chunks/app/(routes)/hamburger/profile/page-71137a11d2954be2.js",
          revision: "71137a11d2954be2",
        },
        {
          url: "/_next/static/chunks/app/(routes)/information/page-7da6f69893d6b11f.js",
          revision: "7da6f69893d6b11f",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/forgot-password/page-3e2117700743e910.js",
          revision: "3e2117700743e910",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/new-password/page-aca8684ed11f50cd.js",
          revision: "aca8684ed11f50cd",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/page-4a092194ec70574c.js",
          revision: "4a092194ec70574c",
        },
        {
          url: "/_next/static/chunks/app/(routes)/signin/signup/page-943bfb7bbfe8354d.js",
          revision: "943bfb7bbfe8354d",
        },
        {
          url: "/_next/static/chunks/app/(routes)/timesheets/page-f3eb5c800b979d24.js",
          revision: "f3eb5c800b979d24",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-515217b63a294767.js",
          revision: "515217b63a294767",
        },
        {
          url: "/_next/static/chunks/app/api/(MyTeam)/getCrew/route-5881d007cc7f7319.js",
          revision: "5881d007cc7f7319",
        },
        {
          url: "/_next/static/chunks/app/api/(MyTeam)/getCrewById/%5BcrewId%5D/route-2216e488590ff8c1.js",
          revision: "2216e488590ff8c1",
        },
        {
          url: "/_next/static/chunks/app/api/(MyTeam)/getPendingTeamTimeSheets/route-42d58a3c99fd4885.js",
          revision: "42d58a3c99fd4885",
        },
        {
          url: "/_next/static/chunks/app/api/(MyTeam)/getTeam/route-3b8c459c5078b177.js",
          revision: "3b8c459c5078b177",
        },
        {
          url: "/_next/static/chunks/app/api/(MyTeam)/getUserInfo/%5Bid%5D/route-282c628c8d9736d9.js",
          revision: "282c628c8d9736d9",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/crewManager/route-57157823a8de731e.js",
          revision: "57157823a8de731e",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/employeeInfo/%5Bemployee%5D/route-38294ce8455d9b16.js",
          revision: "38294ce8455d9b16",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllActiveEmployeeName/route-b713efc89204e786.js",
          revision: "b713efc89204e786",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllCostCodesByJobSites/route-9ef9c7415313b76a.js",
          revision: "9ef9c7415313b76a",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllCrews/route-453e1a2343b7eab8.js",
          revision: "453e1a2343b7eab8",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllEmployees/route-bd2eabb263b19bc6.js",
          revision: "bd2eabb263b19bc6",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllEquipment/route-1b5b17bfcd0aab09.js",
          revision: "1b5b17bfcd0aab09",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllForms/route-b045aad7423ce099.js",
          revision: "b045aad7423ce099",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllTimesheetInfo/route-f3e1ba998414b092.js",
          revision: "f3e1ba998414b092",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getAllTimesheetsPending/route-2c40670539e5d134.js",
          revision: "2c40670539e5d134",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getCostCodeDetails/route-e013d1b4d2c81346.js",
          revision: "e013d1b4d2c81346",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getCostCodeSummary/route-663e1cef9e9a36b2.js",
          revision: "663e1cef9e9a36b2",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getCostCodeTags/%5Bid%5D/route-a3f37fc38f79ca08.js",
          revision: "a3f37fc38f79ca08",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getCrewByIdAdmin/%5Bid%5D/route-d5a2b487fea0afe9.js",
          revision: "d5a2b487fea0afe9",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getDashboard/route-5b11ccbae547ecb6.js",
          revision: "5b11ccbae547ecb6",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getEquipmentByEquipmentId/%5Bequipment%5D/route-a6d9f7f54b0e4d16.js",
          revision: "a6d9f7f54b0e4d16",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getEquipmentDetails/route-0eb8f29d99c1e656.js",
          revision: "0eb8f29d99c1e656",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getEquipmentSummary/route-25d392a5c1d94508.js",
          revision: "25d392a5c1d94508",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getFormSubmissionsById/%5Bid%5D/route-0df5a9a93c869c2c.js",
          revision: "0df5a9a93c869c2c",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getForms/%5Bid%5D/route-efd0108b09ccc318.js",
          revision: "efd0108b09ccc318",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getJobsiteById/%5Bid%5D/route-fe6d375242aaa66c.js",
          revision: "fe6d375242aaa66c",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getJobsiteSummary/route-bd0dc87525c8c226.js",
          revision: "bd0dc87525c8c226",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getMechanicProjectSummary/route-f3ea18a740b25b95.js",
          revision: "f3ea18a740b25b95",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getTagById/%5Bid%5D/route-a56180329349d821.js",
          revision: "a56180329349d821",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getTagSummary/route-277acb29ae2cb5c0.js",
          revision: "277acb29ae2cb5c0",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/getTimesheetById/route-36c25e4c150a853f.js",
          revision: "36c25e4c150a853f",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/jobsiteManager/route-ffefbfefb4ea89ca.js",
          revision: "ffefbfefb4ea89ca",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/personnelManager/route-1c3b2102c9989ad5.js",
          revision: "1c3b2102c9989ad5",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/reports/tasco/route-aa867471cf3a825b.js",
          revision: "aa867471cf3a825b",
        },
        {
          url: "/_next/static/chunks/app/api/(admins)/reports/truckingReport/route-d09577a54c291d5a.js",
          revision: "d09577a54c291d5a",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getEquipmentList/route-37a033aaad7c3bbd.js",
          revision: "37a033aaad7c3bbd",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getLogs/route-467802be83ad4f9a.js",
          revision: "467802be83ad4f9a",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getMyTeamsUsers/route-222d0b67e7c7035d.js",
          revision: "222d0b67e7c7035d",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getPendingTeamTimesheets/%5BcrewMembers%5D/route-345bacc1ed432bad.js",
          revision: "345bacc1ed432bad",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getRecentCostCodes/route-e373898a0b8eab99.js",
          revision: "e373898a0b8eab99",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getTodaysTimesheets/route-8ee9b586a4073878.js",
          revision: "8ee9b586a4073878",
        },
        {
          url: "/_next/static/chunks/app/api/(clock)/getTruckData/route-0a7d1a06b336ebfc.js",
          revision: "0a7d1a06b336ebfc",
        },
        {
          url: "/_next/static/chunks/app/api/(equipment)/getAllEquipmentIdAndQrId/route-a391ee7c3b915a1e.js",
          revision: "a391ee7c3b915a1e",
        },
        {
          url: "/_next/static/chunks/app/api/(equipment)/getCheckedList/route-83437e26cff9d07c.js",
          revision: "83437e26cff9d07c",
        },
        {
          url: "/_next/static/chunks/app/api/(equipment)/getEqUserLogs/%5Bid%5D/route-addbf9838b295e05.js",
          revision: "addbf9838b295e05",
        },
        {
          url: "/_next/static/chunks/app/api/(equipment)/getEqUserLogs/route-de1253e6095c02c6.js",
          revision: "de1253e6095c02c6",
        },
        {
          url: "/_next/static/chunks/app/api/(equipment)/getEquipmentRefueledLogs/%5Bid%5D/route-1992dc285c7d3f9f.js",
          revision: "1992dc285c7d3f9f",
        },
        {
          url: "/_next/static/chunks/app/api/(equipment)/getRecentJobDetails/route-c4660b8c9db066fd.js",
          revision: "c4660b8c9db066fd",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/employeeRequests/%5Bfilter%5D/route-b50d76f3d7e0b84b.js",
          revision: "b50d76f3d7e0b84b",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/form/%5Bid%5D/route-ed67ae71e768dece.js",
          revision: "ed67ae71e768dece",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/formDraft/%5Bid%5D/route-1e4b84d9cb4d2dd8.js",
          revision: "1e4b84d9cb4d2dd8",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/formDrafts/route-8f691f40a557e59f.js",
          revision: "8f691f40a557e59f",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/formSubmission/%5Bid%5D/route-1b38fde942c44156.js",
          revision: "1b38fde942c44156",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/formSubmissions/%5Bstatus%5D/route-267530dfb6863968.js",
          revision: "267530dfb6863968",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/forms/route-a3eb59ad686ed166.js",
          revision: "a3eb59ad686ed166",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/getDocumentById/%5Bid%5D/route-a4390b50ca1c0bb1.js",
          revision: "a4390b50ca1c0bb1",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/getDocumentTags/route-f20c536e5de1c772.js",
          revision: "f20c536e5de1c772",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/getDocuments/route-d2ca33f442c6985e.js",
          revision: "d2ca33f442c6985e",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/getEmployees/route-b7c6c1ad5c596a9f.js",
          revision: "b7c6c1ad5c596a9f",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/getEqForDocs/route-f18a23c6576203b8.js",
          revision: "f18a23c6576203b8",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/managerFormApproval/%5Bid%5D/route-d3cc31c4ed3b411e.js",
          revision: "d3cc31c4ed3b411e",
        },
        {
          url: "/_next/static/chunks/app/api/(forms)/teamSubmission/%5Bid%5D/route-7c66f1c71b570a02.js",
          revision: "7c66f1c71b570a02",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/cookies/route-449a68d7fdfbf596.js",
          revision: "449a68d7fdfbf596",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getAllJobsites/route-303fc38020332080.js",
          revision: "303fc38020332080",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getAllTags/route-ebf500c2cfe64b61.js",
          revision: "ebf500c2cfe64b61",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getBannerData/route-3f422e369d30e34f.js",
          revision: "3f422e369d30e34f",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getCostCodes/route-1c7af094cfc7d4b6.js",
          revision: "1c7af094cfc7d4b6",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getCrewByCrewId/%5Bcrew%5D/route-b77f55d7fd89015d.js",
          revision: "b77f55d7fd89015d",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getEquipment/route-7a662967661f8993.js",
          revision: "7a662967661f8993",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getPayPeriodTimeSheets/route-afbe3d8f646bc828.js",
          revision: "afbe3d8f646bc828",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getRecentEquipment/route-a6f3613745693679.js",
          revision: "a6f3613745693679",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getRecentJobsites/route-58cea8a1ababe6f6.js",
          revision: "58cea8a1ababe6f6",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getRecentTimecard/route-ab708dcec25008d0.js",
          revision: "ab708dcec25008d0",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getRecentTimecardReturn/route-68e948def9e5ed61.js",
          revision: "68e948def9e5ed61",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getSettings/route-3dceec66b5196f11.js",
          revision: "3dceec66b5196f11",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getTimesheets/%5Bemployee%5D/route-b4f6f57a889ff2df.js",
          revision: "b4f6f57a889ff2df",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getTimesheets/route-5be8039e7a07d8a2.js",
          revision: "5be8039e7a07d8a2",
        },
        {
          url: "/_next/static/chunks/app/api/(general)/getUserSignature/route-ac595ebcadb60b3a.js",
          revision: "ac595ebcadb60b3a",
        },
        {
          url: "/_next/static/chunks/app/api/(mechanic)/getMaintenanceLogs/%5Bid%5D/route-893dddb396643b3a.js",
          revision: "893dddb396643b3a",
        },
        {
          url: "/_next/static/chunks/app/api/(mechanic)/getMaintenanceProjects/route-bfe52058a56a9217.js",
          revision: "bfe52058a56a9217",
        },
        {
          url: "/_next/static/chunks/app/api/(mechanic)/getReceivedInfo/%5Bid%5D/route-31760065e27c84af.js",
          revision: "31760065e27c84af",
        },
        {
          url: "/_next/static/chunks/app/api/(mechanic)/getRepairDetails/%5Bid%5D/route-54ef3772dc6bdfd7.js",
          revision: "54ef3772dc6bdfd7",
        },
        {
          url: "/_next/static/chunks/app/api/(qrGenerator)/getEquipmentbyQrId/%5BqrId%5D/route-1701f729c6a5b051.js",
          revision: "1701f729c6a5b051",
        },
        {
          url: "/_next/static/chunks/app/api/(qrGenerator)/getJobsites/route-250e700d0b259a0b.js",
          revision: "250e700d0b259a0b",
        },
        {
          url: "/_next/static/chunks/app/api/(reviewWithDevun)/getSignature/%5Bid%5D/route-328bb709250f3212.js",
          revision: "328bb709250f3212",
        },
        {
          url: "/_next/static/chunks/app/api/(reviewWithDevun)/getTimesheetById/%5Bemployee%5D/route-2498971e9e203c34.js",
          revision: "2498971e9e203c34",
        },
        {
          url: "/_next/static/chunks/app/api/(settings)/getEmployee/route-e59f841bd94e32e1.js",
          revision: "e59f841bd94e32e1",
        },
        {
          url: "/_next/static/chunks/app/api/(tasco)/getTascoLog/comment/%5BtimeSheetId%5D/route-a4f3baf3c2fca901.js",
          revision: "a4f3baf3c2fca901",
        },
        {
          url: "/_next/static/chunks/app/api/(tasco)/getTascoLog/loadCount/%5BtimeSheetId%5D/route-bdb881284bb6a285.js",
          revision: "bdb881284bb6a285",
        },
        {
          url: "/_next/static/chunks/app/api/(tasco)/getTascoLog/refueledLogs/%5BtimeSheetId%5D/route-9e0f4172ed79aadd.js",
          revision: "9e0f4172ed79aadd",
        },
        {
          url: "/_next/static/chunks/app/api/(tasco)/getTascoLog/tascoId/route-486c6ceb6ad6a151.js",
          revision: "486c6ceb6ad6a151",
        },
        {
          url: "/_next/static/chunks/app/api/(timeSheets)/getComment/route-beb3e1bff3b6606c.js",
          revision: "beb3e1bff3b6606c",
        },
        {
          url: "/_next/static/chunks/app/api/(timeSheets)/getMaterialTypes/route-e9b5a2880315780f.js",
          revision: "e9b5a2880315780f",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/endingMileage/%5BtimeSheetId%5D/route-e4a9a74245e3f81d.js",
          revision: "e4a9a74245e3f81d",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/equipmentHauled/%5BtimeSheetId%5D/route-4a1de71e81ad0be0.js",
          revision: "4a1de71e81ad0be0",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/material/%5BtimeSheetId%5D/route-be74f1abaf12a588.js",
          revision: "be74f1abaf12a588",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/notes/%5BtimeSheetId%5D/route-564c8223586e7840.js",
          revision: "564c8223586e7840",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/refueledLogs/%5BtimeSheetId%5D/route-87678b1b40a11f3c.js",
          revision: "87678b1b40a11f3c",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/startingMileage/%5BtimeSheetId%5D/route-28e3a71d5b690da4.js",
          revision: "28e3a71d5b690da4",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/stateMileage/%5BtimeSheetId%5D/route-9555f6bf2ed99276.js",
          revision: "9555f6bf2ed99276",
        },
        {
          url: "/_next/static/chunks/app/api/(trucking)/getTruckingLogs/truckingId/route-9171f62c15ca8325.js",
          revision: "9171f62c15ca8325",
        },
        {
          url: "/_next/static/chunks/app/api/(user)/getUserImage/route-88a33fe2e723b2c2.js",
          revision: "88a33fe2e723b2c2",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-27b0ac8409839f8e.js",
          revision: "27b0ac8409839f8e",
        },
        {
          url: "/_next/static/chunks/app/api/check-timesheet-status/route-9e5cb4e4dfcae1c7.js",
          revision: "9e5cb4e4dfcae1c7",
        },
        {
          url: "/_next/static/chunks/app/api/clear-timesheet-cookies/route-b13a59d1d999f8e2.js",
          revision: "b13a59d1d999f8e2",
        },
        {
          url: "/_next/static/chunks/app/api/clockoutDetails/route-b855cd84c962a785.js",
          revision: "b855cd84c962a785",
        },
        {
          url: "/_next/static/chunks/app/api/equipment/%5BequipmentId%5D/lastMileage/route-3306a0379574abc4.js",
          revision: "3306a0379574abc4",
        },
        {
          url: "/_next/static/chunks/app/api/getTimesheetChangeLogs/route-32e1c3c457483823.js",
          revision: "32e1c3c457483823",
        },
        {
          url: "/_next/static/chunks/app/api/getTimesheetDetailsManager/%5Bid%5D/route-3036de4c2ee9cbae.js",
          revision: "3036de4c2ee9cbae",
        },
        {
          url: "/_next/static/chunks/app/api/getTimesheetsByDate/route-07726335f1f9280b.js",
          revision: "07726335f1f9280b",
        },
        {
          url: "/_next/static/chunks/app/api/getTimesheetsByDateNew/route-e452dbfc12f139f8.js",
          revision: "e452dbfc12f139f8",
        },
        {
          url: "/_next/static/chunks/app/api/getTruckingLogs/equipmentId/%5BtimeSheetId%5D/route-401bdafc97c069de.js",
          revision: "401bdafc97c069de",
        },
        {
          url: "/_next/static/chunks/app/api/notifications/route-f98294210e0f92ed.js",
          revision: "f98294210e0f92ed",
        },
        {
          url: "/_next/static/chunks/app/api/notifications/topic-subscribe/route-c9050362c06f8f8f.js",
          revision: "c9050362c06f8f8f",
        },
        {
          url: "/_next/static/chunks/app/api/notifications/trigger/route-7388d9cdc94cd8e2.js",
          revision: "7388d9cdc94cd8e2",
        },
        {
          url: "/_next/static/chunks/app/api/presence/ping/route-d34b5405fe970827.js",
          revision: "d34b5405fe970827",
        },
        {
          url: "/_next/static/chunks/app/api/push/public-key/route-a855e76ded6ec190.js",
          revision: "a855e76ded6ec190",
        },
        {
          url: "/_next/static/chunks/app/api/push/subscribe/route-699b707fca3f5866.js",
          revision: "699b707fca3f5866",
        },
        {
          url: "/_next/static/chunks/app/api/push/unsubscribe/route-8008a2550551845e.js",
          revision: "8008a2550551845e",
        },
        {
          url: "/_next/static/chunks/app/api/sentry-example-api/route-3ef1c3ba0efdb1bb.js",
          revision: "3ef1c3ba0efdb1bb",
        },
        {
          url: "/_next/static/chunks/app/api/set-timesheet-cookies/route-b8de974baed9d329.js",
          revision: "b8de974baed9d329",
        },
        {
          url: "/_next/static/chunks/app/api/truckingLogDetails/%5BtruckingLogId%5D/route-58a9fac395dd936d.js",
          revision: "58a9fac395dd936d",
        },
        {
          url: "/_next/static/chunks/app/api/user-permissions/route-c0dd71d5c1e60ecc.js",
          revision: "c0dd71d5c1e60ecc",
        },
        {
          url: "/_next/static/chunks/app/continue-timesheet/page-0fb9b52b85569d00.js",
          revision: "0fb9b52b85569d00",
        },
        {
          url: "/_next/static/chunks/app/error-e6a65780f977f38a.js",
          revision: "e6a65780f977f38a",
        },
        {
          url: "/_next/static/chunks/app/global-error-5c7851ce65deee51.js",
          revision: "5c7851ce65deee51",
        },
        {
          url: "/_next/static/chunks/app/icons/page-cfb84c7ecac70e45.js",
          revision: "cfb84c7ecac70e45",
        },
        {
          url: "/_next/static/chunks/app/layout-55a3905d5ee64434.js",
          revision: "55a3905d5ee64434",
        },
        {
          url: "/_next/static/chunks/app/not-authorized/page-fa154414c793c65e.js",
          revision: "fa154414c793c65e",
        },
        {
          url: "/_next/static/chunks/app/not-found-2795053a42b6fb6f.js",
          revision: "2795053a42b6fb6f",
        },
        {
          url: "/_next/static/chunks/app/page-426907bb045559aa.js",
          revision: "426907bb045559aa",
        },
        {
          url: "/_next/static/chunks/framework-5871c7b6f4022a8e.js",
          revision: "5871c7b6f4022a8e",
        },
        {
          url: "/_next/static/chunks/main-11f225b1f6179465.js",
          revision: "11f225b1f6179465",
        },
        {
          url: "/_next/static/chunks/main-app-2c7d61c9206b6ed4.js",
          revision: "2c7d61c9206b6ed4",
        },
        {
          url: "/_next/static/chunks/pages/_app-ab65087da9e96165.js",
          revision: "ab65087da9e96165",
        },
        {
          url: "/_next/static/chunks/pages/_error-3ba57a7e916ac9c7.js",
          revision: "3ba57a7e916ac9c7",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-8bc5e912738f63ab.js",
          revision: "8bc5e912738f63ab",
        },
        {
          url: "/_next/static/css/34cbb023ec77e3fe.css",
          revision: "34cbb023ec77e3fe",
        },
        {
          url: "/_next/static/css/63c7182515913e2f.css",
          revision: "63c7182515913e2f",
        },
        {
          url: "/_next/static/css/ae3f615d9a81d81a.css",
          revision: "ae3f615d9a81d81a",
        },
        {
          url: "/_next/static/css/b5fe2f5a95132839.css",
          revision: "b5fe2f5a95132839",
        },
        {
          url: "/_next/static/css/ccce47fdcedd91d2.css",
          revision: "ccce47fdcedd91d2",
        },
        {
          url: "/_next/static/media/30e6a981a0efeb9b-s.woff2",
          revision: "5cd14db2bb47ab5db74376b77c909759",
        },
        {
          url: "/_next/static/media/5df40a3eb8df1a4c-s.p.woff2",
          revision: "2f46a0d75dfff5f623a08402583e7ee9",
        },
        {
          url: "/_next/static/media/62d466ce3199db61-s.p.woff2",
          revision: "3a28d888908be7f560bf59faa1c796b2",
        },
        {
          url: "/_next/static/media/92c2336771404627-s.woff2",
          revision: "e456d9e276ba68ad76f65962e88fab81",
        },
        {
          url: "/_next/static/media/ajax-loader.0b80f665.gif",
          revision: "0b80f665",
        },
        {
          url: "/_next/static/media/d934919622a522a7-s.woff2",
          revision: "d3322001406183e84b58b99afd278b84",
        },
        { url: "/_next/static/media/slick.25572f22.eot", revision: "25572f22" },
        {
          url: "/_next/static/media/slick.653a4cbb.woff",
          revision: "653a4cbb",
        },
        { url: "/_next/static/media/slick.6aa1ee46.ttf", revision: "6aa1ee46" },
        { url: "/_next/static/media/slick.f895cfdf.svg", revision: "f895cfdf" },
        {
          url: "/admin-white.svg",
          revision: "acce9d9030915c4d989c8f2b842d26e5",
        },
        { url: "/admin.svg", revision: "9cdd04fb125d08289ed93dc7f34fa430" },
        {
          url: "/android/android-launchericon-144-144.png",
          revision: "554cb47f9b447d7c049e0af337f30598",
        },
        {
          url: "/android/android-launchericon-192-192.png",
          revision: "c7acce3a1ca251dc273817cd5462a666",
        },
        {
          url: "/android/android-launchericon-48-48.png",
          revision: "b3e487bbda706b0a7a31bd383fcb5bb9",
        },
        {
          url: "/android/android-launchericon-512-512.png",
          revision: "daaca9c8424139dcfdeed3181b0a7cbd",
        },
        {
          url: "/android/android-launchericon-72-72.png",
          revision: "0544816fbb562d0825feb6e9ff73edff",
        },
        {
          url: "/android/android-launchericon-96-96.png",
          revision: "29c67668a313466cbd66948974b9c656",
        },
        { url: "/arrowBack.svg", revision: "5fc657e2a665a117b53893a66685189a" },
        { url: "/arrowDown.svg", revision: "8d3122f3c7703e5c69ceb193bbc8d1d3" },
        {
          url: "/arrowDownThin.svg",
          revision: "6048e8dd70144f0bf662205316e8f606",
        },
        { url: "/arrowLeft.svg", revision: "21a8deac72e292364047facbfa9eca0d" },
        {
          url: "/arrowLeftSymbol.svg",
          revision: "e512915ab058853d37aa9ca1de1a2648",
        },
        {
          url: "/arrowLeftThin.svg",
          revision: "cdad43d059853e6be10d795267b0c1ec",
        },
        {
          url: "/arrowRight.svg",
          revision: "acbdbf302b997a6bf3c6812d97702034",
        },
        {
          url: "/arrowRightSymbol.svg",
          revision: "e0d35eafc504890f04c4f736cdcf2e0d",
        },
        {
          url: "/arrowRightThin.svg",
          revision: "ef5e977d9d5a4185a2ce321431209434",
        },
        { url: "/arrowUp.svg", revision: "f6ac0b01a69032af7ce76b17df15a7ff" },
        {
          url: "/arrowUpThin.svg",
          revision: "b47a6b77d307c26a4fa505bfa36d9d51",
        },
        {
          url: "/biometrics.svg",
          revision: "9a21f7caa38290ae6a57b5875389b019",
        },
        { url: "/broken.svg", revision: "0935155f4a8ed2072de5f7259aeb45ed" },
        { url: "/calendar.svg", revision: "31d3636500a0e5dc9dd2eb7067193b9a" },
        { url: "/camera.svg", revision: "868c5901f59d22f63732a355043c1538" },
        {
          url: "/cameraFilled.svg",
          revision: "60b375d44b6b18b0a3a8d36f8b9c2992",
        },
        { url: "/checkbox.svg", revision: "c1ea0e0035a3121fa5d68a8ea790511e" },
        { url: "/clock.svg", revision: "a0a26fc6ceadf12e4370f034c947c942" },
        {
          url: "/clockBreak.svg",
          revision: "c2086d9f2daf8443122d922ab1e6149c",
        },
        { url: "/clockIn.svg", revision: "ed40731c8ceb42da3c9af1b2b3f6b966" },
        { url: "/clockOut.svg", revision: "722bfede14c6867300f77b781b455657" },
        { url: "/comment.svg", revision: "be8fe3fec0dfe07d7533f4f68836183c" },
        { url: "/comments.svg", revision: "703bbc2ca54ffd2ff259e3fa2060d95b" },
        {
          url: "/condense-white.svg",
          revision: "ffe06cebd670c54e05965c3c7e3cb181",
        },
        { url: "/condense.svg", revision: "62d223cf7e993e71d8a6485f559c5be8" },
        { url: "/drag.svg", revision: "4870e656f927e3338ff6fd6e997fb085" },
        { url: "/dragDots.svg", revision: "9633d61721ac1a62965eb7087fc25783" },
        {
          url: "/dragFormBuilder.svg",
          revision: "ac3cdb26d6140358e390c93e3400c0d1",
        },
        { url: "/endDay.svg", revision: "5fac7fde189260dd5ff3777603ff4f5a" },
        {
          url: "/equipment-white.svg",
          revision: "d32a8b8f87d2234368b23d49a4b22614",
        },
        { url: "/equipment.svg", revision: "1e99d395a9fd43fe2441d0f636831f25" },
        { url: "/eraser.svg", revision: "b491a2981d80b8283358f6dd6b125eba" },
        {
          url: "/export-white.svg",
          revision: "bbca9d13d177938f75a89f82f14807fa",
        },
        { url: "/export.svg", revision: "10686c93e27a1a232d80a46c86ac1a6f" },
        { url: "/eye-blue.svg", revision: "f0e74956ec25d6a0a106bac57aa4ab53" },
        { url: "/eye.svg", revision: "f900457e0c29ae75726d2240a8ca22b1" },
        { url: "/eyeSlash.svg", revision: "673b38fd2e4a497941ed97b6e6c69fdd" },
        {
          url: "/favicon_io/android-chrome-192x192.png",
          revision: "07281900d7ffa5690cc984da6e613805",
        },
        {
          url: "/favicon_io/android-chrome-512x512.png",
          revision: "ee520bf09fd4e101b8952887694905fc",
        },
        {
          url: "/favicon_io/apple-touch-icon.png",
          revision: "6f682a595255e6aab2bf0f2daa78403a",
        },
        {
          url: "/favicon_io/favicon-16x16.png",
          revision: "2d00862eea3e0a26607d3d0ce24d1747",
        },
        {
          url: "/favicon_io/favicon-32x32.png",
          revision: "84f7a4563c6fb8cd905f2dbedcffede8",
        },
        {
          url: "/fileClosed.svg",
          revision: "c1043d1647d8e64ae842e4dc5076ff3c",
        },
        { url: "/fileOpen.svg", revision: "1f3c4dc7f5a3014977164cb3e521a79a" },
        {
          url: "/filterDials.svg",
          revision: "cb34dca6fd29dce5a208f812eff60738",
        },
        {
          url: "/filterFunnel.svg",
          revision: "0f82fa20971ef82c33fe8d1b2e51d2a2",
        },
        {
          url: "/form-white.svg",
          revision: "7727260eabc05abbe536245f50822db9",
        },
        { url: "/form.svg", revision: "c8cbd4923b3b42b565b82cbfc46912d8" },
        {
          url: "/formApproval.svg",
          revision: "7a4e5f7621d178ea22bf1f3f36e490a0",
        },
        {
          url: "/formDuplicate.svg",
          revision: "54e78891d2ec19ec7a850c6bf6d0c6a2",
        },
        { url: "/formEdit.svg", revision: "4d02a5f8dd2ab149cc83dc879492a96b" },
        {
          url: "/formInspect-white.svg",
          revision: "dab997ff30c5692695c8fdd511b9538a",
        },
        {
          url: "/formInspect.svg",
          revision: "40c7a917016921093b73af8804b1a6bb",
        },
        {
          url: "/formList-white.svg",
          revision: "1ced4246bc119ae2487eb92230033982",
        },
        { url: "/formList.svg", revision: "0f728fbcd57be2bc544dd870aff7bc45" },
        { url: "/formSave.svg", revision: "c2cecd191610a1e5ec41b261af5e6dae" },
        { url: "/formSent.svg", revision: "6d493b344a18dc0fee6792a9e7c45b57" },
        { url: "/formUndo.svg", revision: "d1b0750d206772bb6807b51d5266939e" },
        { url: "/hauling.svg", revision: "22c41b17a09190a985e8de059bb918fc" },
        {
          url: "/haulingFilled.svg",
          revision: "4c2bd79175a6ea10635416e2f4ac0d1b",
        },
        { url: "/header.svg", revision: "b112a0727deec3940474f660f1d37525" },
        {
          url: "/home-white.svg",
          revision: "b1ead272d9854bede6172772beb90f43",
        },
        { url: "/home.svg", revision: "0cee3930f5dc32a7283f72f0aacfa9fc" },
        {
          url: "/icon-192x192.png",
          revision: "47aa596be976071dfff9c1e5455ecc80",
        },
        {
          url: "/icon-384x384.png",
          revision: "99d1987d20b874836d950b95586968ae",
        },
        {
          url: "/icon-512x512.png",
          revision: "c16feee422d814c946012979c0d02f00",
        },
        {
          url: "/inbox-white.svg",
          revision: "a7aa7db6baee10149b052fb81fa038d9",
        },
        { url: "/inbox.svg", revision: "6d2d4364163b850b008136212ebfa552" },
        {
          url: "/inboxFilled.svg",
          revision: "99a71df8fcf7b81a398ef9a4685fe689",
        },
        {
          url: "/information.svg",
          revision: "d84b6dc4c941a6f03ae29860e5cc97f2",
        },
        { url: "/injury.svg", revision: "3882fb373f8c3eaef29fb980a8826fa8" },
        { url: "/ios/100.png", revision: "5222167951b54f250720976e5798bd81" },
        { url: "/ios/1024.png", revision: "4046bc171d373187ec11f28c06ceb334" },
        { url: "/ios/114.png", revision: "2aec0491cbf7eb22d34f3079cf2eff54" },
        { url: "/ios/120.png", revision: "52ac3d673f239d4c822b20c337c73db2" },
        { url: "/ios/128.png", revision: "bc9dd541b1a0aaff432df4f5b0fb88b4" },
        { url: "/ios/144.png", revision: "554cb47f9b447d7c049e0af337f30598" },
        { url: "/ios/152.png", revision: "3085835ae98a412b5f8bb41b3d7fccae" },
        { url: "/ios/16.png", revision: "876eb7a741ae46958961bf0ed6c30ba0" },
        { url: "/ios/167.png", revision: "a7230785a2891b4659792d7d6cab6ffb" },
        { url: "/ios/180.png", revision: "5cdb37c8967955e3a4fae232138f3c03" },
        { url: "/ios/192.png", revision: "c7acce3a1ca251dc273817cd5462a666" },
        { url: "/ios/20.png", revision: "8c0f62f1ddd74accb89e318fe432a70f" },
        { url: "/ios/256.png", revision: "19665fd60a705b586e5cc5c93eddc1f2" },
        { url: "/ios/29.png", revision: "536c6f0fcf359bba5e0b45c9bb4fc260" },
        { url: "/ios/32.png", revision: "55a60f12c21ea3fffa61d8f7a34cfc33" },
        { url: "/ios/40.png", revision: "a38e8ea2895f2cfe54be4ce7465e7952" },
        { url: "/ios/50.png", revision: "db849275edb671b9ea7c45ef6f4fc489" },
        { url: "/ios/512.png", revision: "daaca9c8424139dcfdeed3181b0a7cbd" },
        { url: "/ios/57.png", revision: "8511d6a6a25878417899d2041de166ff" },
        { url: "/ios/58.png", revision: "001948872d9d885d20140b7aa9cc6ff8" },
        { url: "/ios/60.png", revision: "80209b85fb0be10562bcee31908d2a95" },
        { url: "/ios/64.png", revision: "066fa2094719e23427225f5517889ed7" },
        { url: "/ios/72.png", revision: "0544816fbb562d0825feb6e9ff73edff" },
        { url: "/ios/76.png", revision: "0a1c5da7e5a9673345c44f7e1c87f0d4" },
        { url: "/ios/80.png", revision: "91b74cbd7d0f0119a164a0750462149e" },
        { url: "/ios/87.png", revision: "74c6a6624174372f1fc483515c820c2f" },
        {
          url: "/jobsite-white.svg",
          revision: "ebbf9f6d30ff71e63f542ae39f7f0bf4",
        },
        { url: "/jobsite.svg", revision: "cd875f40e83afb58240deee8182388d0" },
        { url: "/key.svg", revision: "a83121607cb2aa5eb283a147707703f8" },
        { url: "/language.svg", revision: "823c7858f89b4e00cb77c9eab2adc82a" },
        { url: "/layout.svg", revision: "c6e0b7567d8bcaab0c3a9a7367166be9" },
        { url: "/logo.svg", revision: "5013b0a843053e8d6d5a440fda05d2d6" },
        { url: "/logo_JPG.jpg", revision: "e84c38cbd142e140688beacd59e6a0cf" },
        { url: "/manifest.json", revision: "cce4da1d52724f6d751609b04fc55d5b" },
        { url: "/mechanic.svg", revision: "3dedb251fd8749f9f2a1e81438d98f19" },
        { url: "/message.svg", revision: "b3b9318e3f52ea05f63009c3c24363d7" },
        { url: "/mileage.svg", revision: "e08fc7c3cbdd84e6d807972fb65ce639" },
        { url: "/minus.svg", revision: "e73270701b55309bf7ecf3137e313561" },
        {
          url: "/moreOptions.svg",
          revision: "4892a665d84184c6ef389ff9e10b4e4b",
        },
        {
          url: "/moreOptionsCircle.svg",
          revision: "a55009979e7190d2728556274b6839a9",
        },
        {
          url: "/notifications-sw.js",
          revision: "60d2449caccfaa4c1e16bbb5508c8179",
        },
        { url: "/number.svg", revision: "870c338d522f9ec793e109df4df77ae8" },
        {
          url: "/plus-stroke-white.svg",
          revision: "9e7c52c21d1cd95e9bae39fd0c9f4633",
        },
        {
          url: "/plus-white.svg",
          revision: "a3d859abbf1ce862eb0aa1d070d85fbf",
        },
        { url: "/plus.svg", revision: "33d3fcf5251a72f1eef80aaa19f7ab55" },
        { url: "/policies.svg", revision: "2596e864ab73809a12f67392e5cd914a" },
        {
          url: "/priorityDelay.svg",
          revision: "99d1bf5c9ba9ac31a07b8e19ed69731b",
        },
        {
          url: "/priorityHigh.svg",
          revision: "b6564c585b9260e1895fe90ce0e0fc0a",
        },
        {
          url: "/priorityLow.svg",
          revision: "ec51451630a7b7e26291cc7e2fa9fb0c",
        },
        {
          url: "/priorityMedium.svg",
          revision: "4f410630f61bce48fb417208d8be6e31",
        },
        {
          url: "/priorityPending.svg",
          revision: "6811d49c8ac9b1e7e0be07ccf9578f6a",
        },
        {
          url: "/priorityToday.svg",
          revision: "920733fce9e93c142c8ffb374e5a19f8",
        },
        {
          url: "/profileEmpty.svg",
          revision: "7c7b8182f7871432e3fca6e74af259a3",
        },
        {
          url: "/profileFilled.svg",
          revision: "3736f3ece15674a72d2f2041e479b6f2",
        },
        {
          url: "/qrCode-white.svg",
          revision: "ecaa8b47480fd6c17890b184470e1001",
        },
        { url: "/qrCode.svg", revision: "e7d79dfc3eda6bde2058146c4eb35a95" },
        { url: "/radio.svg", revision: "c020a08b6a1a511fb83fa1faefd891e1" },
        { url: "/refuel.svg", revision: "8de821dd988a8915cdff8d8a8e4a9f5f" },
        {
          url: "/refuelFilled.svg",
          revision: "4759bff99588897cb01b777a8add0862",
        },
        {
          url: "/searchLeft.svg",
          revision: "829f27a05bcdd0e55110abb5880bf26e",
        },
        {
          url: "/searchRight.svg",
          revision: "c7755f2ac66494370d8cd40e51a08d43",
        },
        {
          url: "/settingsFilled.svg",
          revision: "f3b5bcf5cc9b7410ac162c5bce0c848c",
        },
        {
          url: "/shiftScanLogo.svg",
          revision: "4e8ca932058d8f8b165df2892e241641",
        },
        {
          url: "/shiftscanlogoHorizontal.svg",
          revision: "424537f3cb1e54ebab9d2b8bcfe2f9c3",
        },
        { url: "/spinner.svg", revision: "c974e9eb5481551a99241eccc03c5741" },
        { url: "/star.svg", revision: "647e3ea024f946f79c5c598a65844a4e" },
        {
          url: "/starFilled.svg",
          revision: "d4bd71d3e5b9b4e23c8abb7ccf32ce8c",
        },
        { url: "/state.svg", revision: "b98228eccceccc8d0784cfc7774122ca" },
        {
          url: "/stateFilled.svg",
          revision: "a14e1cdd3b529ac1997a69b8c773ae3a",
        },
        {
          url: "/statusApproved.svg",
          revision: "ea921ad6e254d9e1a2169c273b42f47f",
        },
        {
          url: "/statusApprovedFilled.svg",
          revision: "3ba0ad018a809ae57844dd02f97158e8",
        },
        {
          url: "/statusDenied.svg",
          revision: "1ddd4c085572c9e49190997a2e7f5609",
        },
        {
          url: "/statusDeniedFilled.svg",
          revision: "4dd5d5d1801c5106e9d05926d57d78cf",
        },
        {
          url: "/statusOffline.svg",
          revision: "27ddbe983ce5dfd5a53cda2fea8cba1c",
        },
        {
          url: "/statusOngoing-white.svg",
          revision: "0223e98e65f11ba77bf01b226b4472ba",
        },
        {
          url: "/statusOngoing.svg",
          revision: "c974e9eb5481551a99241eccc03c5741",
        },
        {
          url: "/statusOngoingFilled.svg",
          revision: "52ecdb305626a4c4eb3bd97a237361c0",
        },
        {
          url: "/statusOnline.svg",
          revision: "474003f319b29f21674dc310b5adea4a",
        },
        {
          url: "/statusUnfinished.svg",
          revision: "af976fb3bbba903cfb55e9fbe86893ca",
        },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "447aee4a2c24fefe7917563f0255d688",
        },
        { url: "/tasco.svg", revision: "6b246ffcae10964b1e35cecc60ad03a9" },
        {
          url: "/team-white.svg",
          revision: "9848f49314998f3482b1009a2bdc9d34",
        },
        { url: "/team.svg", revision: "90c431cced8b792841dcd4302bdb4151" },
        { url: "/timecards.svg", revision: "0a7b3ac59cf6a7dfce6fe1a71b13e944" },
        {
          url: "/tinyCheckMark-white.svg",
          revision: "d7da78ab0857457326ab6ba35e4fdb1e",
        },
        { url: "/title.svg", revision: "3e5e4b951793a7dff112dd13a5a354c9" },
        { url: "/trash-red.svg", revision: "46e4440442b2c299c7c249c7ee8ae4fa" },
        { url: "/trash.svg", revision: "6f8574b052b5cdf5948d370ac9565fce" },
        { url: "/trucking.svg", revision: "4073d2c5039a0a9e92fd88b8bc6a5a25" },
        {
          url: "/user-white.svg",
          revision: "d423ab1c6c73d95f0698698df84f7211",
        },
        { url: "/user.svg", revision: "8756e7b0a6bc7ba8068b0f0806b5e5e7" },
        {
          url: "/windows11/LargeTile.scale-100.png",
          revision: "e3ae3637973ea93ff81e73ee37effe0c",
        },
        {
          url: "/windows11/LargeTile.scale-125.png",
          revision: "6e4ec698528b71f25efd6ff2dd68e89f",
        },
        {
          url: "/windows11/LargeTile.scale-150.png",
          revision: "b636fa1812d337a4ca1224b433a3d855",
        },
        {
          url: "/windows11/LargeTile.scale-200.png",
          revision: "d18a045105d03ba23b624c109708f7bb",
        },
        {
          url: "/windows11/LargeTile.scale-400.png",
          revision: "d4176f9ebaacc0bbfebf56fd56e253ce",
        },
        {
          url: "/windows11/SmallTile.scale-100.png",
          revision: "bce1445e4fb91c8c0842780a4026522e",
        },
        {
          url: "/windows11/SmallTile.scale-125.png",
          revision: "9415b7ff287961c074dee1834b42aad9",
        },
        {
          url: "/windows11/SmallTile.scale-150.png",
          revision: "87d19729c39b8d355a62d180d91bb31b",
        },
        {
          url: "/windows11/SmallTile.scale-200.png",
          revision: "7c5db43e6077ca3c958c21c85bec6d25",
        },
        {
          url: "/windows11/SmallTile.scale-400.png",
          revision: "1913d6ed56bc5b31dc60858acbcace6f",
        },
        {
          url: "/windows11/SplashScreen.scale-100.png",
          revision: "a8215f24409e6231d1dc00a0907ed4a8",
        },
        {
          url: "/windows11/SplashScreen.scale-125.png",
          revision: "097ac942f0459d3481fbd62c0f97e299",
        },
        {
          url: "/windows11/SplashScreen.scale-150.png",
          revision: "201fc53647b740af27d9b004cafeaaf8",
        },
        {
          url: "/windows11/SplashScreen.scale-200.png",
          revision: "1b1081f94203f3823ed2dd1f8dabb29a",
        },
        {
          url: "/windows11/SplashScreen.scale-400.png",
          revision: "0d6ee6f415a7d2101792e2b8312af059",
        },
        {
          url: "/windows11/Square150x150Logo.scale-100.png",
          revision: "7b6855c0928dad5db20403341b059afc",
        },
        {
          url: "/windows11/Square150x150Logo.scale-125.png",
          revision: "dd8460f97de8d2cf5826468f8f8153db",
        },
        {
          url: "/windows11/Square150x150Logo.scale-150.png",
          revision: "8bfd4727bbeb856bd1af17e0cdef44ea",
        },
        {
          url: "/windows11/Square150x150Logo.scale-200.png",
          revision: "c95f1e579117442bcf6a388818260303",
        },
        {
          url: "/windows11/Square150x150Logo.scale-400.png",
          revision: "a20add32148ad6bfcc0d435ac4986eb5",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
          revision: "90a9d6c44b09d44f416b62df26224428",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
          revision: "779afd7d8c738f0a0c73a4a6d63e4aff",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
          revision: "a65f2b674acb5c2af36db18e9b4a63f1",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
          revision: "723b833ab63af25543dfe92f0a56e6d5",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
          revision: "3a63be52b054d426a0ee4ce69b783e12",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
          revision: "261d9c7ca92fefc2230721bb99cbcae1",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
          revision: "a709411193e6374836f5fa82b8afa6c1",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
          revision: "4251a65706de0f7c86b1bee205eb53a7",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
          revision: "9f4cf9e0ba353f1bbb19fc9f6e40523a",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
          revision: "c87a2b33f89afc0199219ea0b6e191ac",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
          revision: "727adb65708020078e70655ef5444a7b",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
          revision: "04915cfcb9f9ad29a6223fb193c79a14",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
          revision: "1f5e7f8fb46e7d8e425ff06c34338b6d",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
          revision: "3a7aa9e5f873375880d85aa0c2f51306",
        },
        {
          url: "/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
          revision: "a151f9aefbcedac0d11aba5cf1108af8",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
          revision: "90a9d6c44b09d44f416b62df26224428",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
          revision: "779afd7d8c738f0a0c73a4a6d63e4aff",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
          revision: "a65f2b674acb5c2af36db18e9b4a63f1",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
          revision: "723b833ab63af25543dfe92f0a56e6d5",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
          revision: "3a63be52b054d426a0ee4ce69b783e12",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
          revision: "261d9c7ca92fefc2230721bb99cbcae1",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
          revision: "a709411193e6374836f5fa82b8afa6c1",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
          revision: "4251a65706de0f7c86b1bee205eb53a7",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
          revision: "9f4cf9e0ba353f1bbb19fc9f6e40523a",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
          revision: "c87a2b33f89afc0199219ea0b6e191ac",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
          revision: "727adb65708020078e70655ef5444a7b",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
          revision: "04915cfcb9f9ad29a6223fb193c79a14",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
          revision: "1f5e7f8fb46e7d8e425ff06c34338b6d",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
          revision: "3a7aa9e5f873375880d85aa0c2f51306",
        },
        {
          url: "/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
          revision: "a151f9aefbcedac0d11aba5cf1108af8",
        },
        {
          url: "/windows11/Square44x44Logo.scale-100.png",
          revision: "9f4cf9e0ba353f1bbb19fc9f6e40523a",
        },
        {
          url: "/windows11/Square44x44Logo.scale-125.png",
          revision: "95498060191b331348eb8f5b5ab6dfe7",
        },
        {
          url: "/windows11/Square44x44Logo.scale-150.png",
          revision: "aced07a7a4627cdad487ed0a46faeebb",
        },
        {
          url: "/windows11/Square44x44Logo.scale-200.png",
          revision: "db11fa1c0b22e2344ecf9dea9af68a2c",
        },
        {
          url: "/windows11/Square44x44Logo.scale-400.png",
          revision: "5f1b23fb222c880bf3c533643f43b4ca",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-16.png",
          revision: "90a9d6c44b09d44f416b62df26224428",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-20.png",
          revision: "779afd7d8c738f0a0c73a4a6d63e4aff",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-24.png",
          revision: "a65f2b674acb5c2af36db18e9b4a63f1",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-256.png",
          revision: "723b833ab63af25543dfe92f0a56e6d5",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-30.png",
          revision: "3a63be52b054d426a0ee4ce69b783e12",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-32.png",
          revision: "261d9c7ca92fefc2230721bb99cbcae1",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-36.png",
          revision: "a709411193e6374836f5fa82b8afa6c1",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-40.png",
          revision: "4251a65706de0f7c86b1bee205eb53a7",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-44.png",
          revision: "9f4cf9e0ba353f1bbb19fc9f6e40523a",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-48.png",
          revision: "c87a2b33f89afc0199219ea0b6e191ac",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-60.png",
          revision: "727adb65708020078e70655ef5444a7b",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-64.png",
          revision: "04915cfcb9f9ad29a6223fb193c79a14",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-72.png",
          revision: "1f5e7f8fb46e7d8e425ff06c34338b6d",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-80.png",
          revision: "3a7aa9e5f873375880d85aa0c2f51306",
        },
        {
          url: "/windows11/Square44x44Logo.targetsize-96.png",
          revision: "a151f9aefbcedac0d11aba5cf1108af8",
        },
        {
          url: "/windows11/StoreLogo.scale-100.png",
          revision: "db849275edb671b9ea7c45ef6f4fc489",
        },
        {
          url: "/windows11/StoreLogo.scale-125.png",
          revision: "728e6527e2d77371e3007caf007b116f",
        },
        {
          url: "/windows11/StoreLogo.scale-150.png",
          revision: "9224f9a45257c2103e10aa9026af46d1",
        },
        {
          url: "/windows11/StoreLogo.scale-200.png",
          revision: "5222167951b54f250720976e5798bd81",
        },
        {
          url: "/windows11/StoreLogo.scale-400.png",
          revision: "6562c92cea67a6232c5727e464a9dd83",
        },
        {
          url: "/windows11/Wide310x150Logo.scale-100.png",
          revision: "7fc14247c4af58216f16d5f4f98fc46b",
        },
        {
          url: "/windows11/Wide310x150Logo.scale-125.png",
          revision: "a0c8d4ccacb2bc65438458df95ab3d60",
        },
        {
          url: "/windows11/Wide310x150Logo.scale-150.png",
          revision: "34161357c0cdafe2651b8d197c019798",
        },
        {
          url: "/windows11/Wide310x150Logo.scale-200.png",
          revision: "a8215f24409e6231d1dc00a0907ed4a8",
        },
        {
          url: "/windows11/Wide310x150Logo.scale-400.png",
          revision: "1b1081f94203f3823ed2dd1f8dabb29a",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
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
      "GET",
    ),
    e.registerRoute(
      /^https?.*/,
      new e.NetworkFirst({
        cacheName: "offlineCache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0));
});
//# sourceMappingURL=sw.js.map
