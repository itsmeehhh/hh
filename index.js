import { firefox } from 'playwright';
import UserAgent from 'user-agents';

let url = "https://youtube.com/shorts/sI9VgfUvoI8?si=sLntyiaXnaO1Ol95";
console.log(`watching: ${url}`);

const cookiesArray = [
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=X_heg210ystbf7Gk/A1l8xHtkeq5nCKCmb; SAPISID=6fWfh_ffhP8GhFBe/ANO53-z5WbRCV4iXB; __Secure-1PAPISID=6fWfh_ffhP8GhFBe/ANO53-z5WbRCV4iXB; __Secure-3PAPISID=6fWfh_ffhP8GhFBe/ANO53-z5WbRCV4iXB; SID=g.a000kwhLhAh-by0XSp1LFMkEF_RA-CcwqWlOFcds0bo_gRft_y9MjvIW-jtcjGM___lvWGFt0AACgYKAYkSARMSFQHGX2MiAMSySNWs2ov-AoNLYO5fPxoVAUF8yKoRkl1Mp2GijHz6UOTRikcr0076; ST-6hujrl=csn=dsnYcuC-gtMIU3K6&itct=CBQQwJ4JGAAiEwi29dWb1t2GAxW6IAYAHZhqDaI%3D; SIDCC=AKEyXzWi5nrS6l6F4Km_pyPOAeLnMvJEK3AY1lDxYkZtMTAlwWTJ_JNzob3jK8e9UuNYf61i',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=O9B7lRGCSVYGtPMr/A79N-0ogtgFTfVdeu; SAPISID=tvABYOJaOaWdjAvx/AHXBOUAX2pCEkcptu; __Secure-1PAPISID=tvABYOJaOaWdjAvx/AHXBOUAX2pCEkcptu; __Secure-3PAPISID=tvABYOJaOaWdjAvx/AHXBOUAX2pCEkcptu; SID=g.a000kwhVQVpiw323l-2_sejZh1diiW-BjDa3NGVfDaBGI9W77vMzwzhzHwUMdhL1zdYs58q0uQACgYKAf0SAQ4SFQHGX2Mig37QgWwxcui7c9pkcVoAzRoVAUF8yKo2nzP4D2bdNx_bGNNjb0PC0076; SIDCC=AKEyXzWpjCT0VIb7QHo16fumSNuHnz8u3G3_JGl_TZSexDQJ9PIiA-4KcgqxJaERNjMKchvH',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=2jI10Raa1RRc0lUv/ARp--zPTwYNN9tUwK; SAPISID=lj1oFSGBwadKhBwd/A4YqUaTlQDplUcAB5; __Secure-1PAPISID=lj1oFSGBwadKhBwd/A4YqUaTlQDplUcAB5; __Secure-3PAPISID=lj1oFSGBwadKhBwd/A4YqUaTlQDplUcAB5; SID=g.a000kwga6NUf2uez9pjXJmW9utbxZixfmK-jDpExqK3e9IAmU-INiwH6YrVNY0OosSBQjwECTgACgYKAZkSARISFQHGX2Mi_C8ZNUSbb8ly0tBZDa_NTRoVAUF8yKrLf3CNEnXoPUWr_RxgJnqL0076; SIDCC=AKEyXzUk9IV_mXODQpnvFeI6dbWKAjSqvAp8-YoygbxkuTvVoUkGp2PLGMZetXDnOnVc2uBZIw',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=lbvhRJnDpoqXqVqQ/AweNMgwhumbXAcC5w; SAPISID=b9hL9Re-lm4guyay/AOk9QFR0pZbtCJRik; __Secure-1PAPISID=b9hL9Re-lm4guyay/AOk9QFR0pZbtCJRik; __Secure-3PAPISID=b9hL9Re-lm4guyay/AOk9QFR0pZbtCJRik; SID=g.a000kwhNPHravuAV_5F5Ay-T7V2w6UOj-doGFUuEQZiphb-bXRmgIf5lYmKgkJfIe8PcOaJhkAACgYKAQgSARMSFQHGX2MiWfJKu3ceP59mkH9haPgHmBoVAUF8yKoCiYK00FHquw5F_ofoZp020076; ST-jesc9=csn=Ev4xIggQNDIOnChA&itct=CBQQwJ4JGAAiEwjWn6ig1d2GAxVfPgYAHVB-B6M%3D; SIDCC=AKEyXzWobeA7AJ46rmopTTf0AyZG6yhkgWKAW0_KqshwSy6eq64Lvhiukj4ECdvnww33qDIq',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; SID=g.a000kwhh7f2DxCq526xfue0H7oOvTS870FG3bqEIhekGJXZKZrzUSlj2qwjpnZw6ciCY3ReyeAACgYKAegSARMSFQHGX2Mi4CD8rAECDaSWj69T3b0a3xoVAUF8yKosY4imDdMjo1YtEZW95zzi0076; APISID=9UXCqp2IiDkHpYpn/A1f2CUMAnzYcKORau; SAPISID=UA9Iiaafpq3kTRnS/AkJvUvSTGC1fWjKMp; __Secure-1PAPISID=UA9Iiaafpq3kTRnS/AkJvUvSTGC1fWjKMp; __Secure-3PAPISID=UA9Iiaafpq3kTRnS/AkJvUvSTGC1fWjKMp; SIDCC=AKEyXzXiPmaPz6bSGNAOk4P2IJXS9MA57_Pfx5M-Z-2auP7ri4JLo-jS7ZUeV0Yk-zAVw2zWiQ',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=dV0J5NUXvo3jnA_T/A1X7wiX9EulLd9CFX; SAPISID=3BQ-zBU6O1pPtnYt/AHMY4kSVYlCV9atOL; __Secure-1PAPISID=3BQ-zBU6O1pPtnYt/AHMY4kSVYlCV9atOL; __Secure-3PAPISID=3BQ-zBU6O1pPtnYt/AHMY4kSVYlCV9atOL; SID=g.a000kwg-FatEEPhXCeBUJzXYtY4tg1G1IvbF1jJ-Bv85igHgxrVCZvqerC46LEeCy-ghAaeJ9gACgYKAYcSARcSFQHGX2Mi5jA4MeIw_rTtIjY1lQwi4RoVAUF8yKq8SYmi7o_ROwWHF3Wz4LBk0076; ST-1yt553b=csn=c_NUsIUKFgfy91br&itct=CBQQwJ4JGAAiEwjK1_2_1N2GAxVcBgYAHfWDCKM%3D; SIDCC=AKEyXzXCVWpkYVpqqs2BnGelgfFquYNoNh91gxsGnDuWSWrTMVzBmXAuM4ni77JwWN9sttKw',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=zDs1BMV_D6qpmRyi/AagFKqcrleA14TT56; SAPISID=-ITC2RAjKVQV_IJO/AKgPDx23PCp_LOX2D; __Secure-1PAPISID=-ITC2RAjKVQV_IJO/AKgPDx23PCp_LOX2D; __Secure-3PAPISID=-ITC2RAjKVQV_IJO/AKgPDx23PCp_LOX2D; SID=g.a000kwhJH4T2DRcQUqqwPavQOrjF4FNrj-FiCIaM3_ZKgEnZTjwaQ21lA6gekrTb3AWzGn5P3AACgYKAeYSARUSFQHGX2MihVgxgIgxPdFERM-XHmMb3RoVAUF8yKpkv6ssdP6pPuZnlzKauIln0076; SIDCC=AKEyXzXgbGRoYC51kVNCd7intf_s_H1fBXIh6x-G_iyRYPtv0rjJaW_prZq7s-4oioKJFXbN',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; SID=g.a000kwhpKgQnwZltjH7uo8z5j1CILUZplwW7SPnXDHjxjRlTO0pVlstBqzixJQzKIIUty_HYKQACgYKASYSARMSFQHGX2Mi-c_8Ep6eRbwICA2POOmzMxoVAUF8yKqXWY6F_wP4Ykn04AHzYNTf0076; APISID=2xF15WcSUoOC9cAZ/ALW-t41rMgwEtMpJF; SAPISID=KoNTDNCMIK_-rHtz/A0BYBH0djNMAeSyWT; __Secure-1PAPISID=KoNTDNCMIK_-rHtz/A0BYBH0djNMAeSyWT; __Secure-3PAPISID=KoNTDNCMIK_-rHtz/A0BYBH0djNMAeSyWT; SIDCC=AKEyXzW9uTUlV2FFt8cagRjRFiVcj_66tY2Nw_00JbpOZEsOcnGZ20n5x5T-o_IJ5Bn60Wbi',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=r-G7H4ciuPk56RKh/AQuAfvWqqbG67X7oy; SAPISID=i5p8lobXiwxlLnfZ/A538DWe2r_wLfXN9U; __Secure-1PAPISID=i5p8lobXiwxlLnfZ/A538DWe2r_wLfXN9U; __Secure-3PAPISID=i5p8lobXiwxlLnfZ/A538DWe2r_wLfXN9U; SID=g.a000kwhxwb_cVHLJFit6lwmOjChWXqaeX6ivm01w_n__tNUtKQ0qAXJUtCFEJw6QkxZZMc_tYAACgYKAZsSARUSFQHGX2MiGzjV9H2KweJUIl8zcGyQ6xoVAUF8yKrCMO-p-ErJmebUe0MoX2OR0076; SIDCC=AKEyXzXYYS0iOiu-aicLFVVNAmvt0JXHFXqEToaakBGZ324YDFO6bfAZtuvTkn18NqMJCfsHRw',
  'SOCS=CAISEwgDEgk2MzcwNjAwNTcaAmFyIAEaBgiAvdSyBg; PREF=tz=Africa.Casablanca&f7=4100&f4=4000000; APISID=joVXVDRMJxwg8Uim/ADyFYjXsbAe-RGVwX; SAPISID=f_Q1e3nnBIyW4FVB/APEBCWr203sGgaq2y; __Secure-1PAPISID=f_Q1e3nnBIyW4FVB/APEBCWr203sGgaq2y; __Secure-3PAPISID=f_Q1e3nnBIyW4FVB/APEBCWr203sGgaq2y; SID=g.a000kwhfiyHvdhc-LuBYYAlj-7fgvmqOf7qJcyhBqXRobX9tLY_gJiMiweJcvzAN12prg03uUgACgYKAdgSARUSFQHGX2MiABuI_nShnxLUwTn64Tle_xoVAUF8yKp88J-JqiHa-6hyqxfKKgvf0076; SIDCC=AKEyXzXTQhSsPD1vB-QLizTBOs2fAcDjpAtvV8n3uxdxhQr8Kg6J64-xjgdo86iTAKcngZ_Aog'
];

async function openPage(cookie) {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      browser = await firefox.launch({ headless: true });
      const context = await browser.newContext({
        cookies: cookie.split(';').map(cookie => {
          const [name, value] = cookie.split('=');
          return {
            name: name.trim(),
            value: value.trim(),
            domain: '.youtube.com',
            path: '/'
          };
        }),
        userAgent: new UserAgent().toString()
      });

      const page = await context.newPage();
      await page.goto(url, { timeout: 60000 });
      await page.click('button[aria-label="Play"]');
      await page.waitForTimeout(30000);
      resolve();
    } catch (error) {
      console.error('حدث خطأ:', error);
      reject(error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });
}

async function executeInParallel() {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(openPage(cookiesArray[i]));
  }
  await Promise.all(promises).catch(error => {
    console.error('حدث خطأ أثناء تشغيل الأكواد:', error);
  });
}

async function repeatForever() {
  while (true) {
    await executeInParallel();
    console.log(`watching again: ${url}`);
  }
}

repeatForever();
