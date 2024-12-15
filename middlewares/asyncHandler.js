const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const wrapAsyncRoutes = (router) => {
  router.stack.forEach((layer) => {
    if (layer.route) {
      layer.route.stack.forEach((routeLayer) => {
        if (typeof routeLayer.handle === "function") {
          routeLayer.handle = asyncHandler(routeLayer.handle);
        }
      });
    } else if (layer.name === "router" && layer.handle.stack) {
      wrapAsyncRoutes(layer.handle);
    }
  });

  return router;
};
