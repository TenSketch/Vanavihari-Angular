export default async (req) => {
  const zoho_api_uri = "https://www.zohoapis.com/creator/custom/vanavihari/";
  try {
    console.log(req.headers);
    console.log(req.Response);
    console.log(req.perm);
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
        apiUrl = `${zoho_api_uri}Reservation_Histrory?publickey=hxxrtQ7g2t93U1QUbSOq4kj59&${queryParams.toString()}`;
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
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
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
