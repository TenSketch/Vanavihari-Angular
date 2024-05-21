export default async (req) => {
    const billdeskkey = process.env.Billdesk_SecretKey;
  
    if (!billdeskkey) {
      return new Response(JSON.stringify({ error: 'Environment variable not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    return new Response(JSON.stringify({ billdeskkey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  
  export const config = {
    path: '/api/get-env', // Adjust this path if needed
  };
  