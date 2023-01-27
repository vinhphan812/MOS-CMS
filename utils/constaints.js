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

module.exports = {
    THRESHOLD_BETWEEN_EXAMS,
    SCHEMA_OPTION,
    ignoreModel,
    makeQuery,
    checkInvalidID,
};
