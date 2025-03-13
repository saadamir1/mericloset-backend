const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/brands(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    try {
        console.log("========================================");
        console.log("🚀 Checking JWT Revocation...");
        console.log("🔹 Incoming Request:", req.method, req.originalUrl);
        console.log("🔹 JWT Payload:", JSON.stringify(payload, null, 2));

        // Ensure payload exists and has a role
        if (!payload) {
            console.log("❌ No payload found. Revoking access.");
            return done(null, true);
        }

        if (!payload.payload || !payload.payload.role) {
            console.log("❌ No role found in payload. Revoking access.");
            return done(null, true);
        }

        console.log("✅ Role found in payload:", payload.payload.role);

        // Allow access for "user" and "brand"
        if (payload.payload.role === "user" || payload.payload.role === "brand") {
            console.log("✅ Access granted for role:", payload.payload.role);
            return done(null, false);
        }

        console.log("❌ Unknown role detected. Revoking access.");
        return done(null, true);
    } catch (error) {
        console.error("🔥 Error in isRevoked:", error);
        return done(null, true);
    } finally {
        console.log("========================================");
    }
}


module.exports = authJwt;
