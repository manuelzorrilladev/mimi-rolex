module.exports = (sequelize, Sequelize) => {

    const Visitor = sequelize.define('Visitor', {
        id: {
            type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true
        },
        visitor_token: {
            type: Sequelize.STRING, unique: true, allowNull: false
        },
        first_referrer: {
            type: Sequelize.TEXT
        },
        first_utm_source: {
            type: Sequelize.STRING
        }, // ej: 'facebook'
        first_utm_medium: {
            type: Sequelize.STRING
        }, // ej: 'social'
        first_utm_campaign: {
            type: Sequelize.STRING
        }, // ej: 'promo_navidad'
        user_agent: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: true,
        updatedAt: false
    });


    const Visit = sequelize.define('Visit', {
        id: {
            type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
        },
        visitor_id: {
            type: Sequelize.UUID, references: {
                model: 'Visitors', key: 'id'
            }
        },
        session_token: {
            type: Sequelize.STRING, allowNull: false
        },

        referrer: {
            type: Sequelize.TEXT
        }, // URL de procedencia
        utm_source: {
            type: Sequelize.STRING
        }, // google, instagram, facebook
        utm_medium: {
            type: Sequelize.STRING
        }, // cpc (Ads), social, organic
        utm_campaign: {
            type: Sequelize.STRING
        },
        gclid: {
            type: Sequelize.STRING
        }, // ID de Google Ads

        is_paid: {
            type: Sequelize.BOOLEAN, defaultValue: false
        }, // true si hay gclid o cpc
        ip_address: {
            type: Sequelize.STRING(45)
        },
        entry_path: {
            type: Sequelize.STRING
        } // Primera página que vió hoy

    }, { timestamps: true, updatedAt: false });

    const PageView = sequelize.define('PageView', {
        id: {
            type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
        },
        visit_id: {
            type: Sequelize.INTEGER, references: {
                model: 'Visits', key: 'id'
            }
        },
        path: {
            type: Sequelize.STRING, allowNull: false
        }, // ej: /anillos-de-oro
        title: {
            type: Sequelize.STRING
        } // Título de la joya o página

    }, { timestamps: true, updatedAt: false });

    const MetricEvent = sequelize.define('MetricEvent', {
        id: {
            type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
        },
        visit_id: {
            type: Sequelize.INTEGER, references: {
                model: 'Visits', key: 'id'
            }
        },
        event_name: {
            type: Sequelize.STRING, allowNull: false
        }, // ej: 'click_whatsapp'
        label: {
            type: Sequelize.STRING
        }, // ej: 'Boton Flotante'

    }, { timestamps: true, updatedAt: false });



    return {
        Visitor,
        Visit,
        PageView,
        MetricEvent
    }

}

