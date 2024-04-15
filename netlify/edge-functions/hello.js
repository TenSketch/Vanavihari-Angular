export default async (req) => {
    try {
        console.log('test');
        return new Response(JSON.stringify({'status':'success'}), {
            headers: { "Content-Type": "application/json" },
          });
    }
    catch
    {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
}

export const config = { path: "/test" };