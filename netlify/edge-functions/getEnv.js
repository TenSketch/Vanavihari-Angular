export default async (req) => {
    const billdeskkey = process.env.Billdesk_SecretKey;
    const billdesksecurityid = process.env.Billdesk_SecurityId;
    const billdeskmerchantid = process.env.Billdesk_MerchantId;
  
    if (!billdeskkey || !billdesksecurityid || !billdeskmerchantid) {
      return new Response(JSON.stringify({ error: 'Some environment variables are missing' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    return new Response(JSON.stringify({ billdeskkey, billdesksecurityid, billdeskmerchantid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  
  export const config = {
    path: '/api/get-env', // Adjust this path if needed
  };
  