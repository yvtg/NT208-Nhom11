import database from "../config/database.js";

const searchProject = async (req, res) => {
    try {
        const { q } = req.query || '';

        if (!q.trim()) {
        return res.status(200).json([]);
        }

        // truy van search
        const queryText = `
            SELECT projectid, projectname, uploadeddate, expireddate, budget, ownerid, description, workingtype, workingplace, status, averagerating, field_id
            FROM (
                SELECT *,
                    ts_rank_cd(document_with_weights, plainto_tsquery('simple', unaccent($1))) AS rank,
                    similarity(unaccent(projectname), unaccent($1)) AS sim_name,
                    similarity(unaccent(description), unaccent($1)) AS sim_desc
                FROM projects
                WHERE
                    document_with_weights @@ plainto_tsquery('simple', unaccent($1))
                    OR unaccent(projectname) % unaccent($1)
                    OR unaccent(description) % unaccent($1)
            ) AS sub
            ORDER BY (rank * 2) + (sim_name * 3) + (sim_desc * 1) DESC
            LIMIT 30;
        `
        const result = await database.query(queryText, [q]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi truy vấn search' });
    }
}

export { searchProject }