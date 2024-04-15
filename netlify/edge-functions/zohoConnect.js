export default async (req) => {
  const zoho_api_uri = "https://www.zohoapis.com/creator/custom/vanavihari/";
  try {
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    if (!queryParams) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // const { query } = req;
    if (!queryParams.has("api_type")) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiType = queryParams.get("api_type");

    let apiUrl = "";
    let method = "";
    let requestBody = {};
    let perm = '';
    switch (apiType) {
      case "register":
        if (
          !queryParams.has("fullname") ||
          !queryParams.has("email") ||
          !queryParams.has("mobile") ||
          !queryParams.has("password")
        ) {
          return new Response(
            JSON.stringify({
              error: "Missing required parameters for register",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        apiUrl = `${zoho_api_uri}Account_Registration?publickey=kFs7xRDC5eRPfyCQ0W7yQNCRv&${queryParams.toString()}`;
        method = "GET";
        break;
      case "login":
        if (!queryParams.has("username") || !queryParams.has("password")) {
          return new Response(
            JSON.stringify({ error: "Missing required parameters for login" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        apiUrl = `${zoho_api_uri}Login_Validation?publickey=PWu6q9GvYJJjNSnM6UFSU6fSx&${queryParams.toString()}`;
        method = "GET";
        break;
      case "email_verification":
        if (!queryParams.has("token") || !queryParams.has("guest_id")) {
          return new Response(
            JSON.stringify({
              error: "Missing required parameters for email verification",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        apiUrl = `${zoho_api_uri}Email_Verification?publickey=TJNXwBQpaFWVvUK3ZmKvufVOJ&&${queryParams.toString()}`;
        method = "GET";
        break;
      case "room_list":
        apiUrl = `${zoho_api_uri}Rooms_List?publickey=J4s0fXQ0wuxFDJJ2ns9Gs3GqK&${queryParams.toString()}`;
        method = "GET";
        break;
      case "profile_details":
        if (!queryParams.has("token") || !queryParams.has("email")) {
            return new Response(JSON.stringify({ error: 'Missing required parameters for email verification' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        apiUrl = `${zoho_api_uri}Profile_Details?publickey=7AwGYAgpPRaOUDEzbqYpeFyvs&${queryParams.toString()}`;
        method = "GET";
        break;
      case "edit_profile_details":
        if (!queryParams.has("token") || !queryParams.has("email")) {
            return new Response(JSON.stringify({ error: 'Missing required parameters for email verification' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        apiUrl = `${zoho_api_uri}Edit_Profile?publickey=AKSTTeZV7TEPW4xd2JwaVOuYn&${queryParams.toString()}`;
        method = "GET";
        break;
      case "booking":
        apiUrl = `${zoho_api_uri}Reservation?publickey=TDHrEVmP2ArM1VtEaM1xOdUwF&${queryParams.toString()}`;
        method = "GET";
        break;
      case "booking_history":
        apiUrl = `${zoho_api_uri}Reservation_Histrory?publickey=hxxrtQ7g2t93U1QUbSOq4kj59&${queryParams.toString()}`;
        method = "GET";
        break;
      case "get_payment_response":
        const body = await req.text();
        const formData = new URLSearchParams(body);
        const msg = formData.get('msg');
        const msgres = msg.split('|');
        apiUrl = `${zoho_api_uri}Update_Payment_Status?publickey=PqBnkhW5yqzF1TDKeEVDMNffd&booking_id=${msgres[1]}&status=${msgres[24].split('-')[1]}`;
        method = "GET";
        break;
      case "create_order_id_payment":
        const clientID = "tech234sdf";
        const secretKey = "YugsdGsdifugHGasgsd";

        const jwsHeader = JSON.stringify({
          "alg": "HS256",
          "clientid": clientID
        });

        const jwsPayload = JSON.stringify({
          "mercid": "TECH234SDF",
          "orderid": "order45608988",
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
        });

        const jsonStr = JSON.stringify(jwsHeader);
        const base64UrlHeader = urlBase64Encode(jsonStr);

        return {
          statusCode: 200,
          body: JSON.stringify({ token: base64UrlHeader }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      default:
        return new Response(
          JSON.stringify({ error: "Invalid api_type parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
    }
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // 'Access-Control-Allow-Origin': 'https://www.zohoapis.com',
      },
      // body: JSON.stringify(requestBody), // Include any request body if needed
    });

    const data = await response.json();
    if(apiType == "get_payment_response") {
      console.log(data.result.status);
      if(data.code == 3000 && data.result.status == "success") {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": 'https://vanavihari.com/#/payment-transaction-rdurl?status=Success',
          },
        });
      } else {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": 'https://vanavihari.com/#/payment-transaction-rdurl?status=Failed',
          },
        });
      }
    } else {
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
function urlBase64Encode(str) {
  let base64 = btoa(unescape(encodeURIComponent(str)));
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  return (base64 + padding).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
export const config = {
  path: "/zoho-connect",
};
