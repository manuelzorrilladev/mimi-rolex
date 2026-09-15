const { where, literal, QueryTypes } = require("sequelize");
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

exports.healthTest = (req, res) => {
    res.json({ success: true, message: "API Metrics is working" })
    return
}

// exports.ingest = async (req, res) => {
//     try {


//         const uaString = req.headers['user-agent'] || '';

//         const { browser, os, device } = parseUA(uaString);

//         const {
//             visitorToken, sessionToken, path, title, referrer,
//             utm_source, utm_medium, utm_campaign, gclid, country, city
//         } = req.body;

//         const isGoogleAds = !!gclid;
//         const finalSource = utm_source || (isGoogleAds ? 'google' : 'direct');
//         const finalMedium = utm_medium || (isGoogleAds ? 'cpc' : 'none');

//         const [visitor] = await Visitor.findOrCreate({
//             where: { visitor_token: visitorToken },
//             defaults: {
//                 first_referrer: referrer,
//                 first_utm_source: finalSource,
//                 first_utm_medium: finalMedium,
//                 first_utm_campaign: utm_campaign,
//                 first_browser: browser,
//                 first_os: os,
//                 first_device: device
//             }
//         });



//         const [visit] = await Visit.findOrCreate({
//             where: { session_token: sessionToken },
//             defaults: {
//                 visitor_id: visitor.id,
//                 referrer: referrer,
//                 utm_source: finalSource,
//                 utm_medium: finalMedium,
//                 utm_campaign: utm_campaign,
//                 gclid: gclid,
//                 is_paid: finalMedium === 'cpc' || isGoogleAds,
//                 entry_path: path,
//                 city: city,
//                 country: country,
//                 browser: browser,
//                 os: os,
//                 device_type: device

//             }
//         });

//         await PageView.create({
//             visit_id: visit.id,
//             path,
//             title
//         });

//         res.status(201).json({ success: true });
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.ingest = async (req, res) => {
    try {
        const uaString = req.headers['user-agent'] || ''
        const { browser, os, device } = parseUA(uaString)

        let {
            visitorToken, sessionToken, path, title, referrer,
            utm_source, utm_medium, utm_campaign, gclid, country, city
        } = req.body
        utm_campaign = utm_source == 'ig' && path == '/' ? 'link_in_bio' : utm_campaign

        // 1. OBTENER / CREAR VISITANTE ÚNICO
        // Creamos o buscamos al visitante primero para tener su historial de atribución si ya existe.
        const [visitor, isNewVisitor] = await Visitor.findOrCreate({
            where: { visitor_token: visitorToken },
            defaults: {
                first_referrer: referrer || 'direct',
                first_utm_source: utm_source || 'direct',
                first_utm_medium: utm_medium || 'none',
                first_utm_campaign: utm_campaign || 'none',
                first_browser: browser,
                first_os: os,
                first_device: device
            }
        })

        // 2. RESOLVER ATRIBUCIÓN INTELIGENTE (Fuente y Medio Realista)
        let finalSource = utm_source
        let finalMedium = utm_medium
        const cleanReferrer = (referrer && referrer !== 'none') ? referrer : 'direct'
        const isDeepLink = path && path !== '/' && !path.includes('cart') && !path.includes('checkout')

        // A. Si viene de Google Ads (GCLID)
        if (gclid) {
            finalSource = utm_source || 'google'
            finalMedium = utm_medium || 'cpc'
        }
        // B. Si trae UTMs explícitos
        else if (utm_source && utm_medium) {
            finalSource = utm_source
            finalMedium = utm_medium
        }
        // C. Si no hay UTMs pero el referrer incluye un motor de búsqueda conocido
        else if (cleanReferrer.includes('google.')) {
            finalSource = 'google'
            finalMedium = 'organic'
        } else if (cleanReferrer.includes('bing.')) {
            finalSource = 'bing'
            finalMedium = 'organic'
        } else if (cleanReferrer.includes('facebook.') || cleanReferrer.includes('instagram.')) {
            finalSource = cleanReferrer.includes('facebook.') ? 'facebook' : 'instagram'
            finalMedium = 'social'
        }
        // D. Si es un 'direct' en una URL profunda (Landing de producto/categoría)
        else if (cleanReferrer === 'direct' && isDeepLink) {
            // Es muy probable que provenga de una búsqueda orgánica o enlace oculto por privacidad
            finalSource = 'google_probable'
            finalMedium = 'organic'
        }
        // E. Fallback Last-Touch: Si es un visitante recurrente y entra como 'direct' a la Home
        else if (cleanReferrer === 'direct' && !isNewVisitor && visitor.first_utm_source !== 'direct') {
            finalSource = visitor.first_utm_source
            finalMedium = visitor.first_utm_medium
        }
        // F. Tráfico Directo Verdadero
        else {
            finalSource = 'direct'
            finalMedium = 'none'
        }

        // Limpieza de nulos o valores indefinidos
        finalSource = finalSource || 'direct'
        finalMedium = finalMedium || 'none'
        const finalCampaign = utm_campaign || 'none'

        // Si es un visitante nuevo y logramos inferir una fuente mejor que la inicial, actualizamos su primer toque
        if (isNewVisitor && finalSource !== 'direct' && visitor.first_utm_source === 'direct') {
            await visitor.update({
                first_referrer: cleanReferrer,
                first_utm_source: finalSource,
                first_utm_medium: finalMedium,
                first_utm_campaign: finalCampaign
            })
        }

        // 3. OBTENER / CREAR LA SESIÓN (VISIT)
        const [visit] = await Visit.findOrCreate({
            where: { session_token: sessionToken },
            defaults: {
                visitor_id: visitor.id,
                referrer: cleanReferrer,
                utm_source: finalSource,
                utm_medium: finalMedium,
                utm_campaign: finalCampaign,
                gclid: gclid || null,
                is_paid: !!gclid || finalMedium === 'cpc' || finalMedium === 'ppc' || finalMedium === 'paid',
                entry_path: path,
                city: city || 'none',
                country: country || 'none',
                browser: browser,
                os: os,
                device_type: device
            }
        })

        // 4. REGISTRAR IMPRESIÓN (PAGEVIEW)
        await PageView.create({
            visit_id: visit.id,
            path: path || '/',
            title: title || 'Sin Título'
        })

        res.status(201).json({ success: true })

    } catch (error) {
        console.error("Error en ingest de métricas:", error)
        res.status(500).json({ error: error.message })
    }
}

