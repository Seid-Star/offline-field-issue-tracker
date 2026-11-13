export function validateRequest({ body, query, params }) {
  return async (req, res, next) => {
    try {
      if (body) {
        req.body = await body.parseAsync(req.body);
      }
      if (query) {
        req.query = await query.parseAsync(req.query);
      }
      if (params) {
        req.params = await params.parseAsync(req.params);
      }
      next();
    } catch (err) {
      if (err.errors) {
        const details = {};
        for (const issue of err.errors) {
          const path = issue.path.join('.') || 'root';
          details[path] = issue.message;
        }
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request payload validation failed.',
            details,
          },
        });
      }
      next(err);
    }
  };
}

