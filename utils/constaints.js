const SCHEMA_OPTION = {
    versionKey: false,
    minimize: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
};

const THRESHOLD_BETWEEN_EXAMS = (1000 * 60 * 60) * 1.5; // 1.5 is a 1h30p

const ignoreModel = function (ignoreKeys = [], isDeleteIgnore = true) {
    const ignore = { is_delete: +!isDeleteIgnore };
    for (const key of ignoreKeys) ignore[key] = 0;
    return ignore;
}
const makeQuery = (query = {}, is_delete = false) => {
    query.is_delete = is_delete;
    return query;
};

const checkInvalidID = (id) => id.length != 24;

function type2Mongo(type) {
    switch (type) {
        case "=":
            return "$eq";
        case ">":
            return "$gt";
        case "<":
            return "$lt";
        case ">=":
            return "$gte";
        case "<=":
            return "$lte";
    }
}


/**
 * Filter Tabulator to Query use to $match
 * @param {Array} filters is a filters array in format of Tabulator
 * @param {Object} mapping object contain fields type or mapping to field model
 * @return {Object} $match query Object
 */
function filter2Query(filters, mapping = {}) {

    if (!filters.length) return {};

    const results = {};

    const fields = [...new Set(filters.map(e => e.field))];

    for (const field of fields) {
        const values = filters.filter(e => e.field == field);

        if (mapping[field]) {
            if (mapping[field] instanceof Object) {
                const $or = mapping[field].mapping.map(e => {
                    return { [e]: values2MongoQuery(values, mapping[field].type) };
                });
                results.$or = $or;
            }
            // else if()
        } else {
            const value = values2MongoQuery(values);
            if (Object.keys(value).length)
                results[field] = value;
        }
    }
    return results;
}

function values2MongoQuery(values, valueType = "string") {
    let rValue = {};
    if (values instanceof Array) {
        for (const data of values) {
            const type = type2Mongo(data.type);
            let value = data.value;

            if (/ALL/i.test(value)) continue;

            if (!isNaN(+value))
                value = +value;

            if (valueType == "date") {
                value = new Date(value);
            }

            if (/true|false/i.test(value)) {
                value = JSON.parse(value.toLowerCase());
            }

            rValue[type] = value;
        }
    }
    return rValue;
}

module.exports = {
    THRESHOLD_BETWEEN_EXAMS,
    SCHEMA_OPTION,
    ignoreModel,
    makeQuery,
    checkInvalidID,
    filter2Query
};
