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

        const {
          email,
          token,
          cancel_reason,
          more_details,
          Payment_Transaction_Id,
          Payment_Transaction_Date,
          booking_id1,
          Payment_Transaction_Amt,
          refundableAmount,
          formattedDateTimeStr,
          uniqueKey,
          refund_percent
        } = bodyParams;

       const MerchantId = process.env.Billdesk_MerchantId
       const secretKey = process.env.Billdesk_SecretKey

        if (!email || !token || !booking_id1 || !cancel_reason) {
          return new Response(
            JSON.stringify({
              error: "Missing required parameters for cancel_init",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        let str = '0400|' + MerchantId + '|' + Payment_Transaction_Id + '|' + Payment_Transaction_Date + '|' + booking_id1 + '|'+ Payment_Transaction_Amt + '|' + refundableAmount + '|' + formattedDateTimeStr + '|' + uniqueKey + '|NA|NA|NA'
        console.log(str)
        // const signature = createHmac('sha256', secretKey).update(str).digest('base64');
        const signature = createHmac('sha256', secretKey).update(str).digest('hex').toUpperCase();

        const msg1 = str + "|" + signature;
        console.log("msg:",msg1)
        // Log parameters for debugging

        apiUrl = `${zoho_api_uri}cancelBooking?email=${email}&token=${token}&booking_id=${booking_id1}&cancel_reason=${cancel_reason}&more_details=${more_details}&msg=${msg1.replace(
          /\|/g,
          "dollar"
        )}&publickey=M8mGGeNM6TzRB01ss3qqBN0G2`;
        method = "GET";
        break;

        case "manual_cancel_init":
        const bodyText1 = await req.text();
        let bodyParams1;

        try {
          bodyParams1 = JSON.parse(bodyText1);
        } catch (error) {
          return new Response(
            JSON.stringify({ error: "Invalid JSON in request body" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const {
          email1,
          token1,
          cancel_reason1,
          more_details1,
          Payment_Transaction_Id1,
          Payment_Transaction_Date1,
          booking_id11,
          Payment_Transaction_Amt1,
          refundableAmount1,
          formattedDateTimeStr1,
          uniqueKey1,
          refund_percent1
        } = bodyParams1;

       const MerchantId1 = process.env.Billdesk_MerchantId
       const secretKey1 = process.env.Billdesk_SecretKey

        if (!email1 || !token1 || !booking_id11 || !cancel_reason1) {
          return new Response(
            JSON.stringify({
              error: "Missing required parameters for cancel_init",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        let str1 = '0400|' + MerchantId1 + '|' + Payment_Transaction_Id1 + '|' + Payment_Transaction_Date1 + '|' + booking_id11 + '|'+ Payment_Transaction_Amt1 + '|' + refundableAmount1 + '|' + formattedDateTimeStr1 + '|' + uniqueKey1 + '|NA|NA|NA'
        console.log(str1)
        // const signature = createHmac('sha256', secretKey).update(str).digest('base64');
        const signature1 = createHmac('sha256', secretKey1).update(str).digest('hex').toUpperCase();

        const msg11 = str1 + "|" + signature1;
        console.log("msg:",msg11)
        // Log parameters for debugging

       apiUrl = `https://www.zohoapis.com/creator/custom/vanavihari/Manual_Cancel_Request?publickey=m4fggT5aYz4BVOdzYUY7BR4jV&msg=${msg11.replace(
        /\|/g,
        "dollar"
      )}`
       
        // apiUrl = `${zoho_api_uri}cancelBooking?email=${email}&token=${token}&booking_id=${booking_id1}&cancel_reason=${cancel_reason}&more_details=${more_details}&msg=${msg11.replace(
        //   /\|/g,
        //   "dollar"
        // )}&publickey=M8mGGeNM6TzRB01ss3qqBN0G2`;
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
    }  else {
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
