export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");

        if (!lat || !lng) {
            return Response.json({ error: "Missing coordinates" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_MAPS_KEY;

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        // const address =
        //     data?.results?.[0]?.formatted_address ||
        //     "Unknown location";

        const result = data?.results?.[0];
        const components = result?.address_components || [];

        const get = (type) =>
            components.find((c) => c.types.includes(type))?.long_name;

        // layers
        const premise = get("premise"); // optional building/complex
        const sublocality1 = get("sublocality_level_1"); // Shastri Nagar
        const sublocality2 = get("sublocality_level_2"); // fallback
        const locality = get("locality"); // Bhubaneswar
        const district = get("administrative_area_level_2"); // optional
        const state = get("administrative_area_level_1");

        // FINAL SMART ADDRESS
        const address = [
            premise,
            sublocality1 || sublocality2,
            locality,
            state
        ]
            .filter(Boolean)
            .join(", ");



        return Response.json({
            success: true,
            address,
            raw: data
        });

    } catch (err) {
        return Response.json(
            { error: err.message },
            { status: 500 }
        );
    }
}