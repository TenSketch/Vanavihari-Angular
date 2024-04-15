export default async (req) => {
    try {
        console.log('test');
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