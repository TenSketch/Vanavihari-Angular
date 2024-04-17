import { CompactSign, jwtVerify } from 'jose';

function urlBase64Encode(str) {
    let base64 = btoa(unescape(encodeURIComponent(str)));
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return (base64 + padding).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
// function calculateHmacSha256(data, key) {
//   const dataUint8 = new TextEncoder().encode(data);
//   const keyUint8 = new TextEncoder().encode(key);
//   const encrypted = Aes.encrypt(dataUint8, keyUint8, {
//       mode: new Cbc(new Uint8Array(16)),
//       padding: Padding.PKCS7
//   });
//   const base64 = btoa(String.fromCharCode(...encrypted));
//   const base64Url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
//   return base64Url;
// }
export default async (req) => {
    try {
      const clientID = "bduatv2apt";
      const secretKey = "DnVd1pJpk3oFOdjNgRRPT1OgwfH1DYku";
  
      const secretKeyUint8 = new TextEncoder().encode(secretKey);
      const jwk = {
        kty: 'oct',
        alg: 'HS256',
        k: secretKeyUint8
      };
  
      const jwsHeader = {
        "alg": "HS256",
        "clientid": clientID
      };
  
      const jwsPayload = {
        "mercid": "BDUATV2APT",
        "orderid": "order45608988",
        "amount": "300.00",
        "order_date": "2023-07-16T10:59:15+05:30",
        "currency": "356",
        "ru": "https://vanavihari.com/#/payment-return",
        "additional_info": {
          "additional_info1": "Details1",
          "additional_info2": "Details2"
        },
        "itemcode": "DIRECT",
        "device": {
          "init_channel": "internet",
          "ip": "103.104.59.11",
          "user_agent": "Mozilla/5.0(WindowsNT10.0;WOW64;rv:51.0)Gecko/20100101 Firefox/51.0",
          "accept_header": "text/html",
          "fingerprintid": "61b12c18b5d0cf901be34a23ca64bb19",
          "browser_tz": "-330",
          "browser_color_depth": "32",
          "browser_java_enabled": "false",
          "browser_screen_height": "601",
          "browser_screen_width": "657",
          "browser_language": "en-US",
          "browser_javascript_enabled": "true"
        }
      };
  
      const jwsPayloadUint8 = new TextEncoder().encode(jwsPayload);
      const jwsToken = await new CompactSign(jwsPayloadUint8)
        .setProtectedHeader(jwsHeader)
        .sign(jwk);
      return new Response(JSON.stringify({'status':'success', 'jws':jws }), {
          headers: { "Content-Type": "application/json" },
      });
    }
    catch (error)
    {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
}

export const config = { path: "/test" };