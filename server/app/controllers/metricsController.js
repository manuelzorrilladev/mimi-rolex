const { where } = require("sequelize");
const db = require("../models");
const User = db.user.User;
const Role = db.user.Role
const Op = db.Sequelize.Op;
const Visitor = db.metrics.Visitor
const Visit = db.metrics.Visit
const PageView = db.metrics.PageView

async function isAdmin(user) {
    if (user.roles[0] != "ROLE_ADMIN") {
        return false
    }
    const userQuery = await User.findByPk(user.id, {
        include: Role,
        attributes: { exclude: ['password'] }
    })
    if (userQuery.roles[0].name !== "ROLE_ADMIN") {
        return false
    }

    return true
}


const parseUA = (ua) => {
    let browser = "Otro";
    let os = "Desconocido";
    let device = "Desktop";

    // 1. Detectar Navegador
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
    else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";

    // 2. Detectar Sistema Operativo
    if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
    else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
    else if (ua.includes("Mac OS X")) os = "Mac OS";
    else if (ua.includes("Linux")) os = "Linux";

    // 3. Detectar Tipo de Dispositivo
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        device = "Móvil";
    }

    return { browser, os, device };
};



exports.ingest = async (req, res) => {
    try {


        const uaString = req.headers['user-agent'] || '';

        // Usamos nuestra función manual
        const { browser, os, device } = parseUA(uaString);


        const {
            visitorToken, sessionToken, path, title, referrer,
            utm_source, utm_medium, utm_campaign, utm_content, gclid, country, city
        } = req.body;


        const [visitor] = await Visitor.findOrCreate({
            where: { visitor_token: visitorToken },
            defaults: {
                first_referrer: referrer,
                first_utm_source: utm_source || 'direct',
                first_utm_medium: utm_medium || 'none',
                first_utm_campaign: utm_campaign,
                first_browser: browser,
                first_os: os,
                first_device: device
            }
        });

        const [visit] = await Visit.findOrCreate({
            where: { session_token: sessionToken },
            defaults: {
                visitor_id: visitor.id,
                referrer,
                utm_source: utm_source || 'direct',
                utm_medium: utm_medium || 'none',
                utm_campaign,
                gclid,
                is_paid: !!gclid || utm_medium === 'cpc',
                entry_path: path,
                city: city,
                country: country,
                browser: browser,
                os: os,
                device_type: device

            }
        });

        await PageView.create({
            visit_id: visit.id,
            path,
            title
        });

        res.status(201).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.trackEvent = async (req, res) => {
    try {
        const { sessionToken, eventName, label } = req.body;

        const visit = await Visit.findOne({ where: { session_token: sessionToken } });
        if (!visit) return res.status(404).json({ error: "Sesión no encontrada" });

        await MetricEvent.create({
            visit_id: visit.id,
            event_name: eventName,
            label

        });

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