exports.trackEvent = async (req, res) => {
    try {
        const { sessionToken, eventName, label } = req.body;

        const visit = await Visit.findOne({ where: { session_token: sessionToken } });
        if (!visit) return res.status(404).json({ error: "Sesión no encontrada" });
        await Events.create({
            visit_id: visit.id,
            event_name: eventName,
            label

        });
        return res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getYearlyGeneralStats = async (req, res) => {
    try {
        // 1. Configuración de parámetros para ambas paginaciones
        const year = parseInt(req.query.year) || new Date().getFullYear();
        
        // Paginación para Marketing Report
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const offset = (page - 1) * limit;

        // Paginación para Entry Path Report
        const entryPage = Math.max(1, parseInt(req.query.entryPage) || 1);
        const entryLimit = Math.max(1, parseInt(req.query.entryLimit) || 10);
        const entryOffset = (entryPage - 1) * entryLimit;

        // Criterio de ordenamiento dinámico para SQL
        const sortByParam = req.query.sortBy === 'uniqueVisitors' ? 'uniqueVisitors' : 'totalVisits';
        const orderAttribute = literal(sortByParam);

        const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59Z`);

        const yearlyFilter = {
            createdAt: { [Op.between]: [startOfYear, endOfYear] }
        };

        // 2. Ejecución paralela con delegación de LIMIT, OFFSET y ORDER BY a MySQL
        const [
            marketingStats,
            marketingCount,
            entryPathStats,
            entryPathCount
        ] = await Promise.all([

            // A. Marketing Stats (Paginado directamente en SQL)
            Visit.findAll({
                attributes: [
                    'utm_source',
                    'utm_medium',
                    'utm_campaign',
                    [fn('COUNT', col('id')), 'totalVisits'],
                    [fn('COUNT', fn('DISTINCT', col('visitor_id'))), 'uniqueVisitors']
                ],
                where: yearlyFilter,
                group: ['utm_source', 'utm_medium', 'utm_campaign'],
                order: [[orderAttribute, 'DESC']],
                limit,
                offset,
                raw: true
            }),

            // Total de grupos para la paginación de Marketing Stats
            Visit.findAll({
                attributes: ['utm_source', 'utm_medium', 'utm_campaign'],
                where: yearlyFilter,
                group: ['utm_source', 'utm_medium', 'utm_campaign'],
                raw: true
            }).then(rows => rows.length),

            // B. Entry Path Report (Paginado directamente en SQL)
            Visit.findAll({
                attributes: [
                    'utm_source',
                    'utm_medium',
                    'utm_campaign',
                    'entry_path',
                    [fn('COUNT', col('id')), 'totalVisits'],
                    [fn('COUNT', fn('DISTINCT', col('visitor_id'))), 'uniqueVisitors']
                ],
                where: { ...yearlyFilter, utm_source: { [Op.ne]: 'none' } },
                group: ['utm_source', 'utm_medium', 'utm_campaign', 'entry_path'],
                order: [[orderAttribute, 'DESC']],
                limit: entryLimit,
                offset: entryOffset,
                raw: true
            }),

            // Total de grupos para la paginación de Entry Path
            Visit.findAll({
                attributes: ['utm_source', 'utm_medium', 'utm_campaign', 'entry_path'],
                where: { ...yearlyFilter, utm_source: { [Op.ne]: 'none' } },
                group: ['utm_source', 'utm_medium', 'utm_campaign', 'entry_path'],
                raw: true
            }).then(rows => rows.length)
        ]);

        // 3. Formateo de tipos
        const formattedMarketingReport = marketingStats.map(item => ({
            utm_source: item.utm_source || 'none',
            utm_medium: item.utm_medium || 'none',
            utm_campaign: item.utm_campaign || 'none',
            totalVisits: parseInt(item.totalVisits) || 0,
            uniqueVisitors: parseInt(item.uniqueVisitors) || 0
        }));

        const formattedEntryPathReport = entryPathStats.map(item => ({
            utm_source: item.utm_source || 'none',
            utm_medium: item.utm_medium || 'none',
            utm_campaign: item.utm_campaign || 'none',
            entry_path: item.entry_path || 'none',
            totalVisits: parseInt(item.totalVisits) || 0,
            uniqueVisitors: parseInt(item.uniqueVisitors) || 0
        }));

        // 4. Respuesta con metadatos de paginación independientes
        res.json({
            success: true,
            queriedYear: year,
            marketingReport: {
                data: formattedMarketingReport,
                pagination: {
                    totalItems: marketingCount,
                    totalPages: Math.ceil(marketingCount / limit),
                    currentPage: page,
                    itemsPerPage: limit
                }
            },
            entryPathReport: {
                data: formattedEntryPathReport,
                pagination: {
                    totalItems: entryPathCount,
                    totalPages: Math.ceil(entryPathCount / entryLimit),
                    currentPage: entryPage,
                    itemsPerPage: entryLimit
                }
            }
        });

    } catch (error) {
        console.error("Yearly Stats Error:", error);
        res.status(500).json({
            error: "Error interno al procesar estadísticas anuales",
            detail: error.message
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Obtención de año y mes (esperados del 1 al 12)
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const reqMonth = req.query.month ? parseInt(req.query.month) : (new Date().getMonth() + 1);
        const month = Math.max(1, Math.min(12, reqMonth));

        const pad = (num) => String(num).padStart(2, '0');

        // 2. Construcción Unificada de Rangos en Formato Texto SQL
        const firstDayStr = `${year}-${pad(month)}-01 00:00:00`;
        const lastDayNumber = new Date(year, month, 0).getDate();
        const lastDayStr = `${year}-${pad(month)}-${pad(lastDayNumber)} 23:59:59`;

        const startOfYearStr = `${year}-01-01 00:00:00`;
        const endOfYearStr = `${year}-12-31 23:59:59`;

        // Filtros limpios mediante >= y <= (Garantiza match exacto en SQL)
        const monthlyFilter = {
            createdAt: {
                [Op.gte]: firstDayStr,
                [Op.lte]: lastDayStr
            }
        };

        const yearlyFilter = {
            createdAt: {
                [Op.gte]: startOfYearStr,
                [Op.lte]: endOfYearStr
            }
        };





        // 3. Ejecución Paralela de Consultas
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

            // Resumen Mensual (SOLO USA monthlyFilter)
            Visit.sequelize.query(`
  SELECT 
    COUNT(DISTINCT visitor_id) AS uniqueVisitors,
    CAST(COALESCE(SUM(CASE WHEN is_paid = 1 THEN 1 ELSE 0 END), 0) AS SIGNED) AS paid,
    CAST(COALESCE(SUM(CASE WHEN is_paid = 0 OR is_paid IS NULL THEN 1 ELSE 0 END), 0) AS SIGNED) AS organic
  FROM visits
  WHERE createdAt >= :firstDay AND createdAt <= :lastDay
`, {
                replacements: { firstDay: firstDayStr, lastDay: lastDayStr },
                type: QueryTypes.SELECT
            }).then(res => res[0]),// Devuelve el primer objeto { uniqueVisitors, paid, organic },

            PageView.count({ where: monthlyFilter }),

            // Visitas Mensuales Anuales
            Visit.findAll({
                attributes: [
                    [fn('MONTH', col('createdAt')), 'month'],
                    [literal('CAST(COALESCE(SUM(CASE WHEN is_paid = 1 THEN 1 ELSE 0 END), 0) AS SIGNED)'), 'paidVisits'],
                    [literal('CAST(COALESCE(SUM(CASE WHEN is_paid = 0 OR is_paid IS NULL THEN 1 ELSE 0 END), 0) AS SIGNED)'), 'organicVisits']
                ],
                where: yearlyFilter,
                group: [fn('MONTH', col('createdAt'))],
                order: [[fn('MONTH', col('createdAt')), 'ASC']],
                raw: true
            }),

            // Tops (Ciudades)
            Visit.findAll({
                attributes: ['city', 'country', [fn('COUNT', col('id')), 'count']],
                where: { ...monthlyFilter, city: { [Op.notIn]: ['', 'Desconocido', 'none'] } },
                group: ['city', 'country'],
                order: [[literal('count'), 'DESC']],
                limit: 5, raw: true
            }),

            // Tops (Páginas)
            PageView.findAll({
                attributes: ['path', 'title', [literal('CAST(COUNT(id) AS UNSIGNED)'), 'viewCount']],
                where: monthlyFilter,
                group: ['path', 'title'],
                order: [[literal('viewCount'), 'DESC']],
                limit: 5, raw: true
            }),

            // Distribución Dispositivos/Navegadores/OS
            Visit.findAll({ attributes: ['device_type', [fn('COUNT', col('id')), 'count']], where: monthlyFilter, group: ['device_type'], raw: true }),
            Visit.findAll({ attributes: ['browser', [fn('COUNT', col('id')), 'count']], where: monthlyFilter, group: ['browser'], raw: true }),
            Visit.findAll({ attributes: ['os', [fn('COUNT', col('id')), 'count']], where: monthlyFilter, group: ['os'], raw: true }),

            // Campañas
            Visitor.findAll({
                attributes: ['first_utm_campaign', [fn('COUNT', col('id')), 'count']],
                where: { ...yearlyFilter, first_utm_campaign: { [Op.notIn]: ['none', '', 'direct'] } },
                group: ['first_utm_campaign'], raw: true
            }),
            Visit.findAll({
                attributes: ['utm_campaign', [fn('COUNT', col('id')), 'count']],
                where: { ...yearlyFilter, utm_campaign: { [Op.notIn]: ['none', '', 'direct'] } },
                group: ['utm_campaign'], raw: true
            }),

            // Fuentes
            Visit.findAll({
                attributes: ['utm_source', [fn('COUNT', col('id')), 'count']],
                where: monthlyFilter,
                group: ['utm_source'], order: [[literal('count'), 'DESC']], raw: true
            })
        ]);

        // 4. Procesamiento de Campañas (Merge)
        const mergedMap = new Map();
        campaingVisitors.forEach(v => {
            mergedMap.set(v.first_utm_campaign, { campaign: v.first_utm_campaign, visitors: parseInt(v.count) || 0, visits: 0 });
        });
        campaingVisits.forEach(v => {
            const entry = mergedMap.get(v.utm_campaign) || { campaign: v.utm_campaign, visitors: 0, visits: 0 };
            entry.visits = parseInt(v.count) || 0;
            mergedMap.set(v.utm_campaign, entry);
        });

        // 5. Respuesta Final
        res.json({
            summary: {
                totalUniqueVisitors: parseInt(monthlySummary?.uniqueVisitors) || 0,
                totalPageViews: totalPageViews || 0,
                paidVisits: parseInt(monthlySummary?.paid) || 0,
                organicVisits: parseInt(monthlySummary?.organic) || 0
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
            queriedMonth: month // Retornamos el mes exacto (1-12)
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: "Error interno", detail: error.message });
    }
};

exports.getEventStats = async (req, res) => {
    try {
        // Manejo de mes: si req.query.month viene de 1 a 12, restamos 1 para el Date de JS
        const monthQuery = parseInt(req.query.month);
        const targetMonth = !isNaN(monthQuery) ? monthQuery - 1 : new Date().getMonth();
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const startMonth = new Date(year, targetMonth, 1);
        const endMonth = new Date(year, targetMonth + 1, 1);

        const eventStats = await Events.findAll({
            attributes: [
                'event_name',
                [fn('COUNT', col('id')), 'total']
            ],
            where: {
                createdAt: {
                    [Op.gte]: startMonth,
                    [Op.lt]: endMonth
                }
            },
            group: ['event_name'],
            order: [[fn('COUNT', col('id')), 'DESC']],
            raw: true
        });

        res.json({ 
            month: targetMonth + 1, 
            year, 
            totalEvents: eventStats.reduce((acc, curr) => acc + parseInt(curr.total), 0),
            events: eventStats 
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: "Error interno", detail: error.message });
    }
};


