import { CompactSign, jwtVerify } from 'jose';
import { createHmac } from 'crypto';

export default async (req) => {
    try {
      const clientID = "bduatv2apt";
      const secretKey = "DnVd1pJpk3oFOdjNgRRPT1OgwfH1DYku";
  
      const jwsHeader = {
        "alg": "HS256",
        "clientid": clientID
      };
      const jwsPayload = {
        "mercid": "BDUATV2APT",
        "orderid": "order45608928",
        "amount": "300.00",
        "order_date": "2023-07-16T10:59:15+05:30",
        "currency": "356",
        "ru": "https://www.merchant.com/",
        "additional_info": {
            "additional_info1": "Details1",
            "additional_info2": "Details2"
        },
        "itemcode": "DIRECT",
        "device": {
            "init_channel": "internet",
            "ip": "75.2.60.5",
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
    
    const base64UrlPayload = Buffer.from(JSON.stringify(jwsPayload)).toString('base64');
    const base64UrlHeader = Buffer.from(JSON.stringify(jwsHeader)).toString('base64');
    console.log(base64UrlHeader+'.'+base64UrlPayload);

    
    
    const signature = createHmac('sha256', secretKey).update(base64UrlHeader+'.'+base64UrlPayload).digest('base64');
    console.log(signature);
    const jwsToken = base64UrlHeader+'.'+base64UrlPayload+'.'+signature; 


        const timeStamp = Math.floor(Date.now() / 1000);
        const apiUrl = "https://uat1.billdesk.com/u2/payments/ve1_2/orders/create";
        const headers = {
            "Content-Type": "application/jose",
            "Accept": "application/jose",
            "BD-Traceid": "20201817132207AB72K",
            "BD-Timestamp": `${timeStamp}`
        };
        const options = {
            method: 'POST',
            body: jwsToken,
            headers: headers
        };

        fetch(apiUrl, options)
        .then(response => {
          // console.log('Response status:', response.status);
            console.log(response);
            return response.text();
        })
        .then(data => {
            console.log('Response data:', data);
            const dataOutput = data.split('.');
            var encodeResHead = (Buffer(dataOutput[0], 'base64')).toString('utf8');
            var encodeRes = (Buffer(dataOutput[1], 'base64')).toString('utf8');
            console.log(encodeResHead);
            console.log(encodeRes);
            console.log(timeStamp);
 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    



            
      return new Response(JSON.stringify({'status':'success' }), {
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