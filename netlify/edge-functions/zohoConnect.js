import { CompactSign, jwtVerify } from 'jose';
import { createHmac } from 'crypto';

export default async (req) => {
  const zoho_api_uri = "https://www.zohoapis.com/creator/custom/vanavihari/";
  let output_msg;
  const api_key = process.env.Billdesk_SecretKey;
  if (req.path === "/api/getkey") {
    return new Response(JSON.stringify({ apikey: api_key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    // const bodyText = await req.text();
    // const bodyParams = new URLSearchParams(bodyText);
    //  console.log(bodyText)
    //  console.log("email is bt",bodyText.email)
    //  console.log("email is bp",bodyParams.get("email"))
    //  console.log(JSON.parse(bodyText))
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
    let perm = "";
    let booking_id = "";
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
        apiUrl = `${zoho_api_uri}Account_Registration?publickey=${
          process.env.Account_Registration
        }&${queryParams.toString()}`;
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
        apiUrl = `${zoho_api_uri}Login_Validation?publickey=${
          process.env.Login_Validation
        }&${queryParams.toString()}`;
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
        apiUrl = `${zoho_api_uri}Email_Verification?publickey=${
          process.env.Email_Verification
        }&&${queryParams.toString()}`;
        method = "GET";
        break;
      case "room_list":
        apiUrl = `${zoho_api_uri}Rooms_List?publickey=${
          process.env.Rooms_List
        }&${queryParams.toString()}`;
        method = "GET";
        break;
      case "profile_details":
        if (!queryParams.has("token") || !queryParams.has("email")) {
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
        apiUrl = `${zoho_api_uri}Profile_Details?publickey=${
          process.env.Profile_Details
        }&${queryParams.toString()}`;
        method = "GET";
        break;
      case "edit_profile_details":
        if (!queryParams.has("token") || !queryParams.has("email")) {
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
        apiUrl = `${zoho_api_uri}Edit_Profile?publickey=${
          process.env.Edit_Profile
        }&${queryParams.toString()}`;
        method = "GET";
        break;
      case "booking":
        apiUrl = `${zoho_api_uri}Reservation?publickey=${
          process.env.Reservation
        }&${queryParams.toString()}`;
        method = "GET";
        break;
      case "booking_history":
        apiUrl = `${zoho_api_uri}Reservation_Histrory?publickey=${
          process.env.Reservation_Histrory
        }&${queryParams.toString()}`;
        method = "GET";
        break;
      case "get_payment_response":
        const body = await req.text();
        const formData = new URLSearchParams(body);

        const msg = formData.get("msg");

        output_msg = msg;

        if (msg == null || msg == "" || msg == undefined) {
          return new Response(
            JSON.stringify({ error: "Missing required parameters for msg" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const msgres = msg.split("|");
        const booking_id = msgres[1];

        const updatePaymentUrl = `${zoho_api_uri}Update_Payment_Status?publickey=${
          process.env.Update_Payment_Status
        }&booking_id=${booking_id}&transaction_id=${
          msgres[2]
        }&transaction_date=${msgres[13]}&transaction_amt=${msgres[4]}&status=${
          msgres[24].split("-")[1]
        }`;

        // First API call
        const updatePaymentResponse = await fetch(updatePaymentUrl, {
          method: "GET",
        });
        if (!updatePaymentResponse.ok) {
          return new Response(
            JSON.stringify({ error: "Failed to update payment status" }),
            {
              status: updatePaymentResponse.status,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Second API call
        const insertLogUrl = `${zoho_api_uri}InsertLog?publickey=w9Sz5javdSMfJzgMAJs579Vy8&booking_id=${booking_id}&username=user&type=response&msg=${msg.replace(
          /\|/g,
          "dollar"
        )}`;

        const insertLogResponse = await fetch(insertLogUrl, { method: "GET" });
        if (!insertLogResponse.ok) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
            },
          });
        }

        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
          },
        });

        break;
      case "booking_detail":
        apiUrl = `${zoho_api_uri}Reservation_Detail?publickey=${
          process.env.Reservation_Detail
        }&${queryParams.toString()}`;
        method = "GET";
        break;
      case "logs":
        if (
          !queryParams.has("booking_id") ||
          !queryParams.has("username") ||
          !queryParams.has("type") ||
          !queryParams.has("msg")
        ) {
          return new Response(
            JSON.stringify({ error: "Missing required parameters for logs" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        apiUrl = `${zoho_api_uri}InsertLog?publickey=w9Sz5javdSMfJzgMAJs579Vy8&booking_id=${queryParams
          .get("booking_id")
          .toString()}&username=${queryParams
          .get("username")
          .toString()}&type=${queryParams
          .get("type")
          .toString()}&msg=${queryParams.get("msg").toString()}`;
        method = "GET";

        break;

      case "reset_password":
        if (!queryParams.has("email_id")) {
          return new Response(
            JSON.stringify({ error: "Missing required parameters for logs" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        apiUrl = `${zoho_api_uri}sendResetPasswordLink?publickey=FUtMQGpTzkWAC5qSJvytFRyJj&email_id=${queryParams.get(
          "email_id"
        )}`;
        method = "GET";
        break;
      case "update_password":
        if (
          !queryParams.has("userid") ||
          !queryParams.has("token") ||
          !queryParams.has("password")
        ) {
          return new Response(
            JSON.stringify({ error: "Missing required parameters for logs" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        apiUrl = `${zoho_api_uri}updatePassword?publickey=4ePXe7sFTYuwK4xEXrUaENMZh&userid=${queryParams.get(
          "userid"
        )}&token=${queryParams.get("token")}&password=${queryParams.get(
          "password"
        )}`;
        method = "GET";
        break;

      case "cancel_init":
        const bodyText = await req.text();
        let bodyParams;

        try {
          bodyParams = JSON.parse(bodyText);
        } catch (error) {
          return new Response(
            JSON.stringify({ error: "Invalid JSON in request body" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const { email, token, booking_id1, cancel_reason, more_details } = bodyParams;

        // Log parameters for debugging
        
        // const email = bodyParams.get("email");
        // const token = bodyParams.get("token");
        // const booking_id1 = bodyParams.get("booking_id");
        // const cancel_reason = bodyParams.get("cancel_reason");
        // const more_details = bodyParams.get("more_details");
        console.log("Cancel Init Parameters:", { email, token, booking_id1, cancel_reason, more_details });

        if (!email || !token || !booking_id1 || !cancel_reason) {
          return new Response(
            JSON.stringify({ error: "Missing required parameters for cancel_init" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Log parameters for debugging

        apiUrl = `${zoho_api_uri}cancelBooking?email=${email}&token=${token}&booking_id=${booking_id1}&cancel_reason=${cancel_reason}&more_details=${more_details}&publickey=M8mGGeNM6TzRB01ss3qqBN0G2`;
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
    if (apiType == "get_payment_response") {
      if (data.code == 3000 && data.result.status == "success") {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
          },
        });
      } else {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
          },
        });
      }
    } else if(apiType == "cancel_init") {
      if (data.code == 3000 && data.result.status == "success") {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0'); // 24-hour format
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      const MerchantId = 'VANAVIHARI';
      const CurrencyType = 'INR';
      const SecurityId = 'vanavihari';
      const secretKey = 'rmvlozE7R4v9';
      // const amount = '10.00';
      // const rU = this.api_url + '?api_type=get_payment_response';
      const inputDateString = "15-06-2024 13:48:28";

      // Parse the input date string
      const [datePart, timePart] = data.result.transaction_date.split(' ');
      const [transactionday, transactionmonth, transactionyear] = datePart.split('-');

      const str = '0400'+
      '|'+
      MerchantId+
      '|'+
      data.result.reference_id+
      '|'+
      `${transactionyear}${transactionmonth}${transactionday}`+
      '|'+
      data.result.customer_id+
      '|'+
      data.result.total_paid_amount+
      '|'+
      data.result.refundable_amt+
      '|'+
      `${year}${month}${day}${hours}${minutes}${seconds}`+
      '|'+
      '12121212'+
      '|'+
      'NA|NA|NA';
      console.log(str);
      // const hmac = HmacSHA256(str, secretKey);
      const hmac = createHmac('sha256', secretKey).update(str).digest('base64');
      const checksum = hmac.toString().toUpperCase();
      const msg = `${str}|${checksum}`;
      console.log(msg);


        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
          },
        });
      } else {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://vanavihari.com/#/booking-status?booking_id=${booking_id}`,
          },
        });
      }
      
      
      // const endpoint = 'https://www.billdesk.com/pgidsk/PGIRefundController';
      //   const payload = {
      //     msg: "0400|VANAVIHARI|ZHD52057153986|20240609|BK986239234|12.00|12.00|20240609163305|12121212|NA|NA|NA|8415C3131B7023D71FA509E49C2906490568CED346D4FDDC5688AB69B959EB95"
      //   };
      // const apiResponse = await fetch(endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // const apiResponseData = await apiResponse.json();
      // console.log(apiResponseData);
      // return new Response(JSON.stringify({
      //   message: 'Data forwarded successfully',
      //   apiResponse: apiResponseData
      // }), {
      //   headers: { 'Content-Type': 'application/json' }
      // });
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
