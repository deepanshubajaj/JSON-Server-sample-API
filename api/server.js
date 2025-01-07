let dataStore = {
    users: [],
    cafes: [],
};

// Main handler
export default function handler(req, res) {
    const { url } = req;
    const path = url.split("?")[0]; // Extract the path without query params
    const endpoint = path.replace(/^\/api/, ""); // Remove /api prefix

    if (endpoint === "/users") {
        handleEntity(req, res, "users");
    } else if (endpoint === "/cafes") {
        handleEntity(req, res, "cafes");
    } else {
        res.status(404).json({ error: "Endpoint not found" });
    }
}

// Generic entity handler
function handleEntity(req, res, entity) {
    const { method } = req;

    switch (method) {
        case "GET":
            res.status(200).json({ [entity]: dataStore[entity] });
            break;
        case "POST":
            handlePost(req, res, entity);
            break;
        case "PUT":
            handlePut(req, res, entity);
            break;
        case "DELETE":
            handleDelete(req, res, entity);
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

// Handle POST requests
function handlePost(req, res, entity) {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ error: "Data is required" });
    }
    const newItem = { id: generateId(), ...data }; // Add unique ID
    dataStore[entity].push(newItem);
    res.status(201).json({ message: `${entity.slice(0, -1)} added`, item: newItem });
}

// Handle PUT requests
function handlePut(req, res, entity) {
    const { id, ...updatedData } = req.body;
    if (!id || Object.keys(updatedData).length === 0) {
        return res.status(400).json({ error: "ID and data are required" });
    }
    const itemIndex = dataStore[entity].findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: `${entity.slice(0, -1)} not found` });
    }
    dataStore[entity][itemIndex] = { ...dataStore[entity][itemIndex], ...updatedData };
    res.status(200).json({ message: `${entity.slice(0, -1)} updated`, item: dataStore[entity][itemIndex] });
}

// Handle DELETE requests
function handleDelete(req, res, entity) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }
    const itemIndex = dataStore[entity].findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: `${entity.slice(0, -1)} not found` });
    }
    const deletedItem = dataStore[entity].splice(itemIndex, 1);
    res.status(200).json({ message: `${entity.slice(0, -1)} deleted`, item: deletedItem });
}

// Utility to generate unique IDs
function generateId() {
    return Math.random().toString(36).substr(2, 4); // Generate a short random ID
}
