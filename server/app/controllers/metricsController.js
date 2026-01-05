const { where, literal } = require("sequelize");
const db = require("../models");
const User = db.user.User;
const Role = db.user.Role
const Op = db.Sequelize.Op;
const fn = db.Sequelize.fn;
const col = db.Sequelize.col;
const Visitor = db.metrics.Visitor
const Visit = db.metrics.Visit
const PageView = db.metrics.PageView
const Events = db.metrics.MetricEvent



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


exports.ingest = async (req, res) => {
    try {


        const uaString = req.headers['user-agent'] || '';

        const { browser, os, device } = parseUA(uaString);

        const {
            visitorToken, sessionToken, path, title, referrer,
            utm_source, utm_medium, utm_campaign, gclid, country, city
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
                referrer: referrer,
                utm_source: utm_source || 'direct',
                utm_medium: utm_medium || 'none',
                utm_campaign,
                gclid,
                is_paid: utm_medium === 'cpc',
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


exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Configuración de Fechas
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const targetMonth = parseInt(req.query.month) || new Date().getMonth();

        const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59Z`);
        const startMonth = new Date(year, targetMonth, 1);
        const endMonth = new Date(year, targetMonth + 1, 1);

        const monthlyFilter = { createdAt: { [Op.gte]: startMonth, [Op.lt]: endMonth } };
        const yearlyFilter = { createdAt: { [Op.between]: [startOfYear, endOfYear] } };

        // 2. Ejecución Concurrente de Consultas
        const [
            monthlySummary,
            totalPageViews,
            visitsByMonthRAW,
            topCities,
            topPages,
            topDevices,
            topBrowsers,
            topOS,
            campaingVisitors,
            campaingVisits,
            sources
        ] = await Promise.all([
            Visit.findOne({
                attributes: [
                    [fn('COUNT', fn('DISTINCT', col('visitor_id'))), 'uniqueVisitors'],
                    [fn('SUM', literal('CASE WHEN is_paid = 1 THEN 1 ELSE 0 END')), 'paid'],
                    [fn('SUM', literal('CASE WHEN is_paid = 0 THEN 1 ELSE 0 END')), 'organic']
                ],
                where: monthlyFilter,
                raw: true
            }),

            PageView.count({ where: monthlyFilter }),

            Visit.findAll({
                attributes: [
                    [fn('MONTH', col('createdAt')), 'month'],
                    [fn('SUM', literal('CAST(CASE WHEN is_paid = 1 THEN 1 ELSE 0 END AS SIGNED)')), 'paidVisits'],
                    [fn('SUM', literal('CAST(CASE WHEN is_paid = 0 THEN 1 ELSE 0 END AS SIGNED)')), 'organicVisits']
                ],
                where: yearlyFilter,
                group: [fn('MONTH', col('createdAt'))],
                order: [[fn('MONTH', col('createdAt')), 'ASC']],
                raw: true
            }),

            // Tops (Ciudades, Páginas, etc.)
            Visit.findAll({
                attributes: ['city', 'country', [fn('COUNT', col('id')), 'count']],
                where: { city: { [Op.notIn]: ['', 'Desconocido'] } },
                group: ['city', 'country'],
                order: [[literal('count'), 'DESC']],
                limit: 5, raw: true
            }),

            PageView.findAll({
                attributes: ['path', 'title', [literal('CAST(COUNT(id) AS UNSIGNED)'), 'viewCount']],
                where: monthlyFilter,
                group: ['path', 'title'],
                order: [[literal('viewCount'), 'DESC']],
                limit: 5, raw: true
            }),

            // Distribución de Dispositivos/Navegadores/OS
            Visit.findAll({
                attributes: ['device_type', [fn('COUNT', col('id')), 'count']],
                where: monthlyFilter, group: ['device_type'], raw: true
            }),
            Visit.findAll({
                attributes: ['browser', [fn('COUNT', col('id')), 'count']],
                where: monthlyFilter, group: ['browser'], raw: true
            }),
            Visit.findAll({
                attributes: ['os', [fn('COUNT', col('id')), 'count']],
                where: monthlyFilter, group: ['os'], raw: true
            }),

            // Campañas (Reporte consolidado después)
            Visitor.findAll({
                attributes: ['first_utm_campaign', [fn('COUNT', col('id')), 'count']],
                where: { ...yearlyFilter, first_utm_campaign: { [Op.ne]: 'none' } },
                group: ['first_utm_campaign'], raw: true
            }),
            Visit.findAll({
                attributes: ['utm_campaign', [fn('COUNT', col('id')), 'count']],
                where: { ...yearlyFilter, utm_campaign: { [Op.ne]: 'none' } },
                group: ['utm_campaign'], raw: true
            }),

            // Fuentes
            Visit.findAll({
                attributes: ['utm_source', [fn('COUNT', col('id')), 'count']],
                group: ['utm_source'], order: [[literal('count'), 'DESC']], raw: true
            })
        ]);

        // 3. Procesamiento de Campañas (Merge)
        const mergedMap = new Map();
        campaingVisitors.forEach(v => {
            mergedMap.set(v.first_utm_campaign, { campaign: v.first_utm_campaign, visitors: parseInt(v.count), visits: 0 });
        });
        campaingVisits.forEach(v => {
            const entry = mergedMap.get(v.utm_campaign) || { campaign: v.utm_campaign, visitors: 0, visits: 0 };
            entry.visits = parseInt(v.count);
            mergedMap.set(v.utm_campaign, entry);
        });

        // 4. Respuesta Final
        res.json({
            summary: {
                totalUniqueVisitors: parseInt(monthlySummary.uniqueVisitors) || 0,
                totalPageViews,
                paidVisits: parseInt(monthlySummary.paid) || 0,
                organicVisits: parseInt(monthlySummary.organic) || 0
            },
            visitsByMonth: visitsByMonthRAW,
            topCities,
            topPages,
            topDevices,
            topBrowsers,
            topOS,
            campaignReport: Array.from(mergedMap.values()),
            sources,
            queriedYear: year,
            queriedMonth: targetMonth
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: "Error interno", detail: error.message });
    }
};


exports.getEventStats = async (req, res) => {
    try {

        const targetMonth = parseInt(req.query.month) || new Date().getMonth();
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const startMonth = new Date(year, targetMonth, 1);
        const endMonth = new Date(year, targetMonth + 1, 1);

        const getEvents = await Events.count({
            distinct: true,
            col: 'event_name',
            where: {
                createdAt: {
                    [Op.gte]: startMonth,
                    [Op.lt]: endMonth
                }
            }
        });


        res.json(getEvents)
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: "Error interno", detail: error.message });
    }
};



