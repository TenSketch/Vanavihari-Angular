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
      let booking_id = '';
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
          apiUrl = `${zoho_api_uri}Account_Registration?publickey=${process.env.Account_Registration}&${queryParams.toString()}`;
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
          apiUrl = `${zoho_api_uri}Login_Validation?publickey=${process.env.Login_Validation}&${queryParams.toString()}`;
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
          apiUrl = `${zoho_api_uri}Email_Verification?publickey=${process.env.Email_Verification}&&${queryParams.toString()}`;
          method = "GET";
          break;
        case "room_list":
          console.log(process.env.Account_Registration)
          apiUrl = `${zoho_api_uri}Rooms_List?publickey=${process.env.Rooms_List}&${queryParams.toString()}`;
          method = "GET";
          break;
        case "profile_details":
          if (!queryParams.has("token") || !queryParams.has("email")) {
              return new Response(JSON.stringify({ error: 'Missing required parameters for email verification' }), {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
              });
          }
          apiUrl = `${zoho_api_uri}Profile_Details?publickey=${process.env.Profile_Details}&${queryParams.toString()}`;
          method = "GET";
          break;
        case "edit_profile_details":
          if (!queryParams.has("token") || !queryParams.has("email")) {
              return new Response(JSON.stringify({ error: 'Missing required parameters for email verification' }), {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
              });
          }
          apiUrl = `${zoho_api_uri}Edit_Profile?publickey=${process.env.Edit_Profile}&${queryParams.toString()}`;
          method = "GET";
          break;
        case "booking":
          apiUrl = `${zoho_api_uri}Reservation?publickey=${process.env.Reservation}&${queryParams.toString()}`;
          method = "GET";
          break;
        case "booking_history":
          apiUrl = `${zoho_api_uri}Reservation_Histrory?publickey=${process.env.Reservation_Histrory}&${queryParams.toString()}`;
          method = "GET";
          break;
        case "get_payment_response":
          const body = await req.text();
          const formData = new URLSearchParams(body);
          const msg = formData.get('msg');
          if (msg == null || msg == "" || msg == undefined) {
            return new Response(JSON.stringify({ error: 'Missing required parameters for msg' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
          }
          const msgres = msg.split('|');
          booking_id = msgres[1];
          apiUrl = `${zoho_api_uri}Update_Payment_Status?publickey=${process.env.Update_Payment_Status}&booking_id=${booking_id}&transaction_id=${msgres[2]}&transaction_date=${msgres[13]}&transaction_amt=${msgres[4]}&status=${msgres[24].split('-')[1]}`;
          method = "GET";
          break;
        case "booking_detail":
          apiUrl = `${zoho_api_uri}Reservation_Detail?publickey=${process.env.Reservation_Detail}&${queryParams.toString()}`;
          method = "GET";
          break;
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
              "Location": `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
            },
          });
        } else {
          return new Response(null, {
            status: 302,
            headers: {
              "Location": `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
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
  
  export const config = {
    path: "/zoho-connect",
  };